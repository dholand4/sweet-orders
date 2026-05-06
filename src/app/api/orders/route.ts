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
      .select("id, price, product_type_id, active")
      .eq("id", parsed.productSizeId)
      .single();

    if (sizeError || !size?.active) {
      return NextResponse.json(
        { message: "Tamanho selecionado não está disponível." },
        { status: 400 },
      );
    }

    if (size.product_type_id !== parsed.productTypeId) {
      return NextResponse.json(
        { message: "O tamanho escolhido não pertence ao produto informado." },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("orders").insert({
      customer_name: parsed.customerName,
      whatsapp: parsed.whatsapp,
      product_type_id: parsed.productTypeId,
      product_size_id: parsed.productSizeId,
      flavor_id: parsed.flavorId,
      filling_id: parsed.fillingId,
      topping_id: parsed.toppingId,
      theme: parsed.theme || null,
      notes: parsed.notes || null,
      delivery_date: parsed.deliveryDate,
      delivery_time: parsed.deliveryTime,
      street: parsed.street,
      number: parsed.number,
      district: parsed.district,
      city: parsed.city,
      reference: parsed.reference || null,
      status: "novo",
      total_price: size.price,
    });

    if (error) {
      return NextResponse.json(
        { message: "Não foi possível salvar o pedido." },
        { status: 500 },
      );
    }

    revalidatePath("/admin/pedidos");

    return NextResponse.json({
      message:
        "Pedido enviado com sucesso! A Dany Ruivo irá confirmar pelo WhatsApp.",
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
