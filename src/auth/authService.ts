// ─── Authentication Service ───────────────────────────────────────────────
// Pure service layer — contains ALL authentication logic.
// No React, no context, no state management — just Supabase + SecureStore.
// Every function returns AuthResponse<T> — never throws.

import { removeSession, saveSession } from '@/src/storage/secureStorage';
import type { AuthResponse } from '@/src/types/authTypes';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// ── Sign Up ───────────────────────────────────────────────────────────────

/**
 * Register a new account with email + password.
 * On success the session is persisted to SecureStore.
 */
export async function signUp(
    email: string,
    password: string
): Promise<AuthResponse<{ user: User; session: Session }>> {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data.user || !data.session) {
            return {
                success: false,
                error: 'Account created! Please check your email inbox to confirm your account and log in.',
            };
        }

        // Persist session to SecureStore for offline restore.
        await saveSession(data.session);

        return {
            success: true,
            data: { user: data.user, session: data.session },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown sign-up error',
        };
    }
}

// ── Sign In ───────────────────────────────────────────────────────────────

/**
 * Authenticate an existing user with email + password.
 * On success the session is persisted to SecureStore.
 */
export async function signIn(
    email: string,
    password: string
): Promise<AuthResponse<{ user: User; session: Session }>> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data.user || !data.session) {
            return {
                success: false,
                error: 'Sign-in failed: missing user or session data.',
            };
        }

        // Persist session to SecureStore.
        await saveSession(data.session);

        return {
            success: true,
            data: { user: data.user, session: data.session },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown sign-in error',
        };
    }
}

// ── Sign Out ──────────────────────────────────────────────────────────────

/**
 * End the current session and wipe stored tokens.
 * Clears local tokens even if the remote sign-out fails (offline resilience).
 */
export async function signOut(): Promise<AuthResponse> {
    try {
        const { error } = await supabase.auth.signOut();

        // Always clear local session regardless of remote success.
        await removeSession();

        if (error) {
            console.warn('[AuthService] Remote sign-out failed:', error.message);
        }

        return { success: true, data: undefined };
    } catch (error) {
        // Clear tokens even on unexpected errors.
        await removeSession();
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown sign-out error',
        };
    }
}

// ── Get Current User ──────────────────────────────────────────────────────

/**
 * Return the currently authenticated user, or null.
 */
export async function getCurrentUser(): Promise<AuthResponse<User | null>> {
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            // "Auth session missing" is expected when not signed in.
            if (error.message.includes('Auth session missing')) {
                return { success: true, data: null };
            }
            return { success: false, error: error.message };
        }

        return { success: true, data: data.user };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get current user',
        };
    }
}

// ── Restore Session ───────────────────────────────────────────────────────

/**
 * Attempt to restore a previous session from secure storage.
 * Called once during app startup. Works offline because Supabase reads
 * from our SecureStore adapter.
 */
export async function restoreSession(): Promise<
    AuthResponse<{ user: User | null; session: Session | null }>
> {
    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            data: {
                user: data.session?.user ?? null,
                session: data.session,
            },
        };
    } catch (error) {
        // Offline or corrupt storage — return unauthenticated state.
        return {
            success: true,
            data: { user: null, session: null },
        };
    }
}

// ── Auth State Change Listener ────────────────────────────────────────────

/**
 * Subscribe to Supabase auth events (sign-in, sign-out, token refresh).
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
    callback: (user: User | null, session: Session | null) => void
): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null, session);
    });

    return () => {
        data.subscription.unsubscribe();
    };
}
