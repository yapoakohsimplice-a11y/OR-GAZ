"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

type MainCategory = "ACHETER" | "RECHARGER";
type ProductCategory =
  | "BOUTEILLES_COMPLETES"
  | "PACKS_COMPLETS"
  | "ACCESSOIRES"
  | "RECHARGE_BOUTEILLE_EXISTANTE";
type BottleCapacity = "B6" | "B12" | "B28";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(baseSlug: string, productId?: number) {
  const safeBase = baseSlug || `produit-${Date.now()}`;
  let candidate = safeBase;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db.select().from(products).where(eq(products.slug, candidate)).limit(1);
    if (!existing[0] || existing[0].id === productId) {
      return candidate;
    }
    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
}

function must(value: FormDataEntryValue | null, label: string) {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(`Le champ ${label} est requis.`);
  }
  return value.trim();
}

export async function createProductAction(formData: FormData) {
  const name = must(formData.get("name"), "nom");
  const brand = must(formData.get("brand"), "marque");
  const mainCategory = must(formData.get("mainCategory"), "catégorie principale") as MainCategory;
  const category = must(formData.get("category"), "catégorie") as ProductCategory;
  const bottleType = must(formData.get("bottleType"), "type de bouteille");
  const weightCapacity = must(formData.get("weightCapacity"), "poids/capacité");
  const description = must(formData.get("description"), "description");
  const photoUrl = must(formData.get("photoUrl"), "photo");
  const currentPrice = must(formData.get("currentPrice"), "prix actuel");
  const stock = must(formData.get("stock"), "stock");
  const capacityInput = formData.get("capacity");
  const isAvailable = formData.get("isAvailable") === "on";
  const isActive = formData.get("isActive") === "on";

  const priceNumber = Number(currentPrice);
  const stockNumber = Number(stock);

  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    throw new Error("Le prix doit être un nombre positif.");
  }

  if (!Number.isInteger(stockNumber) || stockNumber < 0) {
    throw new Error("Le stock doit être un entier positif.");
  }

  const baseSlug = slugify(`${brand}-${name}`);
  const slug = await ensureUniqueSlug(baseSlug);

  const capacity =
    capacityInput && typeof capacityInput === "string" && capacityInput.length > 0
      ? (capacityInput as BottleCapacity)
      : null;

  await db.insert(products).values({
    slug,
    name,
    brand,
    mainCategory,
    category,
    bottleType,
    capacity,
    weightCapacity,
    description,
    photoUrl,
    currentPrice: priceNumber.toFixed(2),
    isAvailable,
    stock: stockNumber,
    isActive,
  });

  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/admin/produits");
}

export async function updateProductAction(formData: FormData) {
  const id = Number(must(formData.get("id"), "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID produit invalide.");
  }

  const name = must(formData.get("name"), "nom");
  const brand = must(formData.get("brand"), "marque");
  const mainCategory = must(formData.get("mainCategory"), "catégorie principale") as MainCategory;
  const category = must(formData.get("category"), "catégorie") as ProductCategory;
  const bottleType = must(formData.get("bottleType"), "type de bouteille");
  const weightCapacity = must(formData.get("weightCapacity"), "poids/capacité");
  const description = must(formData.get("description"), "description");
  const photoUrl = must(formData.get("photoUrl"), "photo");
  const currentPrice = must(formData.get("currentPrice"), "prix actuel");
  const stock = must(formData.get("stock"), "stock");
  const capacityInput = formData.get("capacity");
  const isAvailable = formData.get("isAvailable") === "on";
  const isActive = formData.get("isActive") === "on";

  const priceNumber = Number(currentPrice);
  const stockNumber = Number(stock);

  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    throw new Error("Le prix doit être un nombre positif.");
  }

  if (!Number.isInteger(stockNumber) || stockNumber < 0) {
    throw new Error("Le stock doit être un entier positif.");
  }

  const baseSlug = slugify(`${brand}-${name}`);
  const slug = await ensureUniqueSlug(baseSlug, id);

  const capacity =
    capacityInput && typeof capacityInput === "string" && capacityInput.length > 0
      ? (capacityInput as BottleCapacity)
      : null;

  const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);

  if (!existing[0]) {
    throw new Error("Produit introuvable.");
  }

  await db
    .update(products)
    .set({
      slug,
      name,
      brand,
      mainCategory,
      category,
      bottleType,
      capacity,
      weightCapacity,
      description,
      photoUrl,
      currentPrice: priceNumber.toFixed(2),
      isAvailable,
      stock: stockNumber,
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/admin/produits");
  revalidatePath(`/produits/${existing[0].slug}`);
}

export async function deleteProductAction(formData: FormData) {
  const id = Number(must(formData.get("id"), "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID produit invalide.");
  }

  const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);

  if (!existing[0]) {
    throw new Error("Produit introuvable.");
  }

  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/admin/produits");
  revalidatePath(`/produits/${existing[0].slug}`);
}
