// ─── Database Migrations ──────────────────────────────────────────────────
// Sequential, versioned schema migrations for the local SQLite database.
// Each migration is defined as a plain object with a `version` number and
// a list of SQL statements to execute.
//
// Design decisions:
// - Migrations run inside a transaction — if one statement fails, the
//   entire migration is rolled back.
// - A `_migrations` meta-table tracks which versions have been applied.
// - Migrations MUST be append-only. Never edit a migration that has shipped.

import type { SQLiteDatabase } from 'expo-sqlite';

// ── Migration Definitions ─────────────────────────────────────────────────

interface Migration {
    /** Monotonically increasing version number (starts at 1). */
    version: number;
    /** Human-readable label for logging. */
    description: string;
    /** SQL statements to execute (in order). */
    statements: string[];
}

/**
 * Complete, ordered list of migrations.
 * To add a new migration, append a new entry at the bottom.
 */
const MIGRATIONS: Migration[] = [
    {
        version: 1,
        description: 'Create core tables: settings, blocked_apps, focus_sessions, schedules, usage_logs',
        statements: [
            // ── Settings (key-value store) ──────────────────────────────────────
            `CREATE TABLE IF NOT EXISTS settings (
        key    TEXT PRIMARY KEY NOT NULL,
        value  TEXT NOT NULL
      );`,

            // ── Blocked Apps ────────────────────────────────────────────────────
            `CREATE TABLE IF NOT EXISTS blocked_apps (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        package_name  TEXT    NOT NULL UNIQUE,
        app_name      TEXT    NOT NULL,
        created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
        remote_id     TEXT,
        is_synced     INTEGER NOT NULL DEFAULT 0
      );`,

            // ── Focus Sessions ──────────────────────────────────────────────────
            `CREATE TABLE IF NOT EXISTS focus_sessions (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time        TEXT    NOT NULL,
        end_time          TEXT,
        duration_seconds  INTEGER,
        status            TEXT    NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'abandoned')),
        created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
        remote_id         TEXT,
        is_synced         INTEGER NOT NULL DEFAULT 0
      );`,

            // ── Schedules ───────────────────────────────────────────────────────
            `CREATE TABLE IF NOT EXISTS schedules (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT    NOT NULL,
        days_of_week  TEXT    NOT NULL,
        start_time    TEXT    NOT NULL,
        end_time      TEXT    NOT NULL,
        is_active     INTEGER NOT NULL DEFAULT 1,
        created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
        remote_id     TEXT,
        is_synced     INTEGER NOT NULL DEFAULT 0
      );`,

            // ── Usage Logs ──────────────────────────────────────────────────────
            `CREATE TABLE IF NOT EXISTS usage_logs (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        package_name      TEXT    NOT NULL,
        duration_seconds  INTEGER NOT NULL,
        date              TEXT    NOT NULL,
        created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
        remote_id         TEXT,
        is_synced         INTEGER NOT NULL DEFAULT 0
      );`,

            // ── Indexes ─────────────────────────────────────────────────────────
            `CREATE INDEX IF NOT EXISTS idx_usage_logs_date
        ON usage_logs (date);`,

            `CREATE INDEX IF NOT EXISTS idx_usage_logs_package
        ON usage_logs (package_name);`,

            `CREATE INDEX IF NOT EXISTS idx_focus_sessions_status
        ON focus_sessions (status);`,

            // ── Onboarding Responses (carry over from existing schema) ─────────
            `CREATE TABLE IF NOT EXISTS onboarding_responses (
        key    TEXT PRIMARY KEY NOT NULL,
        value  TEXT NOT NULL
      );`,
        ],
    },

    // ── Future migrations go here ─────────────────────────────────────────
    // {
    //   version: 2,
    //   description: 'Add screen_time_goals table',
    //   statements: [
    //     `CREATE TABLE IF NOT EXISTS screen_time_goals ( ... );`,
    //   ],
    // },
];

// ── Migration Runner ──────────────────────────────────────────────────────

/**
 * Run all pending migrations sequentially.
 * Called once during app startup via `initDatabase()`.
 */
export async function runMigrations(sqliteDb: SQLiteDatabase): Promise<void> {
    // Ensure the meta-table exists.
    sqliteDb.execSync(
        `CREATE TABLE IF NOT EXISTS _migrations (
      version     INTEGER PRIMARY KEY,
      description TEXT,
      applied_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );`
    );

    // Determine the current database version.
    const stmt = sqliteDb.prepareSync('SELECT MAX(version) as max_version FROM _migrations');
    let currentVersion = 0;
    try {
        const rows = stmt.executeSync().getAllSync() as { max_version: number | null }[];
        currentVersion = rows[0]?.max_version ?? 0;
    } finally {
        stmt.finalizeSync();
    }

    // Apply each pending migration inside a transaction.
    for (const migration of MIGRATIONS) {
        if (migration.version <= currentVersion) continue;

        console.log(
            `[Migrations] Applying v${migration.version}: ${migration.description}`
        );

        try {
            sqliteDb.execSync('BEGIN TRANSACTION;');

            for (const sql of migration.statements) {
                sqliteDb.execSync(sql);
            }

            // Record that this migration has been applied.
            sqliteDb.execSync(
                `INSERT INTO _migrations (version, description) VALUES (${migration.version}, '${migration.description.replace(/'/g, "''")}');`
            );

            sqliteDb.execSync('COMMIT;');
            console.log(`[Migrations] ✓ v${migration.version} applied.`);
        } catch (error) {
            sqliteDb.execSync('ROLLBACK;');
            console.error(
                `[Migrations] ✗ v${migration.version} failed, rolled back:`,
                error
            );
            throw error;
        }
    }

    console.log(`[Migrations] Database is at version ${MIGRATIONS.length}.`);
}
