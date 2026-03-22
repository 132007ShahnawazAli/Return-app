// ─── Schedules Repository ─────────────────────────────────────────────────
// Data-access layer for the `schedules` table.

import { rawExecute, rawQuery } from '@/src/database/db';
import type { Result, Schedule } from '@/src/types';

// ── Row mapper ────────────────────────────────────────────────────────────

interface ScheduleRow {
    id: number;
    name: string;
    days_of_week: string;
    start_time: string;
    end_time: string;
    is_active: number;
    created_at: string;
    remote_id: string | null;
    is_synced: number;
}

function mapRow(row: ScheduleRow): Schedule {
    return {
        id: row.id,
        name: row.name,
        daysOfWeek: row.days_of_week,
        startTime: row.start_time,
        endTime: row.end_time,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        remoteId: row.remote_id ?? undefined,
        isSynced: row.is_synced === 1,
    };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Get all schedules.
 */
export async function getAllSchedules(): Promise<Result<Schedule[]>> {
    try {
        const rows = rawQuery<ScheduleRow>(
            'SELECT * FROM schedules ORDER BY created_at DESC'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch schedules',
        };
    }
}

/**
 * Get only active schedules.
 */
export async function getActiveSchedules(): Promise<Result<Schedule[]>> {
    try {
        const rows = rawQuery<ScheduleRow>(
            'SELECT * FROM schedules WHERE is_active = 1 ORDER BY start_time ASC'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to fetch active schedules',
        };
    }
}

/**
 * Create a new schedule.
 */
export async function createSchedule(
    name: string,
    daysOfWeek: string,
    startTime: string,
    endTime: string
): Promise<Result<number>> {
    try {
        rawExecute(
            `INSERT INTO schedules (name, days_of_week, start_time, end_time, is_active, is_synced)
       VALUES (?, ?, ?, ?, 1, 0)`,
            [name, daysOfWeek, startTime, endTime]
        );
        const rows = rawQuery<{ id: number }>('SELECT last_insert_rowid() as id');
        return { success: true, data: rows[0].id };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create schedule',
        };
    }
}

/**
 * Toggle a schedule's active state.
 */
export async function toggleSchedule(
    id: number,
    isActive: boolean
): Promise<Result<void>> {
    try {
        rawExecute(
            'UPDATE schedules SET is_active = ?, is_synced = 0 WHERE id = ?',
            [isActive ? 1 : 0, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle schedule',
        };
    }
}

/**
 * Delete a schedule.
 */
export async function deleteSchedule(id: number): Promise<Result<void>> {
    try {
        rawExecute('DELETE FROM schedules WHERE id = ?', [id]);
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete schedule',
        };
    }
}

/**
 * Get unsynced schedules for the sync layer.
 */
export async function getUnsyncedSchedules(): Promise<Result<Schedule[]>> {
    try {
        const rows = rawQuery<ScheduleRow>(
            'SELECT * FROM schedules WHERE is_synced = 0'
        );
        return { success: true, data: rows.map(mapRow) };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch unsynced schedules',
        };
    }
}

/**
 * Mark a schedule as synced.
 */
export async function markScheduleSynced(
    id: number,
    remoteId: string
): Promise<Result<void>> {
    try {
        rawExecute(
            'UPDATE schedules SET is_synced = 1, remote_id = ? WHERE id = ?',
            [remoteId, id]
        );
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to mark schedule as synced',
        };
    }
}
