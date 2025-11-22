
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'client' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  user: User | null;
}

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<AuthState>({ isAuthenticated: false, role: null, user: null });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          isAuthenticated: true,
          role: session.user.user_metadata.role || null,
          user: session.user,
        });
      } else {
        setUser({ isAuthenticated: false, role: null, user: null });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return user;
}
