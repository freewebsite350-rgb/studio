
'use client';
import { LoginForm } from '@/components/login-form';
import { AppConfig } from '@/lib/app-config';
import { LogIn } from 'lucide-react';
import { useUser } from '@/firebase/index';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect them to the dashboard.
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // While we check for a user, show a loading screen.
  if (user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is logged in, don't render the login page content
  // while the redirect is happening.
  if (user) {
      return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="flex items-center gap-4 mb-8">
        <LogIn className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Login</h1>
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
