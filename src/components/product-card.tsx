import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: {
    id: number;
    slug: string;
    name: string;
    brand: string;
    mainCategory: "ACHETER" | "RECHARGER";
    category: string;
    capacity: string | null;
    weightCapacity: string;
    description: string;
    photoUrl: string;
    currentPrice: string;
    isAvailable: boolean;
    stock: number;
    isActive: boolean;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/produits/${product.slug}`} className="block">
        <img src={product.photoUrl} alt={product.name} className="h-48 w-full object-cover" />
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{product.mainCategory}</p>
            <h3 className="text-lg font-semibold text-slate-900">
              <Link href={`/produits/${product.slug}`} className="hover:text-amber-600">
                {product.name}
              </Link>
            </h3>
            <p className="text-sm text-slate-600">
              {product.brand}
              {product.capacity ? ` · ${product.capacity}` : ""}
            </p>
          </div>
          <p className="text-base font-bold text-slate-950">{formatPrice(product.currentPrice)}</p>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.isAvailable && product.stock > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {product.isAvailable && product.stock > 0 ? `En stock (${product.stock})` : "Indisponible"}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
