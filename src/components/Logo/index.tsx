import logoImage from "@/assets/logotipo.png";
import { LogoImage, LogoWrap } from "./style";
import type { LogoProps } from "./types";

export function Logo({ size = 84, priority = false }: LogoProps) {
  return (
    <LogoWrap $size={size}>
      <LogoImage
        src={logoImage}
        alt="Dany Ruivo - Bolos e Tortas"
        fill
        priority={priority}
        sizes={`${size}px`}
      />
    </LogoWrap>
  );
}
