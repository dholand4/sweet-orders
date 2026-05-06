import type { Database } from "@/types/database";

export type SizeSelectorProps = {
  options: Database["public"]["Tables"]["product_sizes"]["Row"][];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};
