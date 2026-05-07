import styled from "styled-components";
import { media } from "@/utils/media";

export const LoginCard = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  width: min(100%, 32rem);
  padding: ${({ theme }) => theme.space[4]};
  border-radius: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 241, 244, 0.86));
  box-shadow: 0 24px 56px -34px rgba(110, 36, 57, 0.24);

  ${media.md} {
    padding: ${({ theme }) => theme.space[5]};
  }
`;

export const LoginHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  justify-items: center;
  text-align: center;
`;

export const LoginTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const LoginText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const LoginForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const LoginField = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const LoginLabel = styled.label`
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const LoginInput = styled.input`
  min-height: 46px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

export const LoginHelper = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const LoginButton = styled.button`
  min-height: 46px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const LoginError = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  border-radius: 18px;
  border: 1px solid rgba(178, 77, 105, 0.24);
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
