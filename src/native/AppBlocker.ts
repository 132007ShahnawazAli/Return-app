/**
 * AppBlocker.ts
 *
 * TypeScript wrapper for the AppBlocker native Android module.
 *
 * Usage:
 *   import AppBlocker from '@/src/native/AppBlocker';
 *
 *   // Set blocked apps
 *   await AppBlocker.setBlockedApps(['com.instagram.android', 'com.zhiliaoapp.musically']);
 *
 *   // Check if accessibility service is enabled
 *   const enabled = await AppBlocker.isAccessibilityServiceEnabled();
 *
 *   // Open settings to enable the service
 *   await AppBlocker.openAccessibilitySettings();
 *
 * Android-only. Returns safe defaults on other platforms.
 */

import { NativeModules, Platform } from 'react-native';

// ─── Native Module Interface ─────────────────────────────────────────────────

interface AppBlockerNativeModule {
    setBlockedApps(packageNames: string[]): Promise<number>;
    getBlockedApps(): Promise<string[]>;
    isAccessibilityServiceEnabled(): Promise<boolean>;
    openAccessibilitySettings(): Promise<boolean>;
}

// ─── Module Resolution ───────────────────────────────────────────────────────

function resolveNativeModule(): AppBlockerNativeModule | null {
    if (Platform.OS !== 'android') return null;

    const mod = NativeModules.AppBlocker as AppBlockerNativeModule | undefined;
    if (!mod) {
        console.warn(
            '[AppBlocker] Native module not found. ' +
            'Make sure you are running an Expo Development Build (not Expo Go) ' +
            'and that the app was built with `expo run:android`.'
        );
        return null;
    }

    return mod;
}

// ─── Public API ──────────────────────────────────────────────────────────────

const AppBlocker = {
    /**
     * Set the list of package names to block.
     * Persists to SharedPreferences and immediately updates the running service.
     *
     * @param packageNames Array of Android package names (e.g. 'com.instagram.android')
     * @returns Number of packages that were set
     */
    setBlockedApps: async (packageNames: string[]): Promise<number> => {
        const mod = resolveNativeModule();
        if (!mod) return 0;

        try {
            return await mod.setBlockedApps(packageNames);
        } catch (error) {
            console.error('[AppBlocker] setBlockedApps failed:', error);
            throw error;
        }
    },

    /**
     * Get the current list of blocked package names.
     */
    getBlockedApps: async (): Promise<string[]> => {
        const mod = resolveNativeModule();
        if (!mod) return [];

        try {
            return await mod.getBlockedApps();
        } catch (error) {
            console.error('[AppBlocker] getBlockedApps failed:', error);
            throw error;
        }
    },

    /**
     * Check if the accessibility service is currently enabled by the user.
     *
     * @returns true if enabled, false otherwise
     */
    isAccessibilityServiceEnabled: async (): Promise<boolean> => {
        const mod = resolveNativeModule();
        if (!mod) return false;

        try {
            return await mod.isAccessibilityServiceEnabled();
        } catch (error) {
            console.error('[AppBlocker] isAccessibilityServiceEnabled failed:', error);
            return false;
        }
    },

    /**
     * Open the system Accessibility Settings screen.
     * Call this during onboarding to guide the user to enable the service.
     */
    openAccessibilitySettings: async (): Promise<boolean> => {
        const mod = resolveNativeModule();
        if (!mod) return false;

        try {
            return await mod.openAccessibilitySettings();
        } catch (error) {
            console.error('[AppBlocker] openAccessibilitySettings failed:', error);
            return false;
        }
    },
};

export default AppBlocker;
