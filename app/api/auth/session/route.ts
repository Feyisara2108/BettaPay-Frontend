import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/utils/csrf';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.token;
    const role = body.role || '';

    const res = NextResponse.json({ ok: true });

    // Set HttpOnly cookie for auth token
    // NOTE: In production set Secure=true and proper domain attributes
    res.headers.set('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; SameSite=Lax`);
    // Also set a non-HttpOnly role cookie so middleware/server-side can read role where needed
    res.headers.append('Set-Cookie', `user_role=${role}; Path=/; SameSite=Lax`);
    // Set CSRF token cookie (non-HttpOnly so the client JS can read it for double-submit)
    const csrfToken = generateCsrfToken();
    res.headers.append('Set-Cookie', `csrf_token=${csrfToken}; Path=/; SameSite=Strict; Max-Age=86400`);

    return res;
  } catch (error) {
    console.error('Failed to set session:', error);
    return NextResponse.json({ ok: false, error: 'Failed to set session' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  // Clear cookies
  res.headers.set('Set-Cookie', `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  res.headers.append('Set-Cookie', `user_role=; Path=/; Max-Age=0; SameSite=Lax`);
  res.headers.append('Set-Cookie', `csrf_token=; Path=/; Max-Age=0; SameSite=Strict`);
  return res;
}
