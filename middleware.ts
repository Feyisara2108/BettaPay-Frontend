import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isPublicPayPage = request.nextUrl.pathname.startsWith('/pay');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || 
                       request.nextUrl.pathname === '/overview' ||
                       request.nextUrl.pathname === '/merchants' ||
                       request.nextUrl.pathname === '/anchors' ||
                       request.nextUrl.pathname === '/fx-management' ||
                       request.nextUrl.pathname === '/compliance';
  
  // Allow public access to payment links
  if (isPublicPayPage) {
    return NextResponse.next();
  }

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage) {
    if (token) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Require auth for everything else
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based protection
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // redirect merchants from admin
  }
  
  // Protect merchant routes from admins
  const isMerchantRoute = request.nextUrl.pathname === '/dashboard' ||
                          request.nextUrl.pathname === '/payments' ||
                          request.nextUrl.pathname === '/transactions' ||
                          request.nextUrl.pathname === '/settlement' ||
                          request.nextUrl.pathname === '/wallet' ||
                          request.nextUrl.pathname === '/fx' ||
                          request.nextUrl.pathname === '/developers' ||
                          request.nextUrl.pathname === '/settings';
                          
  if (isMerchantRoute && role === 'admin') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
