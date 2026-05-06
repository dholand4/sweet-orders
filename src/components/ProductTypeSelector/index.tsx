import { ErrorText, FieldShell, Label, Select } from "./style";
import type { ProductTypeSelectorProps } from "./types";

export function ProductTypeSelector({
  options,
  value,
  onChange,
  error,
}: ProductTypeSelectorProps) {
  return (
    <FieldShell>
      <Label htmlFor="productTypeId">Tipo de bolo ou torta</Label>
      <Select
        id="productTypeId"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Select>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </FieldShell>
  );
}
