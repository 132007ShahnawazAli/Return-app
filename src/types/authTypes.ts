// ─── Authentication Type Definitions ──────────────────────────────────────
// All auth-related types in one place.
// UI components import from here — never from Supabase directly.

import type { Session, User } from '@supabase/supabase-js';

// ── Response Type ─────────────────────────────────────────────────────────
// Every auth function returns this shape — callers pattern-match on `success`.

export type AuthResponse<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

// ── Auth State ────────────────────────────────────────────────────────────
// The shape of authentication state held in context.

export interface AuthState {
    /** The currently authenticated Supabase user. */
    user: User | null;
    /** The active Supabase session (contains tokens). */
    session: Session | null;
    /** True while restoring session or performing auth operations. */
    loading: boolean;
    /** Convenience flag — true when `user` is non-null. */
    isAuthenticated: boolean;
}

// ── Context Type ──────────────────────────────────────────────────────────
// What the AuthContext exposes to consumers via `useAuth()`.

export interface AuthContextType {
    /** The authenticated user, or null. */
    user: User | null;
    /** The active session, or null. */
    session: Session | null;
    /** True while auth state is being determined. */
    loading: boolean;
    /** True when a valid session exists. */
    isAuthenticated: boolean;

    /** Register a new account with email + password. */
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    /** Authenticate with email + password. */
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    /** End the session and clear stored tokens. */
    signOut: () => Promise<AuthResponse>;
}
