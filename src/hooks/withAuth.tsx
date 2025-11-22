
import { useUser } from './useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Role = 'admin' | 'client';

export function withAuth(Component: React.ComponentType<any>, role?: Role) {
  return function WithAuth(props: any) {
    const { isAuthenticated, role: userRole } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role && userRole !== role) {
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    }, [isAuthenticated, userRole, router]);

    return <Component {...props} />;
  };
}
