import { useAppStore } from '@/src/stores/app-store';
import React, { useEffect } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAppStore((s) => s.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <>{children}</>;
}
