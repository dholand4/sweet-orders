import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { message: "Parâmetros from e to são obrigatórios." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  const { data: rows, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, whatsapp, delivery_date, delivery_time, status, total_price, created_at, product_id, product_size_id",
    )
    .gte("delivery_date", from)
    .lte("delivery_date", to)
    .order("delivery_date", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const safeRows = rows ?? [];

  const productIds = [...new Set(safeRows.map((r) => r.product_id).filter(Boolean))];
  const sizeIds = [...new Set(safeRows.map((r) => r.product_size_id).filter(Boolean))];

  const [products, sizes] = await Promise.all([
    productIds.length
      ? supabase.from("products").select("id, name").in("id", productIds)
      : { data: [] },
    sizeIds.length
      ? supabase.from("product_sizes").select("id, name").in("id", sizeIds)
      : { data: [] },
  ]);

  const pMap = Object.fromEntries((products.data ?? []).map((p) => [p.id, p]));
  const sMap = Object.fromEntries((sizes.data ?? []).map((s) => [s.id, s]));

  const orders = safeRows.map((r) => ({
    ...r,
    total_price: Number(r.total_price),
    product:      r.product_id      ? (pMap[r.product_id] ?? null)      : null,
    product_size: r.product_size_id ? (sMap[r.product_size_id] ?? null) : null,
  }));

  const confirmedOrFinished = orders.filter((o) =>
    ["confirmado", "finalizado"].includes(o.status),
  );

  const stats = {
    total:        orders.length,
    totalRevenue: confirmedOrFinished.reduce((sum, o) => sum + o.total_price, 0),
    byStatus: {
      novo:       orders.filter((o) => o.status === "novo").length,
      confirmado: orders.filter((o) => o.status === "confirmado").length,
      finalizado: orders.filter((o) => o.status === "finalizado").length,
      cancelado:  orders.filter((o) => o.status === "cancelado").length,
    },
  };

  return NextResponse.json({ orders, stats });
}
