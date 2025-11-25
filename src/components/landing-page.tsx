'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const router = useRouter();
  const user = useUser(); // can be null on first load

  const handleDemoClick = () => {
    if (!user) return router.push('/login');

    if (user.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to the App</h1>

      <Button onClick={handleDemoClick} size="lg">
        Enter App
      </Button>
    </div>
  );
}