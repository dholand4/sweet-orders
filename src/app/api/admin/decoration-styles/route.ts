import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import { decorationStyleSchema } from "@/utils/validations";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = decorationStyleSchema.parse(body);
    const supabase = createSupabaseServerClient();

    const payload = {
      name:        parsed.name,
      price_type:  parsed.price_type,
      price_extra: parsed.price_type === "fixed_extra" ? (parsed.price_extra ?? null) : null,
      description: parsed.description || null,
      is_active:   parsed.is_active,
      sort_order:  parsed.sort_order ?? 0,
    };

    if (parsed.id) {
      const { error } = await supabase
        .from("decoration_styles")
        .update(payload)
        .eq("id", parsed.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("decoration_styles").insert(payload);
      if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/sabores");
    revalidatePath("/");

    return NextResponse.json({
      message: parsed.id ? "Estilo atualizado com sucesso." : "Estilo criado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Operação falhou." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const { id, is_active } = (await request.json()) as { id: string; is_active: boolean };
    if (!id) return NextResponse.json({ message: "ID obrigatório." }, { status: 400 });

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("decoration_styles")
      .update({ is_active })
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/sabores");
    revalidatePath("/");

    return NextResponse.json({ message: "Status atualizado." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Operação falhou." },
      { status: 400 },
    );
  }
}
