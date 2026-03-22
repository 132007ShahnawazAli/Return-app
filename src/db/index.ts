// ─── Legacy Database Entry Point ──────────────────────────────────────────
// This file is DEPRECATED. All new code should import from:
//   @/src/database/db
//
// This re-export exists only for backward compatibility with any remaining
// references. It now delegates to the new database module to avoid
// opening a second SQLite connection.

export { db } from '@/src/database/db';
