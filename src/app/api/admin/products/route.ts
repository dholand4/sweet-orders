import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import { productSchema } from "@/utils/validations";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productSchema.parse(body);
    const supabase = createSupabaseServerClient();

    const isUpdate = !!parsed.id;

    const productPayload = {
      name:               parsed.name,
      type:               parsed.type,
      description:        parsed.description || null,
      image_url:          parsed.image_url || null,
      max_flavors:        parsed.max_flavors as 1 | 2,
      max_toppings:       parsed.max_toppings as 0 | 1 | 2,
      allow_dough_choice: parsed.allow_dough_choice,
      is_active:          parsed.is_active,
      sort_order:         parsed.sort_order ?? 0,
    };

    let productId: string;

    if (isUpdate) {
      const { error } = await supabase
        .from("products")
        .update(productPayload)
        .eq("id", parsed.id!);
      if (error) throw new Error(error.message);
      productId = parsed.id!;
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productPayload)
        .select("id")
        .single();
      if (error || !data) throw new Error(error?.message ?? "Falha ao criar produto.");
      productId = data.id;
    }

    // Tamanhos
    if (isUpdate) {
      await supabase.from("product_sizes").delete().eq("product_id", productId);
    }
    if (parsed.sizes && parsed.sizes.length > 0) {
      const sizesPayload = parsed.sizes.map((s, i) => ({
        product_id: productId,
        name:       s.name,
        servings:   s.servings || null,
        price:      s.price,
        is_active:  s.is_active ?? true,
        sort_order: s.sort_order ?? i,
      }));
      const { error: sizeError } = await supabase.from("product_sizes").insert(sizesPayload);
      if (sizeError) throw new Error(sizeError.message);
    }

    // Recheios
    await supabase.from("product_flavors").delete().eq("product_id", productId);
    if (parsed.flavor_ids && parsed.flavor_ids.length > 0) {
      await supabase.from("product_flavors").insert(
        parsed.flavor_ids.map((fid) => ({ product_id: productId, flavor_option_id: fid }))
      );
    }

    // Coberturas (creme)
    await supabase.from("product_toppings").delete().eq("product_id", productId);
    if (parsed.topping_ids && parsed.topping_ids.length > 0) {
      await supabase.from("product_toppings").insert(
        parsed.topping_ids.map((tid) => ({ product_id: productId, flavor_option_id: tid }))
      );
    }

    // Estilos decorativos
    await supabase.from("product_decoration_styles").delete().eq("product_id", productId);
    if (parsed.decoration_style_ids && parsed.decoration_style_ids.length > 0) {
      await supabase.from("product_decoration_styles").insert(
        parsed.decoration_style_ids.map((did) => ({ product_id: productId, decoration_style_id: did }))
      );
    }

    revalidatePath("/admin/produtos");
    revalidatePath("/", "layout");

    return NextResponse.json({
      message: isUpdate ? "Produto atualizado com sucesso." : "Produto criado com sucesso.",
      id: productId,
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
    const { error } = await supabase.from("products").update({ is_active }).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/produtos");
    revalidatePath("/", "layout");

    return NextResponse.json({ message: "Status atualizado." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Operação falhou." },
      { status: 400 },
    );
  }
}
