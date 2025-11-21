
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

import { useAuthUser, useFirestore } from '@/firebase/provider';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'samuelhelp80@gmail.com',
      password: '123456',
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    if (!auth || !firestore) {
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
        // If user is not found, create the user and their Firestore record
        if (error.code === 'auth/user-not-found') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                const user = userCredential.user;

                const userDocRef = doc(firestore, 'users', user.uid);
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: data.email,
                    businessName: 'Admin Account',
                    businessContext: 'This is the admin account for Retail-Assist 3.0.',
                    createdAt: serverTimestamp(),
                });
                
                // Now that the user is created, push to dashboard.
                // Firebase automatically signs in the user after creation.
                router.push('/dashboard');

            } catch (creationError: any) {
                 console.error("User creation error:", creationError);
                 toast({
                     variant: "destructive",
                     title: "Signup Failed",
                     description: "Could not create your account. Please try again.",
                 });
            }
        } else {
            console.error("Login error:", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "Invalid email or password. Please try again.",
            });
        }
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
