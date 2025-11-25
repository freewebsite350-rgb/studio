// src/hooks/useUser.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initial check
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Subscription to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  return user;
}