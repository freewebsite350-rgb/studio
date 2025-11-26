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

export default function LoginSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [facebookPageId, setFacebookPageId] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return setError(error.message);

    router.push('/dashboard');
  };

  // SIGN UP
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

    if (error) return setError(error.message);

    if (data?.user) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          facebook_page_id: facebookPageId,
        },
      ]);

      if (insertError) return setError(insertError.message);
    }

    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* LOGIN */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your email to log in.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full">Login</Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <Link href="/" className="underline">Back to Home</Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIGN UP */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="grid gap-4">

                <div className="grid gap-2">
                  <Label>Business Name</Label>
                  <Input
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Facebook Page ID</Label>
                  <Input
                    required
                    value={facebookPageId}
                    onChange={(e) => setFacebookPageId(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full">Create Account</Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <Link href="/" className="underline">Back to Home</Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </main>
  );
}