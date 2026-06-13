"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  ListOrdered, 
  Wallet, 
  RefreshCcw, 
  Settings, 
  Code2,
  ShieldCheck,
  Building2
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/payments', label: 'Payments', icon: LinkIcon },
  { href: '/transactions', label: 'Transactions', icon: ListOrdered },
  { href: '/settlement', label: 'Settlement', icon: Building2 },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/fx', label: 'FX Rates', icon: RefreshCcw },
  { href: '/developers', label: 'Developers', icon: Code2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const MerchantSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border hidden md:flex" aria-label="Primary">
      {/* Sidebar content */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">BettaPay</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors border-l-2",
                isActive 
                  ? "border-primary bg-sidebar-accent/30 text-sidebar-foreground" 
                  : "border-transparent text-muted-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
            MC
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">Merchant Corp</span>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Verified
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
