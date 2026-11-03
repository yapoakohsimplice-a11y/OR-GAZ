import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const mainCategoryEnum = pgEnum("main_category", ["ACHETER", "RECHARGER"]);

export const productCategoryEnum = pgEnum("product_category", [
  "BOUTEILLES_COMPLETES",
  "PACKS_COMPLETS",
  "ACCESSOIRES",
  "RECHARGE_BOUTEILLE_EXISTANTE",
]);

export const bottleCapacityEnum = pgEnum("bottle_capacity", ["B6", "B12", "B28"]);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    mainCategory: mainCategoryEnum("main_category").notNull(),
    category: productCategoryEnum("category").notNull(),
    bottleType: text("bottle_type").notNull(),
    capacity: bottleCapacityEnum("capacity"),
    weightCapacity: text("weight_capacity").notNull(),
    description: text("description").notNull(),
    photoUrl: text("photo_url").notNull(),
    currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
    stock: integer("stock").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("products_slug_unique_idx").on(table.slug),
  }),
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  productName: text("product_name").notNull(),
  productBrand: text("product_brand").notNull(),
  productCapacity: text("product_capacity"),
  photoUrl: text("photo_url").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
