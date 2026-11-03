import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

const categoryLabels: Record<string, string> = {
  BOUTEILLES_COMPLETES: "Bouteilles complètes",
  PACKS_COMPLETS: "Packs complets",
  ACCESSOIRES: "Accessoires",
  RECHARGE_BOUTEILLE_EXISTANTE: "Recharge de bouteille existante",
};

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
        <div>
          <img src={product.photoUrl} alt={product.name} className="h-[380px] w-full rounded-2xl object-cover" />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{product.mainCategory}</p>
          <h1 className="text-3xl font-bold text-slate-950">{product.name}</h1>

          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Marque:</span> {product.brand}
            </p>
            <p>
              <span className="font-semibold">Sous-catégorie:</span> {categoryLabels[product.category]}
            </p>
            <p>
              <span className="font-semibold">Type de bouteille:</span> {product.bottleType}
            </p>
            <p>
              <span className="font-semibold">Capacité:</span> {product.capacity ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Poids/Capacité:</span> {product.weightCapacity}
            </p>
          </div>

          <p className="text-base text-slate-700">{product.description}</p>

          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-600">Prix actuel</p>
            <p className="text-3xl font-bold text-slate-950">{formatPrice(product.currentPrice)}</p>
            <p className="mt-2 text-sm text-slate-600">
              {product.isAvailable && product.stock > 0
                ? `Disponible · Stock: ${product.stock}`
                : "Indisponible actuellement"}
            </p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
