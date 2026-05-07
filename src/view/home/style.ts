import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/Container/style";
import { media } from "@/utils/media";

export const PageShell = styled.main`
  --rose-1: #fff7f8;
  --rose-2: #fee8ee;
  --rose-3: #f8c8d5;
  --rose-4: #ec9fb5;
  --rose-5: #d96f91;
  --rose-6: #8d2940;
  --ink: #6e2439;
  --muted: #9a6a79;
  --line: #f0c9d5;
  --cream: #fff8fa;
  --shadow-soft: 0 8px 24px -8px rgba(141, 41, 64, 0.18);
  --shadow-card: 0 16px 40px -20px rgba(141, 41, 64, 0.22);
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: var(--cream);
  color: var(--ink);
`;

export const Hero = styled.header`
  position: relative;
  overflow: hidden;
  width: 100%;
  background:
    radial-gradient(ellipse at top center, rgba(255,255,255,0.22) 0%, transparent 55%),
    linear-gradient(150deg, #f2bfce 0%, #e08aa5 40%, #92324f 100%);
  color: #fff;
`;

export const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background: radial-gradient(circle at 15% 15%, #fff, transparent 50%);
  pointer-events: none;
`;

export const HeroContainer = styled(Container)`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding-top: 36px;
  padding-bottom: 80px;
  padding-inline: clamp(20px, 3vw, 40px);
  text-align: center;

  ${media.md} {
    padding-bottom: 100px;
  }
`;

export const HeroTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;

export const AdminLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.02em;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.22);
  }
`;

export const HeroContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const HeroLogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
`;

export const HeroLogoFrame = styled.div`
  display: grid;
  place-items: center;
  padding: 10px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 248, 250, 0.90), rgba(249, 220, 228, 0.78));
  box-shadow:
    0 12px 28px -16px rgba(110, 36, 57, 0.30),
    inset 0 1px 0 rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(6px);
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-family: var(--font-heading), serif;
  font-size: clamp(2rem, 3vw + 1rem, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-shadow: 0 6px 16px rgba(110, 36, 57, 0.18);
`;

export const HeroSubtitle = styled.p`
  max-width: 520px;
  margin: 0 auto;
  opacity: 0.88;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

export const ContentWrap = styled(Container)`
  position: relative;
  z-index: 1;
  margin-top: -64px;
  width: 100%;

  ${media.md} {
    margin-top: -76px;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  padding: 40px 16px 32px;
  text-align: center;
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  letter-spacing: 0.01em;
`;
