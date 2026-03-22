// ─── Drizzle ORM Schema ───────────────────────────────────────────────────
// These schema definitions mirror the SQL tables created by the migration
// system in `src/database/migrations/index.ts`. They are used by Drizzle
// ORM for type-safe queries in repositories.
//
// IMPORTANT: When adding a new migration that creates or modifies tables,
// update this file to match. Drizzle uses these at query-time for type
// inference — they don't auto-generate from SQL.

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// ── Settings (key-value store) ────────────────────────────────────────────

export const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});

// ── Onboarding Responses ──────────────────────────────────────────────────

export const onboardingResponses = sqliteTable('onboarding_responses', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});

// ── Blocked Apps ──────────────────────────────────────────────────────────

export const blockedApps = sqliteTable('blocked_apps', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    packageName: text('package_name').notNull().unique(),
    appName: text('app_name').notNull(),
    createdAt: text('created_at').notNull().default("datetime('now')"),
    remoteId: text('remote_id'),
    isSynced: integer('is_synced').notNull().default(0),
});

// ── Focus Sessions ────────────────────────────────────────────────────────

export const focusSessions = sqliteTable('focus_sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    startTime: text('start_time').notNull(),
    endTime: text('end_time'),
    durationSeconds: integer('duration_seconds'),
    status: text('status').notNull().default('active'),
    createdAt: text('created_at').notNull().default("datetime('now')"),
    remoteId: text('remote_id'),
    isSynced: integer('is_synced').notNull().default(0),
});

// ── Schedules ─────────────────────────────────────────────────────────────

export const schedules = sqliteTable('schedules', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    daysOfWeek: text('days_of_week').notNull(),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    isActive: integer('is_active').notNull().default(1),
    createdAt: text('created_at').notNull().default("datetime('now')"),
    remoteId: text('remote_id'),
    isSynced: integer('is_synced').notNull().default(0),
});

// ── Usage Logs ────────────────────────────────────────────────────────────

export const usageLogs = sqliteTable('usage_logs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    packageName: text('package_name').notNull(),
    durationSeconds: integer('duration_seconds').notNull(),
    date: text('date').notNull(),
    createdAt: text('created_at').notNull().default("datetime('now')"),
    remoteId: text('remote_id'),
    isSynced: integer('is_synced').notNull().default(0),
});
