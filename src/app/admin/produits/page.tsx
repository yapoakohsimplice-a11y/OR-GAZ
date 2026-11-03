import Link from "next/link";
import { getCatalogueProducts } from "@/lib/catalog";
import { seedCatalogIfEmpty } from "@/lib/seed";
import { createProductAction, deleteProductAction, updateProductAction } from "./actions";

const categoryLabels: Record<string, string> = {
  BOUTEILLES_COMPLETES: "Bouteilles complètes",
  PACKS_COMPLETS: "Packs complets",
  ACCESSOIRES: "Accessoires",
  RECHARGE_BOUTEILLE_EXISTANTE: "Recharge bouteille existante",
};

const allCategories = [
  "BOUTEILLES_COMPLETES",
  "PACKS_COMPLETS",
  "ACCESSOIRES",
  "RECHARGE_BOUTEILLE_EXISTANTE",
] as const;

const capacities = ["", "B6", "B12", "B28"] as const;

export default async function AdminProduitsPage() {
  await seedCatalogIfEmpty();
  const products = await getCatalogueProducts({ includeInactive: true });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Administration des produits</h1>
          <p className="mt-2 text-slate-600">Ajoutez, modifiez, désactivez ou supprimez vos produits OR GAZ.</p>
        </div>
        <Link href="/catalogue" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
          Retour catalogue
        </Link>
      </div>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ajouter un produit</h2>

        <form action={createProductAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nom du produit" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="brand" required placeholder="Marque" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />

          <select name="mainCategory" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="ACHETER">ACHETER</option>
            <option value="RECHARGER">RECHARGER</option>
          </select>

          <select name="category" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>

          <input name="bottleType" required placeholder="Type de bouteille" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />

          <select name="capacity" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            {capacities.map((capacity) => (
              <option key={capacity || "none"} value={capacity}>
                {capacity || "Aucune capacité"}
              </option>
            ))}
          </select>

          <input
            name="weightCapacity"
            required
            placeholder="Poids/capacité (ex: 12 kg)"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="photoUrl"
            required
            placeholder="URL de la photo"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />

          <input
            name="currentPrice"
            type="number"
            min="0"
            step="1"
            required
            placeholder="Prix actuel"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            required
            placeholder="Stock"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />

          <textarea
            name="description"
            required
            placeholder="Description produit"
            className="md:col-span-2 min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isAvailable" defaultChecked />
            Disponible
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked />
            Actif
          </label>

          <button type="submit" className="md:col-span-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-amber-300">
            Ajouter le produit
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {products.map((product) => (
          <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                #{product.id} — {product.name}
              </h3>
              <Link href={`/produits/${product.slug}`} className="text-sm font-semibold text-amber-700 hover:text-amber-600">
                Voir la fiche produit
              </Link>
            </div>

            <form action={updateProductAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={String(product.id)} />

              <input name="name" defaultValue={product.name} required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input name="brand" defaultValue={product.brand} required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />

              <select name="mainCategory" defaultValue={product.mainCategory} required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                <option value="ACHETER">ACHETER</option>
                <option value="RECHARGER">RECHARGER</option>
              </select>

              <select name="category" defaultValue={product.category} required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>

              <input name="bottleType" defaultValue={product.bottleType} required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />

              <select
                name="capacity"
                defaultValue={product.capacity ?? ""}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                {capacities.map((capacity) => (
                  <option key={capacity || "none"} value={capacity}>
                    {capacity || "Aucune capacité"}
                  </option>
                ))}
              </select>

              <input
                name="weightCapacity"
                defaultValue={product.weightCapacity}
                required
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <input name="photoUrl" defaultValue={product.photoUrl} required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />

              <input
                name="currentPrice"
                type="number"
                min="0"
                step="1"
                defaultValue={Number(product.currentPrice)}
                required
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />

              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue={product.stock}
                required
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />

              <textarea
                name="description"
                defaultValue={product.description}
                required
                className="md:col-span-2 min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />

              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isAvailable" defaultChecked={product.isAvailable} />
                Disponible
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
                Actif
              </label>

              <button type="submit" className="md:col-span-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">
                Enregistrer les modifications
              </button>
            </form>

            <form action={deleteProductAction} className="mt-3">
              <input type="hidden" name="id" value={String(product.id)} />
              <button type="submit" className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                Supprimer définitivement ce produit
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
