// ─── Core Type Definitions ─────────────────────────────────────────────────
// Shared types used across the data architecture.
// Auth types are defined in `authTypes.ts` and re-exported here.

// Re-export auth types so existing imports from '@/src/types' continue to work.
export type { AuthContextType, AuthResponse, AuthState } from './authTypes';

// ── Generic Result Type ──────────────────────────────────────────────────────
// Every service/repository method returns a Result<T> to avoid throwing
// unhandled exceptions. Callers can pattern-match on `success` to safely
// extract `data` or `error`.

export type Result<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};

// ── Domain Models ────────────────────────────────────────────────────────────

/** An app that the user has chosen to block / limit. */
export interface BlockedApp {
    id: number;
    /** Android package name, e.g. "com.instagram.android" */
    packageName: string;
    /** Human-readable label, e.g. "Instagram" */
    appName: string;
    /** ISO-8601 timestamp when the app was blocked. */
    createdAt: string;
    /** Optional Supabase row id for sync tracking. */
    remoteId?: string;
    /** Dirty flag — true when the row has local changes not yet synced. */
    isSynced: boolean;
}

/** A focus session (e.g. 25-minute Pomodoro block). */
export interface FocusSession {
    id: number;
    /** ISO-8601 start timestamp. */
    startTime: string;
    /** ISO-8601 end timestamp (null while session is active). */
    endTime: string | null;
    /** Duration in seconds (computed on completion). */
    durationSeconds: number | null;
    /** Whether the session was completed or abandoned. */
    status: 'active' | 'completed' | 'abandoned';
    createdAt: string;
    remoteId?: string;
    isSynced: boolean;
}

/** A recurring schedule for auto-blocking apps. */
export interface Schedule {
    id: number;
    /** Human-readable name, e.g. "Work hours". */
    name: string;
    /** Comma-separated day numbers (0-6, Sun-Sat). */
    daysOfWeek: string;
    /** Start time in HH:mm format. */
    startTime: string;
    /** End time in HH:mm format. */
    endTime: string;
    isActive: boolean;
    createdAt: string;
    remoteId?: string;
    isSynced: boolean;
}

/** A single usage log entry tracked by the native module. */
export interface UsageLog {
    id: number;
    packageName: string;
    /** Usage duration in seconds. */
    durationSeconds: number;
    /** The calendar date this entry covers (YYYY-MM-DD). */
    date: string;
    createdAt: string;
    remoteId?: string;
    isSynced: boolean;
}

// ── Sync Types ───────────────────────────────────────────────────────────────

/** Direction of a sync operation. */
export type SyncDirection = 'push' | 'pull' | 'full';

/** Status returned after a sync cycle completes. */
export interface SyncStatus {
    lastSyncedAt: string | null;
    itemsPushed: number;
    itemsPulled: number;
    conflicts: number;
    errors: string[];
}

/** Tables that participate in cloud sync. */
export type SyncableTable = 'blocked_apps' | 'focus_sessions' | 'schedules' | 'usage_logs';
