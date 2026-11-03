import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCatalogueProducts } from "@/lib/catalog";
import { seedCatalogIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await seedCatalogIfEmpty();

  const featuredProducts = (await getCatalogueProducts({ availability: "available" })).slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-2xl sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">OR GAZ</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Votre catalogue professionnel de gaz, bouteilles et recharges.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-200">
          Achetez vos bouteilles complètes, packs et accessoires, ou rechargez votre bouteille existante.
          Prix à jour, panier intelligent et livraison gratuite.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/catalogue"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Voir le catalogue
          </Link>
          <Link
            href="/admin/produits"
            className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Gérer les produits
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">ACHETER</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Bouteilles complètes (B6, B12, B28)</li>
            <li>Packs complets</li>
            <li>Accessoires</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">RECHARGER</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Recharge de bouteille existante</li>
            <li>Suivi des disponibilités en temps réel</li>
            <li>Prix actuel appliqué automatiquement en commande</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-950">Produits en vedette</h2>
          <Link href="/catalogue" className="text-sm font-semibold text-amber-700 hover:text-amber-600">
            Tout voir →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
