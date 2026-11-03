import { db } from "@/db";
import { products } from "@/db/schema";
export async function seedCatalogIfEmpty() {
  await db
    .insert(products)
    .values([
      {
        slug: "orgaz-b6-complete",
      name: "Bouteille OR GAZ B6 complète",
      brand: "OR GAZ",
      mainCategory: "ACHETER",
      category: "BOUTEILLES_COMPLETES",
      bottleType: "Butane",
      capacity: "B6",
      weightCapacity: "6 kg",
      description:
        "Bouteille complète B6 prête à l'emploi, idéale pour une utilisation domestique quotidienne.",
      photoUrl:
        "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80",
      currentPrice: "6500",
      isAvailable: true,
      stock: 25,
      isActive: true,
    },
    {
      slug: "orgaz-b12-complete",
      name: "Bouteille OR GAZ B12 complète",
      brand: "OR GAZ",
      mainCategory: "ACHETER",
      category: "BOUTEILLES_COMPLETES",
      bottleType: "Butane",
      capacity: "B12",
      weightCapacity: "12 kg",
      description:
        "Format B12 pour les familles et usages réguliers avec une excellente autonomie.",
      photoUrl:
        "https://images.unsplash.com/photo-1601314167099-232775b3d6fd?auto=format&fit=crop&w=1200&q=80",
      currentPrice: "11000",
      isAvailable: true,
      stock: 18,
      isActive: true,
    },
    {
      slug: "orgaz-b28-complete",
      name: "Bouteille OR GAZ B28 complète",
      brand: "OR GAZ",
      mainCategory: "ACHETER",
      category: "BOUTEILLES_COMPLETES",
      bottleType: "Propane",
      capacity: "B28",
      weightCapacity: "28 kg",
      description:
        "Grande capacité B28 pour usages intensifs, professionnels ou longue durée.",
      photoUrl:
        "https://images.unsplash.com/photo-1602526432604-029a709e131f?auto=format&fit=crop&w=1200&q=80",
      currentPrice: "24500",
      isAvailable: true,
      stock: 9,
      isActive: true,
    },
    {
      slug: "pack-cuisson-orgaz",
      name: "Pack cuisson OR GAZ",
      brand: "OR GAZ",
      mainCategory: "ACHETER",
      category: "PACKS_COMPLETS",
      bottleType: "Butane",
      capacity: "B6",
      weightCapacity: "B6 + détendeur + tuyau",
      description:
        "Pack complet prêt à cuisiner: bouteille, détendeur certifié et tuyau renforcé.",
      photoUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      currentPrice: "8900",
      isAvailable: true,
      stock: 14,
      isActive: true,
    },
    {
      slug: "detendeur-securise-orgaz",
      name: "Détendeur sécurisé OR GAZ",
      brand: "OR GAZ",
      mainCategory: "ACHETER",
      category: "ACCESSOIRES",
      bottleType: "Compatible multi-bouteilles",
      capacity: null,
      weightCapacity: "Accessoire universel",
      description:
        "Détendeur haute sécurité pour un contrôle stable de la pression de gaz.",
      photoUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      currentPrice: "3500",
      isAvailable: true,
      stock: 40,
      isActive: true,
    },
      {
        slug: "recharge-b12-orgaz",
        name: "Recharge bouteille OR GAZ B12",
        brand: "OR GAZ",
        mainCategory: "RECHARGER",
        category: "RECHARGE_BOUTEILLE_EXISTANTE",
        bottleType: "Butane",
        capacity: "B12",
        weightCapacity: "12 kg",
        description:
          "Recharge officielle OR GAZ pour bouteille existante B12.",
        photoUrl:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
        currentPrice: "8000",
        isAvailable: true,
        stock: 30,
        isActive: true,
      },
    ])
    .onConflictDoNothing({ target: products.slug });
}
