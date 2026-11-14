import { asc, eq } from 'drizzle-orm';
import { getDb, getSqlite } from '../db/connection.js';
import { productAddons, products, productVariations } from '../db/schema.js';

function hydrateProducts(productRows, { onlyActive = false } = {}) {
  if (productRows.length === 0) return [];
  const db = getDb();
  const allVariations = db
    .select()
    .from(productVariations)
    .orderBy(asc(productVariations.id))
    .all();
  const allAddons = db
    .select()
    .from(productAddons)
    .orderBy(asc(productAddons.id))
    .all();

  return productRows.map((p) => {
    const variations = allVariations
      .filter((v) => v.productId === p.id && (!onlyActive || Boolean(v.active)))
      .map((v) => ({
        id: v.id,
        productId: v.productId,
        name: v.name,
        price: Number(v.price),
        active: Boolean(v.active),
      }));

    const addons = allAddons
      .filter((a) => a.productId === p.id && (!onlyActive || Boolean(a.active)))
      .map((a) => ({
        id: a.id,
        productId: a.productId,
        name: a.name,
        price: Number(a.price),
        active: Boolean(a.active),
      }));

    return {
      id: p.id,
      categoryId: p.categoryId,
      name: p.name,
      description: p.description,
      basePrice: Number(p.basePrice),
      imageUrl: p.imageUrl,
      active: Boolean(p.active),
      variations,
      addons,
    };
  });
}

export const productRepo = {
  findAll({ onlyActive = false } = {}) {
    const db = getDb();
    let rows = db.select().from(products).orderBy(asc(products.id)).all();
    if (onlyActive) {
      rows = rows.filter((p) => Boolean(p.active));
    }
    return hydrateProducts(rows, { onlyActive });
  },

  findById(id, { onlyActive = false } = {}) {
    const db = getDb();
    const row = db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .get();
    if (!row) return null;
    if (onlyActive && !row.active) return null;
    return hydrateProducts([row], { onlyActive })[0] || null;
  },

  create({
    categoryId,
    name,
    description = '',
    basePrice,
    imageUrl = '',
    active = true,
    variations = [],
    addons = [],
  }) {
    const db = getDb();
    const sqlite = getSqlite();

    const tx = sqlite.transaction(() => {
      const inserted = db
        .insert(products)
        .values({
          categoryId: Number(categoryId),
          name,
          description,
          basePrice: Number(basePrice),
          imageUrl,
          active: Boolean(active),
        })
        .returning()
        .get();

      for (const v of variations) {
        db.insert(productVariations)
          .values({
            productId: inserted.id,
            name: v.name,
            price: Number(v.price),
            active: v.active !== undefined ? Boolean(v.active) : true,
          })
          .run();
      }

      for (const a of addons) {
        db.insert(productAddons)
          .values({
            productId: inserted.id,
            name: a.name,
            price: Number(a.price),
            active: a.active !== undefined ? Boolean(a.active) : true,
          })
          .run();
      }

      return inserted.id;
    });

    const newId = tx();
    return this.findById(newId);
  },

  update(
    id,
    {
      categoryId,
      name,
      description,
      basePrice,
      imageUrl,
      active,
      variations,
      addons,
    }
  ) {
    const db = getDb();
    const sqlite = getSqlite();
    const current = this.findById(id);
    if (!current) return null;

    const tx = sqlite.transaction(() => {
      db.update(products)
        .set({
          categoryId:
            categoryId !== undefined ? Number(categoryId) : current.categoryId,
          name: name !== undefined ? name : current.name,
          description:
            description !== undefined ? description : current.description,
          basePrice:
            basePrice !== undefined ? Number(basePrice) : current.basePrice,
          imageUrl: imageUrl !== undefined ? imageUrl : current.imageUrl,
          active: active !== undefined ? Boolean(active) : current.active,
        })
        .where(eq(products.id, Number(id)))
        .run();

      if (Array.isArray(variations)) {
        db.delete(productVariations)
          .where(eq(productVariations.productId, Number(id)))
          .run();
        for (const v of variations) {
          db.insert(productVariations)
            .values({
              productId: Number(id),
              name: v.name,
              price: Number(v.price),
              active: v.active !== undefined ? Boolean(v.active) : true,
            })
            .run();
        }
      }

      if (Array.isArray(addons)) {
        db.delete(productAddons)
          .where(eq(productAddons.productId, Number(id)))
          .run();
        for (const a of addons) {
          db.insert(productAddons)
            .values({
              productId: Number(id),
              name: a.name,
              price: Number(a.price),
              active: a.active !== undefined ? Boolean(a.active) : true,
            })
            .run();
        }
      }
    });

    tx();
    return this.findById(id);
  },

  toggleActive(id, explicitActive = undefined) {
    const db = getDb();
    const current = this.findById(id);
    if (!current) return null;

    const nextActive =
      explicitActive !== undefined ? Boolean(explicitActive) : !current.active;

    db.update(products)
      .set({ active: nextActive })
      .where(eq(products.id, Number(id)))
      .run();

    return this.findById(id);
  },

  delete(id) {
    const db = getDb();
    const sqlite = getSqlite();
    const current = this.findById(id);
    if (!current) return false;

    const tx = sqlite.transaction(() => {
      db.delete(productVariations)
        .where(eq(productVariations.productId, Number(id)))
        .run();
      db.delete(productAddons)
        .where(eq(productAddons.productId, Number(id)))
        .run();
      db.delete(products).where(eq(products.id, Number(id))).run();
    });
    tx();
    return true;
  },
};
