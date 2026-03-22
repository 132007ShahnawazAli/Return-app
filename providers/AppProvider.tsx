// ─── App Provider ─────────────────────────────────────────────────────────
// Root provider that wraps the entire app.
// Responsibilities:
//   1. Initialise the SQLite database (via useAppStore)
//   2. Provide authentication context (via AuthProvider)

import { AuthProvider } from '@/src/auth/authContext';
import { useAppStore } from '@/src/stores/app-store';
import React, { useEffect } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAppStore((s) => s.initialize);

    // Initialise database and read persisted settings on mount.
    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
