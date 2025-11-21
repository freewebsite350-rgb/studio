
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuthUser } from '../provider';

export function useUser() {
  const auth = useAuthUser();
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return user;
}
