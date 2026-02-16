import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Key-value settings table for persisting app state
// (onboarding completion, user preferences, screen time goals, etc.)
export const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});

// User onboarding responses
export const onboardingResponses = sqliteTable('onboarding_responses', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});
