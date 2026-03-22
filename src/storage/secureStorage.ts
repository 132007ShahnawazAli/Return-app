// ─── Secure Session Storage ───────────────────────────────────────────────
// Wraps expo-secure-store to persist and retrieve the Supabase session.
// Tokens are encrypted at rest via the OS keychain (Keystore on Android,
// Keychain on iOS). Never uses AsyncStorage.
//
// API:
//   saveSession(session)  — persist the Supabase session
//   getSession()          — retrieve the stored session, or null
//   removeSession()       — wipe all stored session data

import type { Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// ── Storage Key ───────────────────────────────────────────────────────────
const SESSION_KEY = 'returnapp_auth_session';

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Persist the full Supabase session to secure storage.
 * This is called after successful sign-in / sign-up.
 */
export async function saveSession(session: Session): Promise<void> {
    try {
        const serialized = JSON.stringify(session);
        await SecureStore.setItemAsync(SESSION_KEY, serialized);
    } catch (error) {
        console.error('[SecureStorage] Failed to save session:', error);
        throw error;
    }
}

/**
 * Retrieve the previously stored session.
 * Returns `null` if no session exists or if storage is corrupted.
 */
export async function getSession(): Promise<Session | null> {
    try {
        const serialized = await SecureStore.getItemAsync(SESSION_KEY);
        if (!serialized) return null;
        return JSON.parse(serialized) as Session;
    } catch (error) {
        console.error('[SecureStorage] Failed to retrieve session:', error);
        return null;
    }
}

/**
 * Remove the stored session (called on sign-out).
 * Silently succeeds even if no session exists.
 */
export async function removeSession(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch (error) {
        console.error('[SecureStorage] Failed to remove session:', error);
    }
}
