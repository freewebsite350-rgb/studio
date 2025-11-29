'use client';

import { useUser } from './useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type Role = 'admin' | 'client';

/**
 * Client-side HOC for authentication guard.
 * Should only be used on client components within the App Router.
 */
export function withAuth(Component: React.ComponentType<any>, role?: Role) {
  return function WithAuth(props: any) {
    const { isAuthenticated, role: userRole, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      if (!isAuthenticated) {
        router.push('/login');
      } else if (role && userRole !== role) {
        // Redirect unauthorized users
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    }, [isAuthenticated, userRole, isLoading, router, role]);

    if (isLoading || !isAuthenticated || (role && userRole !== role)) {
        // Render a loading state while checking auth
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <Component {...props} />;
  };
}
