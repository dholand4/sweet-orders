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
  --gold-soft: #ecd3a1;
  --shadow-soft: 0 12px 30px -12px rgba(141, 41, 64, 0.24);
  --shadow-card: 0 24px 56px -30px rgba(141, 41, 64, 0.28);
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
    radial-gradient(circle at top center, rgba(255, 255, 255, 0.28), transparent 30%),
    linear-gradient(135deg, #f7ccd8 0%, #e796ad 48%, #8d2940 100%);
  color: #fff;
`;

export const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background: radial-gradient(circle at 20% 20%, #fff, transparent 50%);
`;

export const HeroContainer = styled(Container)`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding-top: 56px;
  padding-bottom: 112px;
  padding-inline: clamp(20px, 3vw, 40px);
  text-align: center;

  ${media.md} {
    padding-bottom: 144px;
  }
`;

export const HeroTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  justify-self: center;
  margin-inline: auto;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const AdminLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.24);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.9);
    outline-offset: 3px;
  }
`;

export const HeroContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const HeroLogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
`;

export const HeroLogoFrame = styled.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(255, 248, 250, 0.92), rgba(249, 223, 230, 0.82));
  box-shadow:
    0 18px 40px -24px rgba(110, 36, 57, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(6px);
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-family: var(--font-heading), serif;
  font-size: clamp(2.75rem, 4vw + 1.75rem, 4.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.05;
  text-shadow: 0 10px 24px rgba(110, 36, 57, 0.16);
`;

export const HeroSubtitle = styled.p`
  max-width: 640px;
  margin: 0 auto;
  opacity: 0.92;
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

export const ContentWrap = styled(Container)`
  position: relative;
  z-index: 1;
  margin-top: -96px;
  width: 100%;

  ${media.md} {
    margin-top: -112px;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  padding: 48px 16px 40px;
  text-align: center;
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;
