import { formatCurrencyBRL } from "@/utils/format";
import { SizeErrorText, SizeFieldShell, SizeLabel, SizeSelect } from "./style";
import type { SizeSelectorProps } from "./types";

export function SizeSelector({
  options,
  value,
  onChange,
  error,
}: SizeSelectorProps) {
  return (
    <SizeFieldShell>
      <SizeLabel htmlFor="productSizeId">Tamanho e preço</SizeLabel>
      <SizeSelect
        id="productSizeId"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {`${option.name}${option.servings ? ` • ${option.servings}` : ""} • ${formatCurrencyBRL(option.price)}`}
          </option>
        ))}
      </SizeSelect>
      {error ? <SizeErrorText>{error}</SizeErrorText> : null}
    </SizeFieldShell>
  );
}
