'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  isAdminLogin?: boolean;
}

export default function LoginForm({ isAdminLogin = false }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast({ title: 'Logged in successfully', variant: 'default' });

      if (isAdminLogin) router.push('/dashboard');
      else router.push('/client/dashboard');

    } catch (err: any) {
      toast({
        title: 'Login Failed',
        variant: 'destructive',
        description: err.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
          <CardHeader>
            <CardTitle>{isAdminLogin ? 'Admin Login' : 'Welcome Back'}</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-4 items-stretch">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            {!isAdminLogin && (
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/onboarding">Sign up</Link>
                </Button>
              </p>
            )}

            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href={isAdminLogin ? '/login' : '/admin/login'}>
                {isAdminLogin ? 'Client Login' : 'Admin Login'}
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}