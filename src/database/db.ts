// ─── Database Module ──────────────────────────────────────────────────────
// Central database initialisation and query interface.
// Uses expo-sqlite directly for migrations and exposes both the raw
// SQLite connection and the Drizzle ORM instance.
//
// Architecture note:
// - Drizzle is used for type-safe queries in repositories.
// - Raw SQLite is used for migrations (Drizzle doesn't auto-migrate).
// - The database initialises synchronously (openDatabaseSync) so it's
//   available immediately when the app module graph loads.

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { runMigrations } from './migrations';

// ── Database Instance ─────────────────────────────────────────────────────

/** The raw expo-sqlite database handle. */
const sqliteDb: SQLiteDatabase = openDatabaseSync('returnapp.db', {
    enableChangeListener: true,
});

/** Drizzle ORM wrapper — used by repositories for type-safe queries. */
export const db = drizzle(sqliteDb);

/** Expose the raw SQLite handle for migration scripts and advanced queries. */
export { sqliteDb };

// ── Initialisation ────────────────────────────────────────────────────────

let _isInitialised = false;

/**
 * Initialise the database:
 * 1. Enable WAL mode for better concurrent read performance.
 * 2. Run all pending schema migrations.
 *
 * This function is idempotent — safe to call multiple times.
 * Must be awaited before any repository method is used.
 */
export async function initDatabase(): Promise<void> {
    if (_isInitialised) return;

    try {
        // WAL mode gives significantly better read performance and allows
        // concurrent readers, which matters during sync operations.
        sqliteDb.execSync('PRAGMA journal_mode = WAL;');

        // Foreign keys are off by default in SQLite — enable them.
        sqliteDb.execSync('PRAGMA foreign_keys = ON;');

        // Run schema migrations (creates tables, adds columns, etc.).
        await runMigrations(sqliteDb);

        _isInitialised = true;
        console.log('[Database] Initialised successfully.');
    } catch (error) {
        console.error('[Database] Initialisation failed:', error);
        throw error;
    }
}

// ── Query Helpers ─────────────────────────────────────────────────────────

/**
 * Execute a raw SQL statement and return typed rows.
 * Useful for one-off queries that don't justify a full repository method.
 */
export function rawQuery<T = Record<string, unknown>>(
    sql: string,
    params: (string | number | null)[] = []
): T[] {
    const statement = sqliteDb.prepareSync(sql);
    try {
        return statement.executeSync(params).getAllSync() as T[];
    } finally {
        statement.finalizeSync();
    }
}

/**
 * Execute a raw SQL mutation (INSERT / UPDATE / DELETE).
 * Returns the number of rows changed.
 */
export function rawExecute(
    sql: string,
    params: (string | number | null)[] = []
): { changes: number } {
    const statement = sqliteDb.prepareSync(sql);
    try {
        const result = statement.executeSync(params);
        // expo-sqlite v16 returns { changes: { changes: number, lastInsertRowId: number } }
        const rawChanges = result.changes;
        const count =
            typeof rawChanges === 'number'
                ? rawChanges
                : (rawChanges as any)?.changes ?? 0;
        return { changes: count };
    } finally {
        statement.finalizeSync();
    }
}
