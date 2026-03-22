/**
 * InstalledApps.ts
 *
 * TypeScript wrapper around the InstalledAppsModule native Android module.
 *
 * Usage:
 *   import InstalledApps from '@/src/native/InstalledApps';
 *   const apps = await InstalledApps.getInstalledApps();
 *
 * The module is Android-only. On iOS or in Expo Go, `getInstalledApps()`
 * returns an empty array so callers can always fall back gracefully.
 */

import { NativeModules, Platform } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Represents a single installed app as returned by the native module.
 *
 * appName      Human-readable application label (e.g. "Instagram")
 * packageName  Android package identifier (e.g. "com.instagram.android")
 * isSystemApp  True for pre-installed / system partition apps
 * icon         Base64-encoded PNG icon string (48dp, may be undefined)
 */
export type InstalledApp = {
    appName: string;
    packageName: string;
    isSystemApp: boolean;
    icon?: string;
};

// ─── Native Module Interface ─────────────────────────────────────────────────

interface InstalledAppsNativeModule {
    /**
     * Returns a Promise resolving to the list of launchable applications.
     * Results are already sorted alphabetically by appName on the native side.
     *
     * @throws {Error} ERR_PM_UNAVAILABLE – PackageManager is not accessible
     * @throws {Error} ERR_UNEXPECTED     – Any other native error
     */
    getInstalledApps(): Promise<InstalledApp[]>;
}

// ─── Module Resolution ───────────────────────────────────────────────────────

/**
 * Safely retrieve the native module.
 *
 * Returns null when:
 *  - Running on iOS (module not compiled)
 *  - Running in Expo Go (native modules not available)
 *  - Running in a dev environment without a native build
 */
function resolveNativeModule(): InstalledAppsNativeModule | null {
    if (Platform.OS !== 'android') return null;

    const mod = NativeModules.InstalledApps as InstalledAppsNativeModule | undefined;
    if (!mod) {
        console.warn(
            '[InstalledApps] Native module not found. ' +
            'Make sure you are running an Expo Development Build (not Expo Go) ' +
            'and that the app was built with `expo run:android`.'
        );
        return null;
    }

    return mod;
}

// ─── Public API ──────────────────────────────────────────────────────────────

const InstalledApps = {
    /**
     * Fetch all launchable apps installed on the device.
     *
     * - Returns an empty array on non-Android platforms or in Expo Go.
     * - On Android development builds, delegates to the Kotlin native module.
     * - Results are pre-sorted alphabetically (A → Z) by the native layer.
     * - Each app includes a base64 PNG icon when available.
     *
     * @example
     * const apps = await InstalledApps.getInstalledApps();
     * const userApps = apps.filter(a => !a.isSystemApp);
     */
    getInstalledApps: async (): Promise<InstalledApp[]> => {
        const nativeModule = resolveNativeModule();

        if (!nativeModule) {
            return [];
        }

        try {
            return await nativeModule.getInstalledApps();
        } catch (error) {
            console.error('[InstalledApps] getInstalledApps failed:', error);
            throw error;
        }
    },
};

export default InstalledApps;
