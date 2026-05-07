import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import { orderStatusSchema } from "@/utils/validations";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isStatusTransitionAllowed(currentStatus: string, nextStatus: string) {
  if (currentStatus === nextStatus) {
    return true;
  }

  if (currentStatus === "novo") {
    return ["confirmado", "cancelado"].includes(nextStatus);
  }

  if (currentStatus === "confirmado") {
    return ["finalizado", "cancelado"].includes(nextStatus);
  }

  return false;
}

export async function PATCH(request: Request, context: RouteContext) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = orderStatusSchema.parse(body);
    const { id } = await context.params;
    const supabase = createSupabaseServerClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { message: "Pedido nao encontrado." },
        { status: 404 },
      );
    }

    if (!isStatusTransitionAllowed(order.status, parsed.status)) {
      return NextResponse.json(
        { message: "Essa mudanca de status nao e permitida." },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: parsed.status } as never)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: "Falha ao atualizar status." },
        { status: 500 },
      );
    }

    revalidatePath("/admin/pedidos");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar o pedido.",
      },
      { status: 400 },
    );
  }
}
