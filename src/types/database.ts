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
      product_types: {
        Row: {
          id: string;
          name: string;
          slug: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      product_sizes: {
        Row: {
          id: string;
          product_type_id: string;
          name: string;
          servings: string | null;
          price: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_type_id: string;
          name: string;
          servings?: string | null;
          price: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_type_id?: string;
          name?: string;
          servings?: string | null;
          price?: number;
          active?: boolean;
          created_at?: string;
        };
      };
      flavors: {
        Row: {
          id: string;
          name: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      fillings: {
        Row: {
          id: string;
          name: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      toppings: {
        Row: {
          id: string;
          name: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          whatsapp: string;
          product_type_id: string;
          product_size_id: string;
          flavor_id: string;
          filling_id: string;
          topping_id: string;
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
        };
        Insert: {
          id?: string;
          customer_name: string;
          whatsapp: string;
          product_type_id: string;
          product_size_id: string;
          flavor_id: string;
          filling_id: string;
          topping_id: string;
          theme?: string | null;
          notes?: string | null;
          delivery_date: string;
          delivery_time: string;
          street: string;
          number: string;
          district: string;
          city: string;
          reference?: string | null;
          status?: string;
          total_price?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          whatsapp?: string;
          product_type_id?: string;
          product_size_id?: string;
          flavor_id?: string;
          filling_id?: string;
          topping_id?: string;
          theme?: string | null;
          notes?: string | null;
          delivery_date?: string;
          delivery_time?: string;
          street?: string;
          number?: string;
          district?: string;
          city?: string;
          reference?: string | null;
          status?: string;
          total_price?: number | null;
          created_at?: string;
        };
      };
    };
  };
};
