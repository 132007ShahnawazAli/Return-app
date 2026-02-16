import { db } from '@/src/db';
import { settings } from '@/src/db/schema';
import type { User } from '@/src/services/auth';
import * as authService from '@/src/services/auth';
import { eq } from 'drizzle-orm';
import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────
interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isOnboarded: boolean;
    isReady: boolean;

    // Actions
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
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
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    isReady: false,

    initialize: async () => {
        try {
            // Ensure database table exists
            await ensureSettingsTable();

            // Check onboarding status from SQLite
            const onboarded = await getSetting('has_onboarded');

            // Check session from SecureStore
            const session = await authService.getSession();

            set({
                isOnboarded: onboarded === 'true',
                user: session?.user ?? null,
                isAuthenticated: !!session,
                isReady: true,
            });
        } catch (error) {
            console.error('Auth initialization failed:', error);
            set({ isReady: true }); // Still mark as ready so app doesn't hang
        }
    },

    signIn: async (email, password) => {
        const session = await authService.signIn(email, password);
        set({
            user: session.user,
            isAuthenticated: true,
        });
    },

    signUp: async (name, email, password) => {
        const session = await authService.signUp(name, email, password);
        set({
            user: session.user,
            isAuthenticated: true,
        });
    },

    signOut: async () => {
        await authService.signOut();
        set({
            user: null,
            isAuthenticated: false,
        });
    },

    setOnboarded: async (value) => {
        await setSetting('has_onboarded', value ? 'true' : 'false');
        set({ isOnboarded: value });
    },
}));
