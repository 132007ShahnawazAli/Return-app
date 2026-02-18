import { db } from '@/src/db';
import { settings } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────
interface AppState {
    // State
    isOnboarded: boolean;
    isReady: boolean;

    // Actions
    initialize: () => Promise<void>;
    setOnboarded: (value: boolean) => Promise<void>;
}

// ─── Settings Helpers ────────────────────────────────────────────────
async function ensureSettingsTable() {
    try {
        // Create settings table if it doesn't exist
        const sqliteDb = (db as any).$client;
        sqliteDb.execSync(
            `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );`
        );
    } catch (error) {
        console.error('Failed to ensure settings table:', error);
    }
}

async function getSetting(key: string): Promise<string | null> {
    try {
        const result = await db
            .select()
            .from(settings)
            .where(eq(settings.key, key))
            .limit(1);

        return result.length > 0 ? result[0].value : null;
    } catch {
        return null;
    }
}

async function setSetting(key: string, value: string): Promise<void> {
    try {
        await db
            .insert(settings)
            .values({ key, value })
            .onConflictDoUpdate({
                target: settings.key,
                set: { value },
            });
    } catch (error) {
        console.error(`Failed to set setting ${key}:`, error);
    }
}

// ─── Store ───────────────────────────────────────────────────────────
export const useAppStore = create<AppState>((set) => ({
    isOnboarded: false,
    isReady: false,

    initialize: async () => {
        try {
            // Ensure database table exists
            await ensureSettingsTable();

            // Check onboarding status from SQLite
            const onboarded = await getSetting('has_onboarded');

            set({
                isOnboarded: onboarded === 'true',
                isReady: true,
            });
        } catch (error) {
            console.error('App initialization failed:', error);
            set({ isReady: true }); // Still mark as ready so app doesn't hang
        }
    },

    setOnboarded: async (value) => {
        await setSetting('has_onboarded', value ? 'true' : 'false');
        set({ isOnboarded: value });
    },
}));
