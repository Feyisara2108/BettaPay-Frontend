"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { loginSchema, LoginFormValues } from '@/lib/utils/validation';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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

      // Set cookies for middleware
      document.cookie = `auth_token=${mockToken}; path=/`;
      document.cookie = `user_role=${role}; path=/`;

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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
            <ShieldCheck className="w-8 h-8 text-primary relative z-10" />
          </div>
        </div>

        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-8 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome back</CardTitle>
            <CardDescription className="text-zinc-400 text-base">
              Sign in to manage your payments
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  {...register('email')} 
                  className="bg-zinc-950/50 h-12 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
                {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-300">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  {...register('password')} 
                  className="bg-zinc-950/50 h-12 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pb-8 pt-4 px-8">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(240,165,0,0.3)] transition-all hover:shadow-[0_0_25px_rgba(240,165,0,0.5)]" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Sign In
              </Button>
              <div className="text-sm text-center text-zinc-400">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-white hover:text-primary transition-colors font-medium">
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
