/**
 * useInstalledApps.ts
 *
 * React hook that loads launchable installed apps with their icons.
 *
 * Data source:
 *  - InstalledAppsModule (Kotlin) → returns appName, packageName, isSystemApp, icon (base64 PNG)
 *  - Curated FALLBACK_APPS → shown in Expo Go or when native module is unavailable
 *
 * Exposes: loading state, search filtering, multi-selection management.
 */

import InstalledApps, { type InstalledApp } from '@/src/native/InstalledApps';
import { useCallback, useEffect, useMemo, useState } from 'react';

// ─── Re-export the type for convenience ───────────────────────────────────────

export type InstalledAppWithIcon = InstalledApp;

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_APPS: InstalledAppWithIcon[] = [
    { appName: 'Discord', packageName: 'com.discord', isSystemApp: false },
    { appName: 'Facebook', packageName: 'com.facebook.katana', isSystemApp: false },
    { appName: 'Instagram', packageName: 'com.instagram.android', isSystemApp: false },
    { appName: 'LinkedIn', packageName: 'com.linkedin.android', isSystemApp: false },
    { appName: 'Pinterest', packageName: 'com.pinterest', isSystemApp: false },
    { appName: 'Reddit', packageName: 'com.reddit.frontpage', isSystemApp: false },
    { appName: 'Snapchat', packageName: 'com.snapchat.android', isSystemApp: false },
    { appName: 'Spotify', packageName: 'com.spotify.music', isSystemApp: false },
    { appName: 'TikTok', packageName: 'com.zhiliaoapp.musically', isSystemApp: false },
    { appName: 'Twitch', packageName: 'tv.twitch.android.app', isSystemApp: false },
    { appName: 'Twitter / X', packageName: 'com.twitter.android', isSystemApp: false },
    { appName: 'WhatsApp', packageName: 'com.whatsapp', isSystemApp: false },
    { appName: 'YouTube', packageName: 'com.google.android.youtube', isSystemApp: false },
    { appName: 'YouTube Music', packageName: 'com.google.android.apps.youtube.music', isSystemApp: false },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseInstalledAppsOptions {
    filterSystemApps?: boolean;
}

export interface UseInstalledAppsReturn {
    apps: InstalledAppWithIcon[];
    filteredApps: InstalledAppWithIcon[];
    isFallback: boolean;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedPackages: Set<string>;
    toggleApp: (packageName: string) => void;
    isSelected: (packageName: string) => boolean;
    selectedApps: InstalledAppWithIcon[];
}

export function useInstalledApps(
    options: UseInstalledAppsOptions = {}
): UseInstalledAppsReturn {
    const { filterSystemApps = true } = options;

    const [allApps, setAllApps] = useState<InstalledAppWithIcon[]>([]);
    const [isFallback, setIsFallback] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());

    // ── Load apps from native module ────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await InstalledApps.getInstalledApps();
                if (cancelled) return;

                if (result.length === 0) {
                    setAllApps(FALLBACK_APPS);
                    setIsFallback(true);
                } else {
                    setAllApps(result);
                    setIsFallback(false);
                }
            } catch (err) {
                if (cancelled) return;
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
                setAllApps(FALLBACK_APPS);
                setIsFallback(true);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, []);

    // ── Derived state ────────────────────────────────────────────────────────

    const apps = useMemo(
        () => (filterSystemApps ? allApps.filter((a) => !a.isSystemApp) : allApps),
        [allApps, filterSystemApps]
    );

    const filteredApps = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return apps;
        return apps.filter(
            (a) =>
                a.appName.toLowerCase().includes(q) ||
                a.packageName.toLowerCase().includes(q)
        );
    }, [apps, searchQuery]);

    const toggleApp = useCallback((packageName: string) => {
        setSelectedPackages((prev) => {
            const next = new Set(prev);
            next.has(packageName) ? next.delete(packageName) : next.add(packageName);
            return next;
        });
    }, []);

    const isSelected = useCallback(
        (packageName: string) => selectedPackages.has(packageName),
        [selectedPackages]
    );

    const selectedApps = useMemo(
        () => apps.filter((a) => selectedPackages.has(a.packageName)),
        [apps, selectedPackages]
    );

    return {
        apps,
        filteredApps,
        isFallback,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedPackages,
        toggleApp,
        isSelected,
        selectedApps,
    };
}
