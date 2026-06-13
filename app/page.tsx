"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap, Globe, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] selection:bg-brand-accent/30 selection:text-white">
      <Header />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Now live on Soroban Testnet
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tighter max-w-4xl mx-auto leading-tight"
          >
            Settle Globally. <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
              Instantly & Non-Custodial.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            The next-generation merchant payment platform for African businesses. Accept USDC, auto-convert via SEP-24 anchors, and get settled directly to your bank.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register">
              <Button className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(240,165,0,0.4)]">
                Start Accepting Crypto
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-zinc-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Powered by Stellar & Soroban</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Enterprise-grade payment infrastructure designed for speed, low fees, and perfect transparency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Settlement",
                desc: "Transactions settle in 3-5 seconds. No more waiting days for cross-border wires to clear."
              },
              {
                icon: Globe,
                title: "SEP-24 Fiat Off-Ramps",
                desc: "Automated routing to Stellar Anchors for direct-to-bank Nigerian Naira payouts."
              },
              {
                icon: Coins,
                title: "Smart Fee Splits",
                desc: "Soroban contracts automatically calculate and route platform fees trustlessly on-chain."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-900 border border-white/5 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
