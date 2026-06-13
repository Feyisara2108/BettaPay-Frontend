"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

import { loginSchema, LoginFormValues } from '@/lib/utils/validation';
import { useAuthStore } from '@/lib/store/authStore';
import { useWalletStore } from '@/lib/store/walletStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const WalletModal = dynamic(() => import('@/components/wallet/WalletModal').then(m => m.WalletModal), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { connect } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const isMockAdmin = data.email.includes('admin');
      const role = isMockAdmin ? 'admin' : 'merchant';
      
      let merchantId = 'GCCHHKNI7GRA5QWC7RCTT3OHO7SKAUMKQA6IBWEQEO2SXI3GF376UHDD';
      let merchantName = isMockAdmin ? 'System Admin' : 'Merchant User';

      try {
        // Try fetching the seeded merchant from the backend
        const { apiClient } = await import('@/lib/api/axios');
        const response = await apiClient.get(`/api/merchants/${merchantId}`);
        if (response.data && !response.data.error) {
          merchantId = response.data.id;
          merchantName = response.data.name;
        }
      } catch {
        console.warn('Backend unavailable, falling back to mock auth for Vercel preview.');
      }

      const mockToken = 'mock_jwt_token_12345';
      const mockUser = {
        id: merchantId,
        email: data.email,
        name: merchantName,
        role,
      };

      // Ask the backend to set an HttpOnly auth cookie and store minimal user info client-side
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: mockToken, role }),
        });
      } catch (error) {
        // Backend unavailable; continue without setting insecure client cookies.
        console.warn('Auth session API unavailable; continuing without HttpOnly cookie.', error);
      }

      // Keep token in-memory for current session only (not persisted)
      login(mockToken, mockUser as import('@/lib/types').User);
      toast.success('Login successful');
      
      router.push(role === 'admin' ? '/overview' : '/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  // When WalletModal reports a connected address, perform the merchant login flow
  const onWalletConnected = async (address: string) => {
    setIsWalletLoading(true);
    try {
      const mockToken = 'mock_jwt_token_12345';
      const role = 'merchant';
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: mockToken, role }),
        });
      } catch (error) {
        console.warn('Auth session API unavailable; continuing without HttpOnly cookie.', error);
      }

      login(mockToken, { 
        id: address, 
        email: `${address.substring(0,6)}...${address.slice(-4)}@freighter.app`, 
        name: 'Web3 Merchant', 
        role 
      });
      toast.success('Wallet connected & Logged in!');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete wallet-login flow');
    } finally {
      setIsWalletLoading(false);
    }
  };

  // kept for backward compatibility but no longer used directly
  const handleFreighterLogin = async () => {
    setIsWalletLoading(true);
    try {
      await connect();
      const address = useWalletStore.getState().address;
      if (address) {
        await onWalletConnected(address);
      } else {
        toast.error('Wallet connection was cancelled or Freighter is not installed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect wallet');
    } finally {
      setIsWalletLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <WalletModal open={walletModalOpen} onOpenChange={setWalletModalOpen} onConnected={onWalletConnected} />

      <Card className="rounded-2xl overflow-hidden bg-card/95 ring-1 ring-border/10 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-brand-text-primary">Welcome back</CardTitle>
            <CardDescription className="text-brand-text-muted text-base">
              Sign in to manage your payments
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-brand-text-muted">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  {...register('email')} 
                  className="bg-input h-12 border-border text-brand-text-primary placeholder:text-brand-text-muted focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                />
                {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-brand-text-muted">Password</Label>
                  <Link href="#" className="text-sm text-brand-accent hover:opacity-90 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  {...register('password')} 
                  className="bg-input h-12 border-border text-brand-text-primary placeholder:text-brand-text-muted focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                />
                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pb-8 pt-4 px-8">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(240,165,0,0.3)] transition-all hover:shadow-[0_0_25px_rgba(240,165,0,0.5)]" 
                disabled={isLoading || isWalletLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Sign In
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-brand-text-muted">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline"
                className="w-full h-12 text-base font-medium bg-input border-border text-brand-text-primary hover:opacity-95 transition-all"
                onClick={() => setWalletModalOpen(true)}
                disabled={isLoading || isWalletLoading}
              >
                {isWalletLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Freighter Wallet
              </Button>

              <div className="text-sm text-center text-brand-text-muted">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-brand-accent hover:opacity-90 transition-colors font-medium">
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </form>
      </Card>
    </motion.div>
  );
}
