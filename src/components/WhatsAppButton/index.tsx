import { WhatsAppLink } from "./style";
import type { WhatsAppButtonProps } from "./types";

export function WhatsAppButton({
  href,
  label,
  variant = "primary",
}: WhatsAppButtonProps) {
  return (
    <WhatsAppLink href={href} target="_blank" rel="noreferrer" $variant={variant}>
      {label}
    </WhatsAppLink>
  );
}
