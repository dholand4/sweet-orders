import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  try {
    const { whatsapp, store_name } = (await request.json()) as {
      whatsapp: string;
      store_name: string;
    };
    if (!whatsapp?.trim()) {
      return NextResponse.json({ message: "WhatsApp é obrigatório." }, { status: 400 });
    }
    const supabase = createSupabaseServerClient();

    // Get existing row to upsert
    const { data: existing } = await supabase
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from("store_settings")
        .update({ whatsapp: whatsapp.trim(), store_name: store_name?.trim() || "Dany Ruivo - Bolos e Tortas", updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("store_settings")
        .insert({ whatsapp: whatsapp.trim(), store_name: store_name?.trim() || "Dany Ruivo - Bolos e Tortas" });
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Configurações salvas com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao salvar." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("store_settings")
      .select("id, whatsapp, store_name")
      .limit(1)
      .maybeSingle();
    return NextResponse.json(data ?? { whatsapp: "", store_name: "Dany Ruivo - Bolos e Tortas" });
  } catch {
    return NextResponse.json({ whatsapp: "", store_name: "" });
  }
}
