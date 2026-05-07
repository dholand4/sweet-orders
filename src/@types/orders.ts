export type FlavorRef = { id: string; name: string } | null;
export type ProductRef = { id: string; name: string; type: string } | null;
export type SizeRef = { id: string; name: string; servings: string | null; price: number } | null;

export type AdminOrder = {
  id: string;
  customer_name: string;
  whatsapp: string;
  theme: string | null;
  notes: string | null;
  delivery_date: string;
  delivery_time: string;
  cep: string | null;
  street: string;
  number: string;
  district: string;
  city: string;
  reference: string | null;
  dough_type: "massa_branca" | "massa_chocolate" | null;
  status: string;
  total_price: number;
  created_at: string;
  product: ProductRef;
  product_size: SizeRef;
  flavor_1: FlavorRef;
  flavor_2: FlavorRef;
  topping_1: FlavorRef;
  topping_2: FlavorRef;
};
