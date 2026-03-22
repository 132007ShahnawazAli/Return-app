/**
 * useAppBlocker.ts
 *
 * React hook for managing the app blocking system.
 * Wraps the AppBlocker native module with React state management.
 *
 * Usage:
 *   const { isEnabled, blockedApps, setBlockedApps, openSettings } = useAppBlocker();
 */

import AppBlocker from '@/src/native/AppBlocker';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

export function useAppBlocker() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [blockedApps, setBlockedAppsState] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── Check service status ────────────────────────────────────────────────

    const checkStatus = useCallback(async () => {
        if (Platform.OS !== 'android') {
            setIsLoading(false);
            return;
        }

        try {
            const [enabled, apps] = await Promise.all([
                AppBlocker.isAccessibilityServiceEnabled(),
                AppBlocker.getBlockedApps(),
            ]);
            setIsEnabled(enabled);
            setBlockedAppsState(apps);
        } catch (error) {
            console.error('[useAppBlocker] Failed to check status:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Re-check when app comes to foreground
    useEffect(() => {
        checkStatus();

        const sub = AppState.addEventListener('change', (state) => {
            if (state === 'active') checkStatus();
        });

        return () => sub.remove();
    }, [checkStatus]);

    // ── Actions ─────────────────────────────────────────────────────────────

    const setBlockedApps = useCallback(async (packageNames: string[]) => {
        await AppBlocker.setBlockedApps(packageNames);
        setBlockedAppsState(packageNames);
    }, []);

    const addBlockedApp = useCallback(async (packageName: string) => {
        const updated = [...blockedApps, packageName];
        await AppBlocker.setBlockedApps(updated);
        setBlockedAppsState(updated);
    }, [blockedApps]);

    const removeBlockedApp = useCallback(async (packageName: string) => {
        const updated = blockedApps.filter((p) => p !== packageName);
        await AppBlocker.setBlockedApps(updated);
        setBlockedAppsState(updated);
    }, [blockedApps]);

    const openSettings = useCallback(async () => {
        await AppBlocker.openAccessibilitySettings();
    }, []);

    return {
        /** Whether the accessibility service is enabled */
        isEnabled,
        /** List of currently blocked package names */
        blockedApps,
        /** Whether we're still loading initial state */
        isLoading,
        /** Replace the entire blocked apps list */
        setBlockedApps,
        /** Add a single app to the blocked list */
        addBlockedApp,
        /** Remove a single app from the blocked list */
        removeBlockedApp,
        /** Open system accessibility settings */
        openSettings,
        /** Re-check service status */
        refresh: checkStatus,
    };
}
