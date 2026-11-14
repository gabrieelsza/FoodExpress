import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('ADMIN'),
  createdAt: text('created_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  basePrice: real('base_price').notNull(),
  imageUrl: text('image_url').notNull().default(''),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const productVariations = sqliteTable('product_variations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  name: text('name').notNull(),
  price: real('price').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const productAddons = sqliteTable('product_addons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  name: text('name').notNull(),
  price: real('price').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderType: text('order_type').notNull(), // 'DINE_IN' | 'DELIVERY'
  status: text('status').notNull().default('RECEIVED'), // 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'
  tableNumber: text('table_number'),
  customerName: text('customer_name'),
  deliveryAddress: text('delivery_address'),
  totalAmount: real('total_amount').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  productNameSnapshot: text('product_name_snapshot').notNull(),
  quantity: integer('quantity').notNull(),
  variationNameSnapshot: text('variation_name_snapshot'),
  addonsJsonSnapshot: text('addons_json_snapshot').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  unitPrice: real('unit_price').notNull(),
  subtotal: real('subtotal').notNull(),
});

export const SCHEMA_DDL_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  base_price REAL NOT NULL CHECK(base_price > 0),
  image_url TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS product_variations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK(price > 0),
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS product_addons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK(price >= 0),
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_type TEXT NOT NULL CHECK(order_type IN ('DINE_IN', 'DELIVERY')),
  status TEXT NOT NULL DEFAULT 'RECEIVED' CHECK(status IN ('RECEIVED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED')),
  table_number TEXT,
  customer_name TEXT,
  delivery_address TEXT,
  total_amount REAL NOT NULL CHECK(total_amount > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name_snapshot TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  variation_name_snapshot TEXT,
  addons_json_snapshot TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT '' CHECK(length(notes) <= 140),
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL
);
`;
