"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/panier", label: "Panier" },
  { href: "/admin/produits", label: "Administration" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold tracking-wide text-amber-400">
            OR GAZ
          </span>
          <span className="hidden text-sm text-slate-600 sm:block">Distribution & Rechargement</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-950 text-amber-300"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {link.label}
                {link.href === "/panier" ? ` (${itemCount})` : ""}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
