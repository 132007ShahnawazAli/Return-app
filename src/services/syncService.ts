// ─── Sync Service ─────────────────────────────────────────────────────────
// Future-ready sync layer that orchestrates data synchronisation between
// the local SQLite database and the Supabase backend.
//
// Current state: SCAFFOLD ONLY
// Full sync logic will be implemented when the Supabase backend tables
// are provisioned. The architecture is in place so that adding sync is
// a matter of filling in the push/pull methods — no structural changes needed.

import { supabase } from '@/src/auth/supabaseClient';
import {
    blockedAppsRepo,
    focusSessionsRepo,
    schedulesRepo,
    settingsRepo,
    usageLogsRepo,
} from '@/src/database/repositories';
import type { Result, SyncDirection, SyncStatus, SyncableTable } from '@/src/types';

// ── Sync State ────────────────────────────────────────────────────────────

let _isSyncing = false;

/**
 * Returns true while a sync operation is in progress.
 */
export function isSyncing(): boolean {
    return _isSyncing;
}

// ── Main Sync Entry Point ─────────────────────────────────────────────────

/**
 * Run a sync cycle for the specified direction and tables.
 *
 * @param direction  'push' (local → remote), 'pull' (remote → local), or 'full' (both).
 * @param tables     Optional subset of tables to sync. Defaults to all.
 */
export async function sync(
    direction: SyncDirection = 'full',
    tables?: SyncableTable[]
): Promise<Result<SyncStatus>> {
    // Prevent concurrent syncs.
    if (_isSyncing) {
        return {
            success: false,
            error: 'A sync operation is already in progress.',
        };
    }

    // Verify that the user is authenticated before syncing.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
        return {
            success: false,
            error: 'User is not authenticated. Sign in before syncing.',
        };
    }

    _isSyncing = true;

    const status: SyncStatus = {
        lastSyncedAt: null,
        itemsPushed: 0,
        itemsPulled: 0,
        conflicts: 0,
        errors: [],
    };

    const targetTables: SyncableTable[] = tables ?? [
        'blocked_apps',
        'focus_sessions',
        'schedules',
        'usage_logs',
    ];

    try {
        // ── Push: local → remote ────────────────────────────────────────────
        if (direction === 'push' || direction === 'full') {
            for (const table of targetTables) {
                const result = await pushTable(table);
                if (result.success) {
                    status.itemsPushed += result.data;
                } else {
                    status.errors.push(`Push ${table}: ${result.error}`);
                }
            }
        }

        // ── Pull: remote → local ────────────────────────────────────────────
        if (direction === 'pull' || direction === 'full') {
            for (const table of targetTables) {
                const result = await pullTable(table);
                if (result.success) {
                    status.itemsPulled += result.data;
                } else {
                    status.errors.push(`Pull ${table}: ${result.error}`);
                }
            }
        }

        // Record the sync timestamp.
        status.lastSyncedAt = new Date().toISOString();
        await settingsRepo.setSetting('last_synced_at', status.lastSyncedAt);

        return { success: true, data: status };
    } catch (error) {
        status.errors.push(
            error instanceof Error ? error.message : 'Unknown sync error'
        );
        return { success: false, error: status.errors.join('; ') };
    } finally {
        _isSyncing = false;
    }
}

// ── Table-specific Push Logic ─────────────────────────────────────────────
// Each table pushes its unsynced rows to the corresponding Supabase table.
// TODO: Implement when Supabase backend tables are created.

async function pushTable(
    table: SyncableTable
): Promise<Result<number>> {
    try {
        let unsyncedCount = 0;

        switch (table) {
            case 'blocked_apps': {
                const result = await blockedAppsRepo.getUnsyncedBlockedApps();
                if (!result.success) return result;
                unsyncedCount = result.data.length;

                // TODO: Upsert each item to Supabase `blocked_apps` table.
                // for (const app of result.data) {
                //   const { data, error } = await supabase
                //     .from('blocked_apps')
                //     .upsert({ ... })
                //     .select('id')
                //     .single();
                //   if (!error && data) {
                //     await blockedAppsRepo.markBlockedAppSynced(app.id, data.id);
                //   }
                // }
                break;
            }

            case 'focus_sessions': {
                const result = await focusSessionsRepo.getUnsyncedSessions();
                if (!result.success) return result;
                unsyncedCount = result.data.length;
                // TODO: Push to Supabase
                break;
            }

            case 'schedules': {
                const result = await schedulesRepo.getUnsyncedSchedules();
                if (!result.success) return result;
                unsyncedCount = result.data.length;
                // TODO: Push to Supabase
                break;
            }

            case 'usage_logs': {
                const result = await usageLogsRepo.getUnsyncedLogs();
                if (!result.success) return result;
                unsyncedCount = result.data.length;
                // TODO: Push to Supabase
                break;
            }
        }

        console.log(`[Sync] Push ${table}: ${unsyncedCount} items pending.`);
        return { success: true, data: unsyncedCount };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : `Failed to push ${table}`,
        };
    }
}

// ── Table-specific Pull Logic ─────────────────────────────────────────────
// Each table pulls remote changes created after the last sync and
// merges them into the local database.
// TODO: Implement when Supabase backend tables are created.

async function pullTable(
    table: SyncableTable
): Promise<Result<number>> {
    try {
        // Determine the last sync time so we only pull new/updated rows.
        const lastSyncResult = await settingsRepo.getSetting('last_synced_at');
        const _lastSyncedAt =
            lastSyncResult.success && lastSyncResult.data
                ? lastSyncResult.data
                : '1970-01-01T00:00:00Z';

        // TODO: Implement per-table pull logic.
        // Example for blocked_apps:
        // const { data, error } = await supabase
        //   .from('blocked_apps')
        //   .select('*')
        //   .gt('updated_at', _lastSyncedAt);
        //
        // if (!error && data) {
        //   for (const remoteRow of data) {
        //     // Insert or update local row based on conflict resolution strategy.
        //   }
        // }

        console.log(`[Sync] Pull ${table}: not yet implemented.`);
        return { success: true, data: 0 };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : `Failed to pull ${table}`,
        };
    }
}

// ── Conflict Resolution Strategy ──────────────────────────────────────────
// When implementing full sync, use "last-write-wins" based on `updated_at`.
// For critical data (e.g. blocked apps), prefer the local version to avoid
// accidentally unblocking an app due to stale remote data.

/**
 * Determine which version of a row wins during a conflict.
 * Currently unused — will be called by pullTable when sync is implemented.
 */
export function resolveConflict<T extends { createdAt: string }>(
    local: T,
    remote: T
): 'local' | 'remote' {
    // Simple last-write-wins strategy.
    return new Date(local.createdAt) >= new Date(remote.createdAt)
        ? 'local'
        : 'remote';
}
