// src/db/index.ts
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

// Open SQLite database (creates if doesn't exist)
const expoDb = openDatabaseSync('screentime.db', { enableChangeListener: true });

// Create Drizzle instance (schema passed at query time, not constructor)
export const db = drizzle(expoDb);