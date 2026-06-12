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
      
      // Fetch the seeded merchant from the backend
      const { apiClient } = await import('@/lib/api/axios');
      const merchantId = 'GCCHHKNI7GRA5QWC7RCTT3OHO7SKAUMKQA6IBWEQEO2SXI3GF376UHDD';
      const response = await apiClient.get(`/api/merchants/${merchantId}`);
      
      if (!response.data || response.data.error) {
        throw new Error('Merchant not found');
      }

      const mockToken = 'mock_jwt_token_12345';
      const mockUser = {
        id: response.data.id,
        email: data.email,
        name: response.data.name,
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
      toast.error('Failed to authenticate with backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px]"
      >
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
        </div>

        <Card className="border bg-card shadow-sm rounded-xl">
          <CardHeader className="space-y-1.5 text-center pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  {...register('email')} 
                  className="bg-transparent h-10 border-input focus-visible:ring-primary"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  {...register('password')} 
                  className="bg-transparent h-10 border-input focus-visible:ring-primary"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-6">
              <Button type="submit" className="w-full h-10 font-medium" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
