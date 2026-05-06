import type { Database } from "@/types/database";

export type ProductTypeSelectorProps = {
  options: Database["public"]["Tables"]["product_types"]["Row"][];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};
