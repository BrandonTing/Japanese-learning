import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const db = drizzle({
  schema,
  connection: {
    url: import.meta.env.VITE_TURSO_DATABASE_URL || "",
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || "",
  }
});

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];