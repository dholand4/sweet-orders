import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { orderFormSchema } from "@/utils/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderFormSchema.parse(body);
    const supabase = createSupabaseServerClient();

    const { data: size, error: sizeError } = await supabase
      .from("product_sizes")
      .select("id, price, product_id, is_active")
      .eq("id", parsed.productSizeId)
      .single();

    if (sizeError || !size?.is_active) {
      return NextResponse.json(
        { message: "Tamanho selecionado não está disponível." },
        { status: 400 },
      );
    }

    if (size.product_id !== parsed.productId) {
      return NextResponse.json(
        { message: "O tamanho escolhido não pertence ao produto informado." },
        { status: 400 },
      );
    }

    // Buscar estilo decorativo para calcular preço extra
    let priceExtra = 0;
    if (parsed.decorationStyleId) {
      const { data: decoStyle } = await supabase
        .from("decoration_styles")
        .select("price_type, price_extra")
        .eq("id", parsed.decorationStyleId)
        .single();

      if (decoStyle?.price_type === "fixed_extra" && decoStyle.price_extra) {
        priceExtra = Number(decoStyle.price_extra);
      }
    }

    const themeValue =
      parsed.wantsTheme === "sim"
        ? [parsed.themeStyle, parsed.themeDescription].filter(Boolean).join(" - ")
        : parsed.theme || null;

    const { error } = await supabase.from("orders").insert({
      customer_name:       parsed.customerName,
      whatsapp:            parsed.whatsapp,
      product_id:          parsed.productId,
      product_size_id:     parsed.productSizeId,
      flavor_1_id:         parsed.flavor1Id || null,
      flavor_2_id:         parsed.flavor2Id || null,
      topping_1_id:        parsed.topping1Id || null,
      topping_2_id:        parsed.topping2Id || null,
      decoration_style_id: parsed.decorationStyleId || null,
      dough_type:          parsed.doughType ?? null,
      theme:               themeValue,
      notes:               parsed.notes || null,
      delivery_date:       parsed.deliveryDate,
      delivery_time:       parsed.deliveryTime,
      cep:                 parsed.cep || null,
      street:              parsed.street,
      number:              parsed.number,
      district:            parsed.district,
      city:                parsed.city,
      reference:           parsed.reference || null,
      status:              "novo",
      total_price:         size.price + priceExtra,
    });

    if (error) {
      return NextResponse.json(
        { message: "Não foi possível salvar o pedido." },
        { status: 500 },
      );
    }

    revalidatePath("/admin/pedidos");

    return NextResponse.json({
      message: "Pedido enviado com sucesso! A Dany Ruivo irá confirmar pelo WhatsApp.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar o pedido.",
      },
      { status: 400 },
    );
  }
}
