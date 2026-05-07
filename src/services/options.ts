import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SizeRow = Database["public"]["Tables"]["product_sizes"]["Row"];
type FlavorRow = Database["public"]["Tables"]["flavor_options"]["Row"];
type JunctionRow = { product_id: string; flavor_option_id: string };

export type ProductWithDetails = ProductRow & {
  sizes: SizeRow[];
  allowed_flavors: FlavorRow[];
  allowed_toppings: FlavorRow[];
};

export type PublicCatalog = {
  products: ProductWithDetails[];
  allFlavors: FlavorRow[];
};

export type AdminCatalog = {
  products: ProductWithDetails[];
  allFlavors: FlavorRow[];
};

async function buildProductDetails(onlyActive: boolean): Promise<ProductWithDetails[]> {
  const supabase = createSupabaseServerClient();

  const [
    { data: products },
    { data: sizes },
    { data: flavors },
    { data: pFlavors },
    { data: pToppings },
  ] = await Promise.all([
    onlyActive
      ? supabase.from("products").select("*").eq("is_active", true).order("sort_order")
      : supabase.from("products").select("*").order("sort_order"),
    supabase.from("product_sizes").select("*").order("sort_order"),
    supabase.from("flavor_options").select("*").order("sort_order"),
    supabase.from("product_flavors").select("product_id, flavor_option_id"),
    supabase.from("product_toppings").select("product_id, flavor_option_id"),
  ]);

  const allFlavors: FlavorRow[] = flavors ?? [];
  const activeFlavors = onlyActive ? allFlavors.filter((f) => f.is_active) : allFlavors;
  const allSizes: SizeRow[] = sizes ?? [];
  const activeSizes = onlyActive ? allSizes.filter((s) => s.is_active) : allSizes;
  const flavorJunction: JunctionRow[] = pFlavors ?? [];
  const toppingJunction: JunctionRow[] = pToppings ?? [];

  return (products ?? []).map((product) => {
    const productSizes = activeSizes
      .filter((s) => s.product_id === product.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const flavorIds = flavorJunction
      .filter((j) => j.product_id === product.id)
      .map((j) => j.flavor_option_id);

    const toppingIds = toppingJunction
      .filter((j) => j.product_id === product.id)
      .map((j) => j.flavor_option_id);

    const allowed_flavors = activeFlavors
      .filter((f) => flavorIds.includes(f.id) && f.type !== "cobertura")
      .sort((a, b) => a.sort_order - b.sort_order);

    const allowed_toppings = activeFlavors
      .filter((f) => toppingIds.includes(f.id) && f.type !== "recheio")
      .sort((a, b) => a.sort_order - b.sort_order);

    return { ...product, sizes: productSizes, allowed_flavors, allowed_toppings };
  });
}

export async function getPublicCatalog(): Promise<PublicCatalog> {
  const supabase = createSupabaseServerClient();
  const [products, { data: flavors }] = await Promise.all([
    buildProductDetails(true),
    supabase.from("flavor_options").select("*").eq("is_active", true).order("sort_order"),
  ]);
  return { products, allFlavors: flavors ?? [] };
}

export async function getAdminCatalog(): Promise<AdminCatalog> {
  const supabase = createSupabaseServerClient();
  const [products, { data: flavors }] = await Promise.all([
    buildProductDetails(false),
    supabase.from("flavor_options").select("*").order("sort_order"),
  ]);
  return { products, allFlavors: flavors ?? [] };
}
