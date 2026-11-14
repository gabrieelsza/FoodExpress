import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../config/env.js';
import * as schema from './schema.js';
import { SCHEMA_DDL_SQL } from './schema.js';

let sqliteInstance = null;
let dbInstance = null;

export function initDatabase(customDbPath = null) {
  const targetPath =
    customDbPath ??
    (process.env.NODE_ENV === 'test' ? ':memory:' : env.DATABASE_URL);

  if (targetPath !== ':memory:') {
    const absDir = path.dirname(path.resolve(process.cwd(), targetPath));
    if (!fs.existsSync(absDir)) {
      fs.mkdirSync(absDir, { recursive: true });
    }
  }

  if (sqliteInstance) {
    try {
      sqliteInstance.close();
    } catch {
      // Ignora fechamento anterior
    }
  }

  sqliteInstance = new Database(targetPath);
  if (targetPath !== ':memory:') {
    sqliteInstance.pragma('journal_mode = WAL');
  }
  sqliteInstance.pragma('foreign_keys = ON');
  sqliteInstance.exec(SCHEMA_DDL_SQL);

  dbInstance = drizzle(sqliteInstance, { schema });
  return { sqlite: sqliteInstance, db: dbInstance };
}

export function getDb() {
  if (!dbInstance) {
    initDatabase();
  }
  return dbInstance;
}

export function getSqlite() {
  if (!sqliteInstance) {
    initDatabase();
  }
  return sqliteInstance;
}
