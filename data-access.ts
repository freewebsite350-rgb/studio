import { createClient } from './supabase/server';

const ADMIN_CONFIG_DOC_ID = 'app_configuration';
const ADMIN_CONTEXT_TABLE = 'admin_context'; // Assuming a table name for admin context

/**
 * Retrieves the admin business context from Supabase.
 * This replaces the Firebase Firestore logic in admin-qa-flow.ts.
 * @returns The admin business context string.
 */
export async function getAdminBusinessContext(): Promise<string> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from(ADMIN_CONTEXT_TABLE)
            .select('adminBusinessContext')
            .eq('id', ADMIN_CONFIG_DOC_ID)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error('Supabase error fetching admin context:', error);
        }

        if (data && data.adminBusinessContext) {
            return data.adminBusinessContext;
        }

        // Return a default fallback if the document doesn't exist
        return "Retail-Assist 3.0 is an AI assistant for small businesses. Please configure its context in the admin settings.";
    } catch (e) {
        console.error('Unexpected error in getAdminBusinessContext:', e);
        return "Retail-Assist 3.0 is an AI assistant for small businesses. Please configure its context in the admin settings.";
    }
}

/**
 * Retrieves the user's business context from Supabase.
 * This replaces the Firebase Firestore logic for user-specific context.
 * @param userId The ID of the user.
 * @returns The user's business context string.
 */
export async function getUserBusinessContext(userId: string): Promise<string> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('user_profiles') // Assuming a table named 'user_profiles'
            .select('business_context')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error(`Supabase error fetching user context for ${userId}:`, error);
        }

        if (data && data.business_context) {
            return data.business_context;
        }

        return "The user has not configured their business context yet.";
    } catch (e) {
        console.error('Unexpected error in getUserBusinessContext:', e);
        return "The user has not configured their business context yet.";
    }
}

/**
 * Retrieves the user's Facebook Page ID from Supabase.
 * This replaces the Firebase Firestore logic for Facebook Webhook user lookups.
 * @param userId The ID of the user.
 * @returns The user's Facebook Page ID string or null.
 */
export async function getFacebookPageId(userId: string): Promise<string | null> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('user_profiles') // Assuming a table named 'user_profiles'
            .select('facebook_page_id')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error(`Supabase error fetching Facebook Page ID for ${userId}:`, error);
        }

        if (data && data.facebook_page_id) {
            return data.facebook_page_id;
        }

        return null;
    } catch (e) {
        console.error('Unexpected error in getFacebookPageId:', e);
        return null;
    }
}

/**
 * Retrieves a list of products for a user.
 * This replaces the Firebase Firestore logic for product-list.tsx.
 * @param userId The ID of the user.
 * @returns A list of products.
 */
export async function getProducts(userId: string): Promise<any[]> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('products') // Assuming a table named 'products'
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error(`Supabase error fetching products for ${userId}:`, error);
            return [];
        }

        return data || [];
    } catch (e) {
        console.error('Unexpected error in getProducts:', e);
        return [];
    }
}

/**
 * Retrieves a user's profile.
 * This replaces the Firebase Firestore logic for useUser.ts.
 * @param userId The ID of the user.
 * @returns The user's profile data.
 */
export async function getUserProfile(userId: string): Promise<any | null> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('user_profiles') // Assuming a table named 'user_profiles'
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error(`Supabase error fetching user profile for ${userId}:`, error);
        }

        return data || null;
    } catch (e) {
        console.error('Unexpected error in getUserProfile:', e);
        return null;
    }
}
