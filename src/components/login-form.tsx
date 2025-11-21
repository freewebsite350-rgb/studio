
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

import { useAuthUser } from '@/firebase/provider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const auth = useAuthUser();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Firebase not initialized",
            description: "Please try again later.",
        });
        setIsLoading(false);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Login error:", error);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
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
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
                <CardFooter className="flex-col gap-4 items-stretch">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : 'Login'}
                    </Button>
                     <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Button variant="link" className="p-0 h-auto" asChild>
                            <Link href="/onboarding">Sign up</Link>
                        </Button>
                    </p>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
