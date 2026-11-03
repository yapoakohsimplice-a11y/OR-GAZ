export function formatPrice(price: string | number) {
  const value = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}
