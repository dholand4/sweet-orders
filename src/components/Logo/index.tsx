import { LogoImage, LogoWrap } from "./style";
import type { LogoProps } from "./types";

export function Logo({ size = 84, priority = false }: LogoProps) {
  return (
    <LogoWrap $size={size}>
      <LogoImage
        src="/logo.png"
        alt="Dany Ruivo - Bolos e Tortas"
        fill
        priority={priority}
        sizes={`${size}px`}
      />
    </LogoWrap>
  );
}
