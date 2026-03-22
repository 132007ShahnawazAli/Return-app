// drizzle.config.ts (in root folder)
// @ts-nocheck — drizzle-kit v0.18 types are incomplete

/** @type {import('drizzle-kit').Config} */
export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    driver: 'expo',
    dialect: 'sqlite',
};