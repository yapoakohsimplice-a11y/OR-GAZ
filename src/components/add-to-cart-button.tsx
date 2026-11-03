"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type AddToCartButtonProps = {
  product: {
    id: number;
    slug: string;
    name: string;
    brand: string;
    capacity: string | null;
    photoUrl: string;
    currentPrice: string;
    isAvailable: boolean;
    stock: number;
    isActive: boolean;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const disabled = !product.isActive || !product.isAvailable || product.stock <= 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          capacity: product.capacity,
          photoUrl: product.photoUrl,
          unitPrice: Number(product.currentPrice),
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
    >
      {disabled ? "Indisponible" : added ? "Ajouté ✓" : "Ajouter au panier"}
    </button>
  );
}
