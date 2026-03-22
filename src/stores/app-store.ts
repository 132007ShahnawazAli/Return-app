// ─── App Store ────────────────────────────────────────────────────────────
// Zustand store for NON-AUTH app state:
//   • Database initialisation & readiness
//   • Onboarding completion status
//
// Authentication is handled entirely by AuthContext / useAuth().
// This store does NOT hold user, session, or auth-related state.

import { initDatabase } from '@/src/database/db';
import { settingsRepo } from '@/src/database/repositories';
import { create } from 'zustand';

// ── State Interface ───────────────────────────────────────────────────────

interface AppState {
    /** True once the database has been initialised and settings read. */
    isReady: boolean;
    /** Non-null if startup failed. */
    initError: string | null;
    /** True once the user has completed onboarding. */
    isOnboarded: boolean;

    /** Initialise the database and hydrate settings. */
    initialize: () => Promise<void>;
    /** Mark onboarding as complete or incomplete (persists to SQLite). */
    setOnboarded: (value: boolean) => Promise<void>;
}

// ── Store ─────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set) => ({
    isReady: false,
    initError: null,
    isOnboarded: false,

    // ── Initialize ──────────────────────────────────────────────────────
    initialize: async () => {
        try {
            // 1. Initialise the local database (runs migrations).
            await initDatabase();

            // 2. Read persisted onboarding status.
            const onboardedResult = await settingsRepo.getSetting('has_onboarded');
            const isOnboarded =
                onboardedResult.success && onboardedResult.data === 'true';

            // 3. Mark app as ready.
            set({ isReady: true, isOnboarded, initError: null });

            console.log(`[AppStore] Initialised — onboarded: ${isOnboarded}`);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown initialization error';
            console.error('[AppStore] Initialization failed:', message);

            // Still mark as ready so the app doesn't hang on the splash screen.
            set({ isReady: true, initError: message });
        }
    },

    // ── Onboarding ──────────────────────────────────────────────────────
    setOnboarded: async (value) => {
        await settingsRepo.setSetting('has_onboarded', value ? 'true' : 'false');
        set({ isOnboarded: value });
    },
}));
