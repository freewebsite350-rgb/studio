
'use client';

import { LandingPage } from '@/components/landing-page';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
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

  // If a user is logged in, don't render the landing page while redirecting.
  if (user) {
    return null;
  }
  
  // Only show the landing page if the user is not logged in.
  return (
    <main className="flex flex-1 flex-col">
      <LandingPage />
    </main>
  );
}
