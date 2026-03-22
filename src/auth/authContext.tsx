// ─── Auth Context ─────────────────────────────────────────────────────────
// Global React Context that manages authentication state.
//
// Responsibilities:
//   • Restore session on mount (app startup)
//   • Listen for Supabase auth events (token refresh, sign-out)
//   • Expose user / loading / auth functions to the component tree
//
// Usage:
//   Wrap your app with <AuthProvider>.
//   In any component: const { user, signIn, signOut } = useAuth();

import {
    signIn as authSignIn,
    signOut as authSignOut,
    signUp as authSignUp,
    onAuthStateChange,
    restoreSession,
} from '@/src/auth/authService';
import type { AuthContextType, AuthResponse } from '@/src/types/authTypes';
import type { Session, User } from '@supabase/supabase-js';
import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

// ── Context ───────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Session Restore (runs once on mount) ──────────────────────────────
    useEffect(() => {
        let mounted = true;

        async function bootstrap() {
            try {
                const result = await restoreSession();

                if (mounted && result.success) {
                    setUser(result.data.user);
                    setSession(result.data.session);
                }
            } catch (err) {
                console.error('[AuthContext] Session restore failed:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        bootstrap();

        return () => {
            mounted = false;
        };
    }, []);

    // ── Auth State Listener (token refresh, external sign-out, etc.) ──────
    useEffect(() => {
        const unsubscribe = onAuthStateChange((newUser, newSession) => {
            setUser(newUser);
            setSession(newSession);
        });

        return unsubscribe;
    }, []);

    // ── Actions ───────────────────────────────────────────────────────────

    const signIn = useCallback(
        async (email: string, password: string): Promise<AuthResponse> => {
            const result = await authSignIn(email, password);

            if (result.success) {
                setUser(result.data.user);
                setSession(result.data.session);
                return { success: true, data: undefined };
            }

            return { success: false, error: result.error };
        },
        []
    );

    const signUp = useCallback(
        async (email: string, password: string): Promise<AuthResponse> => {
            const result = await authSignUp(email, password);

            if (result.success) {
                setUser(result.data.user);
                setSession(result.data.session);
                return { success: true, data: undefined };
            }

            return { success: false, error: result.error };
        },
        []
    );

    const signOut = useCallback(async (): Promise<AuthResponse> => {
        const result = await authSignOut();

        // Always clear local state regardless of remote success.
        setUser(null);
        setSession(null);

        return result;
    }, []);

    // ── Memoised value (prevents unnecessary re-renders) ──────────────────
    const value = useMemo<AuthContextType>(
        () => ({
            user,
            session,
            loading,
            isAuthenticated: !!user,
            signIn,
            signUp,
            signOut,
        }),
        [user, session, loading, signIn, signUp, signOut]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
