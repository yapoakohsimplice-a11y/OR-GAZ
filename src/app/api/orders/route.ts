import { NextResponse } from "next/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";

type OrderPayload = {
  customerName: string;
  items: Array<{ productId: number; quantity: number }>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OrderPayload>;

    if (!body.customerName || !body.customerName.trim()) {
      return NextResponse.json({ error: "Le nom client est requis." }, { status: 400 });
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
    }

    const sanitizedItems = body.items
      .map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }))
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0 && Number.isInteger(item.quantity) && item.quantity > 0);

    if (sanitizedItems.length === 0) {
      return NextResponse.json({ error: "Aucun produit valide dans la commande." }, { status: 400 });
    }

    const uniqueProductIds = [...new Set(sanitizedItems.map((item) => item.productId))];

    const dbProducts = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, uniqueProductIds), eq(products.isActive, true)));

    const productById = new Map(dbProducts.map((p) => [p.id, p]));

    let total = 0;
    const lines: Array<{
      productId: number;
      productName: string;
      productBrand: string;
      productCapacity: string | null;
      photoUrl: string;
      unitPrice: string;
      quantity: number;
      lineTotal: string;
    }> = [];

    for (const item of sanitizedItems) {
      const product = productById.get(item.productId);

      if (!product) {
        return NextResponse.json({ error: `Produit #${item.productId} introuvable ou inactif.` }, { status: 400 });
      }

      if (!product.isAvailable || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} n'est pas disponible en quantité suffisante.` },
          { status: 400 },
        );
      }

      const unit = Number(product.currentPrice);
      const line = unit * item.quantity;
      total += line;

      lines.push({
        productId: product.id,
        productName: product.name,
        productBrand: product.brand,
        productCapacity: product.capacity,
        photoUrl: product.photoUrl,
        unitPrice: unit.toFixed(2),
        quantity: item.quantity,
        lineTotal: line.toFixed(2),
      });
    }

    const createdOrder = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          customerName: body.customerName!.trim(),
          totalAmount: total.toFixed(2),
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          productName: line.productName,
          productBrand: line.productBrand,
          productCapacity: line.productCapacity,
          photoUrl: line.photoUrl,
          unitPrice: line.unitPrice,
          quantity: line.quantity,
          lineTotal: line.lineTotal,
        })),
      );

      for (const line of lines) {
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${line.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, line.productId));
      }

      return order;
    });

    return NextResponse.json({ orderId: createdOrder.id, total });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur lors de la commande." },
      { status: 500 },
    );
  }
}
