
import { useEffect, useState } from 'react';
import { useAuthUser } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type UserRole = 'admin' | 'client' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  user: User | null;
}

export function useUser() {
  const auth = useAuthUser();
  const [user, setUser] = useState<AuthState>({ isAuthenticated: false, role: null, user: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        const role = token.claims.role as UserRole;
        setUser({ isAuthenticated: true, role, user });
      } else {
        setUser({ isAuthenticated: false, role: null, user: null });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return user;
}
