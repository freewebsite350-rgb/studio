'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/lib/data-access"; // Import the new data access function

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      setIsLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user ?? null;
      setUser(user);

      if (user) {
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        getUser();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    role: profile?.role || 'client', // Assuming role is on the profile
  };
}
