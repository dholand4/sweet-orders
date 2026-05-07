import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import { flavorOptionSchema } from "@/utils/validations";

/** Save payload, retrying without has_flavor if the column doesn't exist yet in this DB. */
async function upsertFlavor(
  supabase: ReturnType<typeof import("@/lib/supabase").createSupabaseServerClient>,
  id: string | undefined,
  payload: Record<string, unknown>,
) {
  const run = (p: Record<string, unknown>) =>
    id
      ? supabase.from("flavor_options").update(p).eq("id", id)
      : supabase.from("flavor_options").insert(p);

  let { error } = await run(payload);

  // Column doesn't exist yet → retry without has_flavor (user must run migration)
  if (error?.message?.includes("has_flavor")) {
    const { has_flavor: _ignored, ...rest } = payload;
    const result = await run(rest);
    error = result.error;
  }

  if (error) throw new Error(error.message);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = flavorOptionSchema.parse(body);
    const supabase = createSupabaseServerClient();

    const payload = {
      name:        parsed.name,
      type:        parsed.type,
      description: parsed.description || null,
      has_flavor:  parsed.has_flavor ?? true,
      is_active:   parsed.is_active,
      sort_order:  parsed.sort_order ?? 0,
    };

    await upsertFlavor(supabase, parsed.id, payload);

    revalidatePath("/admin/sabores");
    revalidatePath("/", "layout");

    return NextResponse.json({
      message: parsed.id ? "Sabor atualizado com sucesso." : "Sabor criado com sucesso.",
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
      .from("flavor_options")
      .update({ is_active })
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/sabores");
    revalidatePath("/", "layout");

    return NextResponse.json({ message: "Status atualizado." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Operação falhou." },
      { status: 400 },
    );
  }
}
