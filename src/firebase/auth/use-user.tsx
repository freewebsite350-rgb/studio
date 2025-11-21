
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuthUser } from '../provider';

export function useUser() {
  const auth = useAuthUser();
  const [user, setUser] = useState<User | undefined>(undefined); // Start with undefined

  useEffect(() => {
    if (!auth) {
        // Auth might not be available right away, so we wait.
        // The initial state is 'undefined', which we can use for loading states.
        return;
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return user;
}
