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

export async function PATCH(request: Request, context: RouteContext) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = orderStatusSchema.parse(body);
    const { id } = await context.params;
    const supabase = createSupabaseServerClient();

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
            : "Não foi possível atualizar o pedido.",
      },
      { status: 400 },
    );
  }
}
