"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

type CheckoutResult = {
  orderId: number;
  total: number;
};

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CheckoutResult | null>(null);

  const total = subtotal;

  async function handleCheckout() {
    setError(null);
    setSuccess(null);

    if (!customerName.trim()) {
      setError("Veuillez saisir votre nom avant de valider la commande.");
      return;
    }

    if (items.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      const data = (await response.json()) as
        | { orderId: number; total: number }
        | { error: string };

      if (!response.ok) {
        setError("error" in data ? data.error : "Impossible de valider la commande.");
        return;
      }

      if (!("orderId" in data) || !("total" in data)) {
        setError("Réponse de commande invalide.");
        return;
      }

      setSuccess({ orderId: data.orderId, total: data.total });
      clearCart();
    } catch {
      setError("Erreur réseau. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">Panier OR GAZ</h1>
        <p className="mt-2 text-slate-600">Livraison gratuite sur toutes les commandes.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-700">Votre panier est vide.</p>
          <Link
            href="/catalogue"
            className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-amber-300"
          >
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.productId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img src={item.photoUrl} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                    <p className="text-sm text-slate-600">
                      {item.brand}
                      {item.capacity ? ` · ${item.capacity}` : ""}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{formatPrice(item.unitPrice)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor={`qty-${item.productId}`} className="text-sm text-slate-600">
                      Qté
                    </label>
                    <input
                      id={`qty-${item.productId}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                      className="w-20 rounded-lg border border-slate-300 px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="rounded-lg px-3 py-1 text-sm text-rose-700 hover:bg-rose-50"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Résumé</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-700">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="mt-2 border-t border-slate-200 pt-2 text-base font-semibold text-slate-950">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="text-sm font-medium text-slate-700" htmlFor="customerName">
                Nom du client
              </label>
              <input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Ex: Mamadou Diallo"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
            {success ? (
              <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                Commande #{success.orderId} validée. Total confirmé: {formatPrice(success.total)}.
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Validation..." : "Valider la commande"}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
