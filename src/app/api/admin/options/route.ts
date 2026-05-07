import { NextResponse } from "next/server";

// Rota legada — use /api/admin/products e /api/admin/flavor-options
export async function POST() {
  return NextResponse.json(
    { message: "Rota descontinuada. Use /api/admin/products ou /api/admin/flavor-options." },
    { status: 410 },
  );
}
