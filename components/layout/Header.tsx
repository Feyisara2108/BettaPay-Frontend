"use client";

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header({ onConnect }: { onConnect?: () => void }) {
  return (
    <header className="w-full border-b bg-brand-surface/60 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-brand-accent" />
          </div>
          <Link href="/" className="text-lg font-semibold text-brand-text-primary">BettaPay</Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-brand-text-muted">
          <Link href="#features" className="hover:text-brand-text-primary">Features</Link>
          <Link href="#developers" className="hover:text-brand-text-primary">Developers</Link>
          <Link href="#company" className="hover:text-brand-text-primary">Company</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" className="text-brand-text-muted">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-brand-accent text-white">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
