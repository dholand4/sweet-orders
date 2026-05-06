import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/database";
import {
  optionMutationSchema,
  productSizeMutationSchema,
} from "@/utils/validations";

const tableMap = {
  product_types: "product_types",
  flavors: "flavors",
  fillings: "fillings",
  toppings: "toppings",
} as const;

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = createSupabaseServerClient();

    if (body.entity === "product_sizes") {
      const parsed = productSizeMutationSchema.parse(body);
      const payload: Database["public"]["Tables"]["product_sizes"]["Insert"] = {
        product_type_id: parsed.productTypeId,
        name: parsed.name,
        servings: parsed.servings || null,
        price: parsed.price,
        active: parsed.active,
      };
      const { error } = parsed.id
        ? await supabase
            .from("product_sizes")
            .update(payload as never)
            .eq("id", parsed.id)
        : await supabase.from("product_sizes").insert(payload as never);

      if (error) {
        return NextResponse.json(
          { message: "Falha ao salvar tamanho." },
          { status: 500 },
        );
      }
    } else {
      const parsed = optionMutationSchema.parse(body);
      const payload =
        parsed.entity === "product_types"
          ? {
              name: parsed.name,
              slug: parsed.slug,
              active: parsed.active,
            }
          : {
              name: parsed.name,
              active: parsed.active,
            };

      const tableName = tableMap[parsed.entity];
      const { error } = parsed.id
        ? await supabase.from(tableName).update(payload as never).eq("id", parsed.id)
        : await supabase.from(tableName).insert(payload as never);

      if (error) {
        return NextResponse.json(
          { message: "Falha ao salvar opção." },
          { status: 500 },
        );
      }
    }

    revalidatePath("/admin/opcoes");
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar a opção.",
      },
      { status: 400 },
    );
  }
}
