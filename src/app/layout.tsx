import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "OR GAZ - Catalogue & Rechargement",
  description:
    "Catalogue OR GAZ : bouteilles, packs, accessoires et recharges avec prix actuel et commande en ligne.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
              © {new Date().getFullYear()} OR GAZ — Livraison gratuite · Prix actuel garanti
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
