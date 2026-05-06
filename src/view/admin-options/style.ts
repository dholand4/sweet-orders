import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Heading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;
