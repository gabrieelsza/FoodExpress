import { asc, eq } from 'drizzle-orm';
import { getDb } from '../db/connection.js';
import { categories } from '../db/schema.js';

export const categoryRepo = {
  findAll({ onlyActive = false } = {}) {
    const db = getDb();
    const query = db
      .select()
      .from(categories)
      .orderBy(asc(categories.displayOrder), asc(categories.id));

    const all = query.all();
    if (onlyActive) {
      return all.filter((c) => Boolean(c.active));
    }
    return all;
  },

  findById(id) {
    const db = getDb();
    return (
      db
        .select()
        .from(categories)
        .where(eq(categories.id, Number(id)))
        .get() || null
    );
  },

  create({ name, displayOrder = 0, active = true }) {
    const db = getDb();
    return db
      .insert(categories)
      .values({
        name,
        displayOrder: Number(displayOrder),
        active: Boolean(active),
      })
      .returning()
      .get();
  },

  update(id, { name, displayOrder, active }) {
    const db = getDb();
    const current = this.findById(id);
    if (!current) return null;

    return db
      .update(categories)
      .set({
        name: name !== undefined ? name : current.name,
        displayOrder:
          displayOrder !== undefined
            ? Number(displayOrder)
            : current.displayOrder,
        active: active !== undefined ? Boolean(active) : current.active,
      })
      .where(eq(categories.id, Number(id)))
      .returning()
      .get();
  },
};
