import { eq } from 'drizzle-orm';
import { getDb } from '../db/connection.js';
import { users } from '../db/schema.js';

export const userRepo = {
  findByUsername(username) {
    const db = getDb();
    const rows = db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .all();
    return rows[0] || null;
  },

  create({ username, passwordHash, role = 'ADMIN' }) {
    const db = getDb();
    const createdAt = new Date().toISOString();
    const result = db
      .insert(users)
      .values({
        username,
        passwordHash,
        role,
        createdAt,
      })
      .returning()
      .get();
    return result;
  },
};
