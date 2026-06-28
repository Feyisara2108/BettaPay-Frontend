"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  ListOrdered, 
  Wallet, 
  Settings 
} from 'lucide-react';

const mobileNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/payments', label: 'Payments', icon: LinkIcon },
  { href: '/transactions', label: 'History', icon: ListOrdered },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 md:hidden left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 pt-2 pb-safe sm:pb-3 flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-[68px] gap-1 py-1.5 rounded-lg transition-all",
              isActive 
                ? "text-amber-700 bg-amber-50" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-amber-600" : "text-slate-400")} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
