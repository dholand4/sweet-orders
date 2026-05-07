export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          type: "bolo" | "torta" | "outro";
          description: string | null;
          image_url: string | null;
          max_flavors: 1 | 2;
          max_toppings: 0 | 1 | 2;
          allow_dough_choice: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: "bolo" | "torta" | "outro";
          description?: string | null;
          image_url?: string | null;
          max_flavors?: 1 | 2;
          max_toppings?: 0 | 1 | 2;
          allow_dough_choice?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "bolo" | "torta" | "outro";
          description?: string | null;
          image_url?: string | null;
          max_flavors?: 1 | 2;
          max_toppings?: 0 | 1 | 2;
          allow_dough_choice?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      product_sizes: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          servings: string | null;
          price: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          servings?: string | null;
          price: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          servings?: string | null;
          price?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      flavor_options: {
        Row: {
          id: string;
          name: string;
          type: "recheio" | "cobertura" | "ambos";
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: "recheio" | "cobertura" | "ambos";
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "recheio" | "cobertura" | "ambos";
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      decoration_styles: {
        Row: {
          id: string;
          name: string;
          price_type: "included" | "fixed_extra" | "negotiate";
          price_extra: number | null;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price_type?: "included" | "fixed_extra" | "negotiate";
          price_extra?: number | null;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price_type?: "included" | "fixed_extra" | "negotiate";
          price_extra?: number | null;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      product_flavors: {
        Row: { id: string; product_id: string; flavor_option_id: string };
        Insert: { id?: string; product_id: string; flavor_option_id: string };
        Update: { id?: string; product_id?: string; flavor_option_id?: string };
      };
      product_toppings: {
        Row: { id: string; product_id: string; flavor_option_id: string };
        Insert: { id?: string; product_id: string; flavor_option_id: string };
        Update: { id?: string; product_id?: string; flavor_option_id?: string };
      };
      product_decoration_styles: {
        Row: { id: string; product_id: string; decoration_style_id: string };
        Insert: { id?: string; product_id: string; decoration_style_id: string };
        Update: { id?: string; product_id?: string; decoration_style_id?: string };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          whatsapp: string;
          product_id: string | null;
          product_size_id: string | null;
          flavor_1_id: string | null;
          flavor_2_id: string | null;
          topping_1_id: string | null;
          topping_flavor_1_id: string | null;
          topping_2_id: string | null;
          decoration_style_id: string | null;
          dough_type: "massa_branca" | "massa_chocolate" | null;
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
          status: string;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          whatsapp: string;
          product_id?: string | null;
          product_size_id?: string | null;
          flavor_1_id?: string | null;
          flavor_2_id?: string | null;
          topping_1_id?: string | null;
          topping_flavor_1_id?: string | null;
          topping_2_id?: string | null;
          decoration_style_id?: string | null;
          dough_type?: "massa_branca" | "massa_chocolate" | null;
          theme?: string | null;
          notes?: string | null;
          delivery_date: string;
          delivery_time: string;
          cep?: string | null;
          street: string;
          number: string;
          district: string;
          city: string;
          reference?: string | null;
          status?: string;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          whatsapp?: string;
          product_id?: string | null;
          product_size_id?: string | null;
          flavor_1_id?: string | null;
          flavor_2_id?: string | null;
          topping_1_id?: string | null;
          topping_flavor_1_id?: string | null;
          topping_2_id?: string | null;
          decoration_style_id?: string | null;
          dough_type?: "massa_branca" | "massa_chocolate" | null;
          theme?: string | null;
          notes?: string | null;
          delivery_date?: string;
          delivery_time?: string;
          cep?: string | null;
          street?: string;
          number?: string;
          district?: string;
          city?: string;
          reference?: string | null;
          status?: string;
          total_price?: number;
          created_at?: string;
        };
      };
    };
  };
};
