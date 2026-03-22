// ─── Settings Repository ──────────────────────────────────────────────────
// Data-access layer for the `settings` key-value table.
// Used for app preferences, feature flags, and local state persistence.

import { rawExecute, rawQuery } from '@/src/database/db';
import type { Result } from '@/src/types';

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Retrieve a setting value by key.
 * Returns `null` if the key doesn't exist.
 */
export async function getSetting(key: string): Promise<Result<string | null>> {
    try {
        const rows = rawQuery<{ value: string }>(
            'SELECT value FROM settings WHERE key = ? LIMIT 1',
            [key]
        );
        return {
            success: true,
            data: rows.length > 0 ? rows[0].value : null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get setting',
        };
    }
}

/**
 * Upsert a setting (insert or update on conflict).
 */
export async function setSetting(
    key: string,
    value: string
): Promise<Result<void>> {
    try {
        rawExecute(
            `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
            [key, value]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to set setting',
        };
    }
}

/**
 * Delete a setting by key.
 */
export async function deleteSetting(key: string): Promise<Result<void>> {
    try {
        rawExecute('DELETE FROM settings WHERE key = ?', [key]);
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete setting',
        };
    }
}

/**
 * Get all settings as a key-value map.
 */
export async function getAllSettings(): Promise<
    Result<Record<string, string>>
> {
    try {
        const rows = rawQuery<{ key: string; value: string }>(
            'SELECT key, value FROM settings'
        );
        const map: Record<string, string> = {};
        for (const row of rows) {
            map[row.key] = row.value;
        }
        return { success: true, data: map };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to get all settings',
        };
    }
}
