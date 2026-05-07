import styled, { css } from "styled-components";

const tones = {
  novo: css`
    background: rgba(197, 72, 125, 0.14);
    color: ${({ theme }) => theme.colors.primary};
  `,
  confirmado: css`
    background: rgba(78, 155, 105, 0.14);
    color: ${({ theme }) => theme.colors.success};
  `,
  cancelado: css`
    background: rgba(178, 67, 103, 0.14);
    color: ${({ theme }) => theme.colors.danger};
  `,
  finalizado: css`
    background: rgba(122, 21, 48, 0.1);
    color: ${({ theme }) => theme.colors.wine};
  `,
};

export const Badge = styled.span<{ $status: keyof typeof tones }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: capitalize;
  ${({ $status }) => tones[$status]}
`;
