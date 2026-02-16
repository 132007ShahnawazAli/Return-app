import { useAuthStore } from '@/src/stores/auth-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

// Keep splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

/**
 * AuthProvider — thin wrapper that initializes auth state on mount
 * and hides the splash screen once ready.
 *
 * All actual state lives in the Zustand store (useAuthStore).
 * Components should use `useAuthStore()` directly for auth state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore((s) => s.initialize);
    const isReady = useAuthStore((s) => s.isReady);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    return <>{children}</>;
}
