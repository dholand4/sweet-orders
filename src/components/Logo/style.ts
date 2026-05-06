import Image from "next/image";
import styled from "styled-components";

export const LogoWrap = styled.div<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  background: ${({ theme }) => theme.colors.surface};
`;

export const LogoImage = styled(Image)`
  object-fit: cover;
`;
