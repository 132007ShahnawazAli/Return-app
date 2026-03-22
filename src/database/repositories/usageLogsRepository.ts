// ─── Usage Logs Repository ────────────────────────────────────────────────
// Data-access layer for the `usage_logs` table.

import { rawExecute, rawQuery } from '@/src/database/db';
import type { Result, UsageLog } from '@/src/types';

// ── Row mapper ────────────────────────────────────────────────────────────

interface UsageLogRow {
    id: number;
    package_name: string;
    duration_seconds: number;
    date: string;
    created_at: string;
    remote_id: string | null;
    is_synced: number;
}

function mapRow(row: UsageLogRow): UsageLog {
    return {
        id: row.id,
        packageName: row.package_name,
        durationSeconds: row.duration_seconds,
        date: row.date,
        createdAt: row.created_at,
        remoteId: row.remote_id ?? undefined,
        isSynced: row.is_synced === 1,
    };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Insert a new usage log entry.
 */
export async function addUsageLog(
    packageName: string,
    durationSeconds: number,
    date: string
): Promise<Result<void>> {
    try {
        rawExecute(
            `INSERT INTO usage_logs (package_name, duration_seconds, date, is_synced)
       VALUES (?, ?, ?, 0)`,
            [packageName, durationSeconds, date]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add usage log',
        };
    }
}

/**
 * Get all usage logs for a specific date.
 */
export async function getLogsForDate(
    date: string
): Promise<Result<UsageLog[]>> {
    try {
        const rows = rawQuery<UsageLogRow>(
            `SELECT * FROM usage_logs WHERE date = ? ORDER BY duration_seconds DESC`,
            [date]
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch logs for date',
        };
    }
}

/**
 * Get aggregated daily usage per app for a date range.
 * Returns one row per app with total duration summed.
 */
export async function getAggregatedUsage(
    startDate: string,
    endDate: string
): Promise<Result<{ packageName: string; totalSeconds: number }[]>> {
    try {
        const rows = rawQuery<{ package_name: string; total_seconds: number }>(
            `SELECT package_name, SUM(duration_seconds) as total_seconds
       FROM usage_logs
       WHERE date >= ? AND date <= ?
       GROUP BY package_name
       ORDER BY total_seconds DESC`,
            [startDate, endDate]
        );
        return {
            success: true,
            data: rows.map((r) => ({
                packageName: r.package_name,
                totalSeconds: r.total_seconds,
            })),
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to get aggregated usage',
        };
    }
}

/**
 * Get total screen time for today in seconds.
 */
export async function getTodayTotalScreenTime(): Promise<Result<number>> {
    try {
        const rows = rawQuery<{ total: number }>(
            `SELECT COALESCE(SUM(duration_seconds), 0) as total
       FROM usage_logs
       WHERE date = date('now')`
        );
        return { success: true, data: rows[0]?.total ?? 0 };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to get today screen time',
        };
    }
}

/**
 * Get daily totals for a date range (for charts / trends).
 */
export async function getDailyTotals(
    startDate: string,
    endDate: string
): Promise<Result<{ date: string; totalSeconds: number }[]>> {
    try {
        const rows = rawQuery<{ date: string; total_seconds: number }>(
            `SELECT date, SUM(duration_seconds) as total_seconds
       FROM usage_logs
       WHERE date >= ? AND date <= ?
       GROUP BY date
       ORDER BY date ASC`,
            [startDate, endDate]
        );
        return {
            success: true,
            data: rows.map((r) => ({
                date: r.date,
                totalSeconds: r.total_seconds,
            })),
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to get daily totals',
        };
    }
}

/**
 * Get unsynced usage logs for the sync layer.
 */
export async function getUnsyncedLogs(): Promise<Result<UsageLog[]>> {
    try {
        const rows = rawQuery<UsageLogRow>(
            'SELECT * FROM usage_logs WHERE is_synced = 0'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch unsynced logs',
        };
    }
}

/**
 * Mark a usage log as synced.
 */
export async function markLogSynced(
    id: number,
    remoteId: string
): Promise<Result<void>> {
    try {
        rawExecute(
            'UPDATE usage_logs SET is_synced = 1, remote_id = ? WHERE id = ?',
            [remoteId, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to mark log as synced',
        };
    }
}
