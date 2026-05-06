export type AdminOrder = {
  id: string;
  customer_name: string;
  whatsapp: string;
  theme: string | null;
  notes: string | null;
  delivery_date: string;
  delivery_time: string;
  street: string;
  number: string;
  district: string;
  city: string;
  reference: string | null;
  status: string;
  total_price: number | null;
  created_at: string;
  product_type: {
    id: string;
    name: string;
  } | null;
  product_size: {
    id: string;
    name: string;
    servings: string | null;
    price: number;
  } | null;
  flavor: {
    id: string;
    name: string;
  } | null;
  filling: {
    id: string;
    name: string;
  } | null;
  topping: {
    id: string;
    name: string;
  } | null;
};
