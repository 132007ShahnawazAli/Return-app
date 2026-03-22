// ─── useAuth Hook ─────────────────────────────────────────────────────────
// Convenience hook that exposes the AuthContext.
//
// Usage:
//   const { user, loading, signIn, signUp, signOut } = useAuth();
//
// Throws if used outside an <AuthProvider>.

import { AuthContext } from '@/src/auth/authContext';
import type { AuthContextType } from '@/src/types/authTypes';
import { useContext } from 'react';

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth() must be used within an <AuthProvider>. ' +
            'Wrap your app with <AuthProvider> in the root layout.'
        );
    }

    return context;
}
