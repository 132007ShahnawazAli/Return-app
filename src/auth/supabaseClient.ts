// ─── Supabase Client ──────────────────────────────────────────────────────
// Initialises a single Supabase client instance for the entire app.
// Uses expo-secure-store for session persistence instead of the default
// localStorage (which doesn't exist in React Native).

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// ── Environment Variables ─────────────────────────────────────────────────
// Read from Expo's environment config. In production you'd set these via
// `app.config.ts` or `.env` files consumed by `expo-constants`.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (
    !process.env.EXPO_PUBLIC_SUPABASE_URL ||
    !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
) {
    console.warn(
        '[SupabaseClient] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Authentication features will not work until these are set in your .env file.'
    );
}

// ── Custom Storage Adapter ────────────────────────────────────────────────
// Supabase GoTrueClient expects a `storage` object with `getItem`,
// `setItem`, and `removeItem`. We bridge it to expo-secure-store
// so tokens are always encrypted at rest via the OS keychain.

const SecureStoreAdapter = {
    /**
     * Retrieve the session JSON previously stored by Supabase.
     */
    getItem: async (key: string): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            return null;
        }
    },

    /**
     * Persist the session JSON.
     */
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error('[SupabaseClient] Failed to store session:', error);
        }
    },

    /**
     * Remove the session JSON (called on sign-out).
     */
    removeItem: async (key: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error('[SupabaseClient] Failed to remove session:', error);
        }
    },
};

// ── Client Instance ───────────────────────────────────────────────────────
// A single, long-lived client used throughout the app.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        // Use our secure adapter instead of default localStorage.
        storage: SecureStoreAdapter,
        // Automatically refresh tokens in the background.
        autoRefreshToken: true,
        // Persist the session between app launches.
        persistSession: true,
        // Disable the URL-based detection (not applicable in React Native).
        detectSessionInUrl: false,
    },
});
