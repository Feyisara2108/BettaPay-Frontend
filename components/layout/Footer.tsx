"use client";

import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t mt-16 py-10 bg-brand-surface/60">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-accent" />
          </div>
          <div>
            <div className="font-semibold text-brand-text-primary">BettaPay</div>
            <div className="text-sm text-brand-text-muted">© 2026 BettaPay Inc.</div>
          </div>
        </div>
        <div className="text-sm text-brand-text-muted">Built on Stellar • Non-custodial payments</div>
      </div>
    </footer>
  );
}
