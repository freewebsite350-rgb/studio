'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [facebookPageId, setFacebookPageId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'client',
          business_name: businessName,
        },
      },
    });
    if (error) {
      setError(error.message);
    } else if (data.user) {
        const { error: insertError } = await supabase.from('users').insert([
            {
                id: data.user.id,
                facebook_page_id: facebookPageId,
            },
        ]);
        if (insertError) {
            setError(insertError.message);
        } else {
            router.push('/dashboard');
        }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                <Link href="/" className="underline">
                  Back to the main application
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      placeholder="Acme Inc."
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facebook-page-id">Facebook Page ID</Label>
                    <Input
                      id="facebook-page-id"
                      placeholder="e.g., 1234567890"
                      required
                      value={facebookPageId}
                      onChange={(e) => setFacebookPageId(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                <Link href="/" className="underline">
                  Back to the main application
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
