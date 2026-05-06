import { formatCurrencyBRL } from "@/utils/format";
import { PriceCaption, PriceCard, PriceValue } from "./style";
import type { PriceDisplayProps } from "./types";

export function PriceDisplay({
  value,
  caption = "Valor base do pedido",
}: PriceDisplayProps) {
  return (
    <PriceCard>
      <PriceCaption>{caption}</PriceCaption>
      <PriceValue>{formatCurrencyBRL(value)}</PriceValue>
    </PriceCard>
  );
}
