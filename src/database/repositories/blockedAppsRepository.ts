// ─── Blocked Apps Repository ──────────────────────────────────────────────
// Data-access layer for the `blocked_apps` table.
// This is the only module allowed to read/write blocked-app data.
// UI components and services must go through these functions.

import { rawExecute, rawQuery } from '@/src/database/db';
import type { BlockedApp, Result } from '@/src/types';

// ── Row mapper ────────────────────────────────────────────────────────────

interface BlockedAppRow {
    id: number;
    package_name: string;
    app_name: string;
    created_at: string;
    remote_id: string | null;
    is_synced: number;
}

function mapRow(row: BlockedAppRow): BlockedApp {
    return {
        id: row.id,
        packageName: row.package_name,
        appName: row.app_name,
        createdAt: row.created_at,
        remoteId: row.remote_id ?? undefined,
        isSynced: row.is_synced === 1,
    };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Retrieve every blocked app, ordered by creation date (newest first).
 */
export async function getAllBlockedApps(): Promise<Result<BlockedApp[]>> {
    try {
        const rows = rawQuery<BlockedAppRow>(
            'SELECT * FROM blocked_apps ORDER BY created_at DESC'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch blocked apps',
        };
    }
}

/**
 * Retrieve a single blocked app by its package name.
 */
export async function getBlockedApp(
    packageName: string
): Promise<Result<BlockedApp | null>> {
    try {
        const rows = rawQuery<BlockedAppRow>(
            'SELECT * FROM blocked_apps WHERE package_name = ? LIMIT 1',
            [packageName]
        );
        return {
            success: true,
            data: rows.length > 0 ? mapRow(rows[0]) : null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch blocked app',
        };
    }
}

/**
 * Add a new blocked app. Ignores duplicates (UNIQUE on package_name).
 * Marks the row as unsynced so the sync layer can push it later.
 */
export async function addBlockedApp(
    packageName: string,
    appName: string
): Promise<Result<void>> {
    try {
        rawExecute(
            `INSERT OR IGNORE INTO blocked_apps (package_name, app_name, is_synced)
       VALUES (?, ?, 0)`,
            [packageName, appName]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add blocked app',
        };
    }
}

/**
 * Remove a blocked app by package name.
 */
export async function removeBlockedApp(
    packageName: string
): Promise<Result<void>> {
    try {
        rawExecute('DELETE FROM blocked_apps WHERE package_name = ?', [packageName]);
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to remove blocked app',
        };
    }
}

/**
 * Check whether a given package is currently blocked.
 */
export async function isAppBlocked(
    packageName: string
): Promise<Result<boolean>> {
    try {
        const rows = rawQuery<{ count: number }>(
            'SELECT COUNT(*) as count FROM blocked_apps WHERE package_name = ?',
            [packageName]
        );
        return { success: true, data: (rows[0]?.count ?? 0) > 0 };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to check blocked status',
        };
    }
}

/**
 * Retrieve all unsynced blocked apps (for the sync layer).
 */
export async function getUnsyncedBlockedApps(): Promise<Result<BlockedApp[]>> {
    try {
        const rows = rawQuery<BlockedAppRow>(
            'SELECT * FROM blocked_apps WHERE is_synced = 0'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch unsynced blocked apps',
        };
    }
}

/**
 * Mark a blocked app as synced (called by the sync layer after successful push).
 */
export async function markBlockedAppSynced(
    id: number,
    remoteId: string
): Promise<Result<void>> {
    try {
        rawExecute(
            'UPDATE blocked_apps SET is_synced = 1, remote_id = ? WHERE id = ?',
            [remoteId, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to mark blocked app as synced',
        };
    }
}
