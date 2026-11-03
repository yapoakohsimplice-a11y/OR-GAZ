import { db } from "@/db";
import { bottleCapacityEnum, products } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, or } from "drizzle-orm";

export type CatalogueFilters = {
  q?: string;
  brand?: string;
  mainCategory?: "ACHETER" | "RECHARGER";
  category?:
    | "BOUTEILLES_COMPLETES"
    | "PACKS_COMPLETS"
    | "ACCESSOIRES"
    | "RECHARGE_BOUTEILLE_EXISTANTE";
  capacity?: (typeof bottleCapacityEnum.enumValues)[number];
  availability?: "all" | "available";
  minPrice?: string;
  maxPrice?: string;
  includeInactive?: boolean;
};

export function formatPrice(price: string | number) {
  const value = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function getCatalogueProducts(filters: CatalogueFilters = {}) {
  const conditions = [];

  if (!filters.includeInactive) {
    conditions.push(eq(products.isActive, true));
  }

  if (filters.q?.trim()) {
    const query = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, query),
        ilike(products.brand, query),
        ilike(products.description, query),
      ),
    );
  }

  if (filters.brand) {
    conditions.push(eq(products.brand, filters.brand));
  }

  if (filters.mainCategory) {
    conditions.push(eq(products.mainCategory, filters.mainCategory));
  }

  if (filters.category) {
    conditions.push(eq(products.category, filters.category));
  }

  if (filters.capacity) {
    conditions.push(eq(products.capacity, filters.capacity));
  }

  if (filters.availability === "available") {
    conditions.push(eq(products.isAvailable, true));
    conditions.push(gte(products.stock, 1));
  }

  if (filters.minPrice) {
    conditions.push(gte(products.currentPrice, filters.minPrice));
  }

  if (filters.maxPrice) {
    conditions.push(lte(products.currentPrice, filters.maxPrice));
  }

  return db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(products.isAvailable), asc(products.name));
}

export async function getProductBySlug(slug: string) {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getCatalogueFilterOptions() {
  const all = await db
    .select({
      brand: products.brand,
      mainCategory: products.mainCategory,
      category: products.category,
      capacity: products.capacity,
    })
    .from(products)
    .where(eq(products.isActive, true));

  const brands = [...new Set(all.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));

  return {
    brands,
    mainCategories: ["ACHETER", "RECHARGER"] as const,
    categories: [
      "BOUTEILLES_COMPLETES",
      "PACKS_COMPLETS",
      "ACCESSOIRES",
      "RECHARGE_BOUTEILLE_EXISTANTE",
    ] as const,
    capacities: ["B6", "B12", "B28"] as const,
  };
}
