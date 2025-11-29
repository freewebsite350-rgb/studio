import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Role = 'admin' | 'client';

/**
 * Server-side function to get the authenticated user and their profile.
 * @returns The user object and their profile data, or null if unauthenticated.
 */
export async function getAuthenticatedUser() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  // Fetch user profile to get the role
  const { data: profile, error } = await supabase
    .from('user_profiles') // Assuming 'user_profiles' table holds the role
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return { user, profile: null };
  }

  return { user, profile };
}

/**
 * Server-side authentication guard for Next.js Server Components.
 * Redirects unauthenticated users to /login and unauthorized users to the appropriate dashboard.
 * @param requiredRole The role required to access the page.
 */
export async function requireAuth(requiredRole?: Role) {
  const { user, profile } = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  const userRole = profile?.role || 'client'; // Default to 'client' if role is missing

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'admin') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }

  return { user, userRole };
}
