
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface OnboardingData {
  email: string;
  password: string;
  businessName: string;
  contactEmail: string;
}

export function OnboardingWizard() {
  const [form, setForm] = useState<OnboardingData>({
    email: '',
    password: '',
    businessName: '',
    contactEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1️⃣ Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user.');

      // 2️⃣ Insert business info
      const { error: insertError } = await supabase
        .from('businesses')
        .insert({
          user_id: authData.user.id,
          business_name: form.businessName,
          contact_email: form.contactEmail,
        });

      if (insertError) throw insertError;

      toast({ title: 'Signup successful!' });
      router.push('/login');
    } catch (err: any) {
      toast({ title: 'Error', variant: 'destructive', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Input
          placeholder="Business Name"
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
        />
        <Input
          placeholder="Contact Email"
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </CardFooter>
    </Card>
  );
}