import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

type ProductType = Database["public"]["Tables"]["product_types"]["Row"];
type ProductSize = Database["public"]["Tables"]["product_sizes"]["Row"];
type Flavor = Database["public"]["Tables"]["flavors"]["Row"];
type Filling = Database["public"]["Tables"]["fillings"]["Row"];
type Topping = Database["public"]["Tables"]["toppings"]["Row"];

export type PublicOptionsSnapshot = {
  productTypes: ProductType[];
  productSizes: ProductSize[];
  flavors: Flavor[];
  fillings: Filling[];
  toppings: Topping[];
};

export type AdminOptionsSnapshot = PublicOptionsSnapshot;

export async function getPublicOptionsSnapshot(): Promise<PublicOptionsSnapshot> {
  const supabase = createSupabaseServerClient();

  const [{ data: productTypes }, { data: productSizes }, { data: flavors }, { data: fillings }, { data: toppings }] =
    await Promise.all([
      supabase.from("product_types").select("*").eq("active", true).order("name"),
      supabase.from("product_sizes").select("*").eq("active", true).order("price"),
      supabase.from("flavors").select("*").eq("active", true).order("name"),
      supabase.from("fillings").select("*").eq("active", true).order("name"),
      supabase.from("toppings").select("*").eq("active", true).order("name"),
    ]);

  return {
    productTypes: productTypes ?? [],
    productSizes: productSizes ?? [],
    flavors: flavors ?? [],
    fillings: fillings ?? [],
    toppings: toppings ?? [],
  };
}

export async function getAdminOptionsSnapshot(): Promise<AdminOptionsSnapshot> {
  const supabase = createSupabaseServerClient();

  const [{ data: productTypes }, { data: productSizes }, { data: flavors }, { data: fillings }, { data: toppings }] =
    await Promise.all([
      supabase.from("product_types").select("*").order("created_at"),
      supabase.from("product_sizes").select("*").order("created_at"),
      supabase.from("flavors").select("*").order("created_at"),
      supabase.from("fillings").select("*").order("created_at"),
      supabase.from("toppings").select("*").order("created_at"),
    ]);

  return {
    productTypes: productTypes ?? [],
    productSizes: productSizes ?? [],
    flavors: flavors ?? [],
    fillings: fillings ?? [],
    toppings: toppings ?? [],
  };
}
