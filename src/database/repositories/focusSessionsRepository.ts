// ─── Focus Sessions Repository ────────────────────────────────────────────
// Data-access layer for the `focus_sessions` table.

import { rawExecute, rawQuery } from '@/src/database/db';
import type { FocusSession, Result } from '@/src/types';

// ── Row mapper ────────────────────────────────────────────────────────────

interface FocusSessionRow {
    id: number;
    start_time: string;
    end_time: string | null;
    duration_seconds: number | null;
    status: 'active' | 'completed' | 'abandoned';
    created_at: string;
    remote_id: string | null;
    is_synced: number;
}

function mapRow(row: FocusSessionRow): FocusSession {
    return {
        id: row.id,
        startTime: row.start_time,
        endTime: row.end_time,
        durationSeconds: row.duration_seconds,
        status: row.status,
        createdAt: row.created_at,
        remoteId: row.remote_id ?? undefined,
        isSynced: row.is_synced === 1,
    };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Start a new focus session. Returns the id of the created row.
 */
export async function startSession(
    startTime: string
): Promise<Result<number>> {
    try {
        rawExecute(
            `INSERT INTO focus_sessions (start_time, status, is_synced) VALUES (?, 'active', 0)`,
            [startTime]
        );
        // Get the last inserted row id.
        const rows = rawQuery<{ id: number }>('SELECT last_insert_rowid() as id');
        return { success: true, data: rows[0].id };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to start session',
        };
    }
}

/**
 * Complete an active session.
 */
export async function completeSession(
    id: number,
    endTime: string,
    durationSeconds: number
): Promise<Result<void>> {
    try {
        rawExecute(
            `UPDATE focus_sessions
       SET end_time = ?, duration_seconds = ?, status = 'completed', is_synced = 0
       WHERE id = ?`,
            [endTime, durationSeconds, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to complete session',
        };
    }
}

/**
 * Mark a session as abandoned (user cancelled it).
 */
export async function abandonSession(
    id: number,
    endTime: string,
    durationSeconds: number
): Promise<Result<void>> {
    try {
        rawExecute(
            `UPDATE focus_sessions
       SET end_time = ?, duration_seconds = ?, status = 'abandoned', is_synced = 0
       WHERE id = ?`,
            [endTime, durationSeconds, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to abandon session',
        };
    }
}

/**
 * Get all sessions, newest first.
 */
export async function getAllSessions(): Promise<Result<FocusSession[]>> {
    try {
        const rows = rawQuery<FocusSessionRow>(
            'SELECT * FROM focus_sessions ORDER BY created_at DESC'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to fetch sessions',
        };
    }
}

/**
 * Get sessions for a specific date range.
 */
export async function getSessionsByDateRange(
    startDate: string,
    endDate: string
): Promise<Result<FocusSession[]>> {
    try {
        const rows = rawQuery<FocusSessionRow>(
            `SELECT * FROM focus_sessions
       WHERE start_time >= ? AND start_time <= ?
       ORDER BY start_time DESC`,
            [startDate, endDate]
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to fetch sessions by date range',
        };
    }
}

/**
 * Get the currently active session (if any).
 */
export async function getActiveSession(): Promise<Result<FocusSession | null>> {
    try {
        const rows = rawQuery<FocusSessionRow>(
            `SELECT * FROM focus_sessions WHERE status = 'active' LIMIT 1`
        );
        return {
            success: true,
            data: rows.length > 0 ? mapRow(rows[0]) : null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to fetch active session',
        };
    }
}

/**
 * Get today's total focus time in seconds.
 */
export async function getTodayFocusTime(): Promise<Result<number>> {
    try {
        const rows = rawQuery<{ total: number }>(
            `SELECT COALESCE(SUM(duration_seconds), 0) as total
       FROM focus_sessions
       WHERE date(start_time) = date('now')
         AND status = 'completed'`
        );
        return { success: true, data: rows[0]?.total ?? 0 };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to get today focus time',
        };
    }
}

/**
 * Retrieve all unsynced sessions for the sync layer.
 */
export async function getUnsyncedSessions(): Promise<Result<FocusSession[]>> {
    try {
        const rows = rawQuery<FocusSessionRow>(
            'SELECT * FROM focus_sessions WHERE is_synced = 0'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch unsynced sessions',
        };
    }
}

/**
 * Mark a session as synced.
 */
export async function markSessionSynced(
    id: number,
    remoteId: string
): Promise<Result<void>> {
    try {
        rawExecute(
            'UPDATE focus_sessions SET is_synced = 1, remote_id = ? WHERE id = ?',
            [remoteId, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to mark session as synced',
        };
    }
}
