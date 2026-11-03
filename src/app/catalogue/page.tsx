import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCatalogueFilterOptions, getCatalogueProducts } from "@/lib/catalog";
import { seedCatalogIfEmpty } from "@/lib/seed";

type SearchParams = Record<string, string | string[] | undefined>;

const categoryLabels: Record<string, string> = {
  BOUTEILLES_COMPLETES: "Bouteilles complètes",
  PACKS_COMPLETS: "Packs complets",
  ACCESSOIRES: "Accessoires",
  RECHARGE_BOUTEILLE_EXISTANTE: "Recharge de bouteille existante",
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await seedCatalogIfEmpty();

  const params = await searchParams;
  const filters = {
    q: typeof params.q === "string" ? params.q : undefined,
    brand: typeof params.brand === "string" && params.brand.length > 0 ? params.brand : undefined,
    mainCategory:
      params.mainCategory === "ACHETER" || params.mainCategory === "RECHARGER"
        ? params.mainCategory
        : undefined,
    category:
      typeof params.category === "string" && params.category.length > 0
        ? (params.category as
            | "BOUTEILLES_COMPLETES"
            | "PACKS_COMPLETS"
            | "ACCESSOIRES"
            | "RECHARGE_BOUTEILLE_EXISTANTE")
        : undefined,
    capacity:
      params.capacity === "B6" || params.capacity === "B12" || params.capacity === "B28"
        ? params.capacity
        : undefined,
    availability: params.availability === "available" ? "available" : "all",
    minPrice: typeof params.minPrice === "string" ? params.minPrice : undefined,
    maxPrice: typeof params.maxPrice === "string" ? params.maxPrice : undefined,
  } as const;

  const [products, options] = await Promise.all([
    getCatalogueProducts(filters),
    getCatalogueFilterOptions(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Catalogue OR GAZ</h1>
          <p className="mt-2 text-slate-600">
            Recherchez, filtrez et ajoutez vos produits avec le prix actuel automatiquement appliqué.
          </p>
        </div>
        <Link href="/panier" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-amber-300">
          Voir le panier
        </Link>
      </div>

      <form className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          placeholder="Rechercher un produit"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />

        <select name="brand" defaultValue={filters.brand ?? ""} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Toutes les marques</option>
          {options.brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          name="mainCategory"
          defaultValue={filters.mainCategory ?? ""}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Toutes les catégories principales</option>
          {options.mainCategories.map((mainCategory) => (
            <option key={mainCategory} value={mainCategory}>
              {mainCategory}
            </option>
          ))}
        </select>

        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Toutes les sous-catégories</option>
          {options.categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </select>

        <select name="capacity" defaultValue={filters.capacity ?? ""} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Toutes les capacités</option>
          {options.capacities.map((capacity) => (
            <option key={capacity} value={capacity}>
              {capacity}
            </option>
          ))}
        </select>

        <select
          name="availability"
          defaultValue={filters.availability}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">Disponibles et indisponibles</option>
          <option value="available">Disponibles uniquement</option>
        </select>

        <input
          type="number"
          step="1"
          min="0"
          name="minPrice"
          defaultValue={filters.minPrice}
          placeholder="Prix min"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />

        <input
          type="number"
          step="1"
          min="0"
          name="maxPrice"
          defaultValue={filters.maxPrice}
          placeholder="Prix max"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="sm:col-span-2 lg:col-span-2 flex gap-2">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Filtrer
          </button>
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Réinitialiser
          </Link>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          Aucun produit trouvé avec ces filtres.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
