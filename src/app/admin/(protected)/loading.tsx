import styled, { keyframes } from "styled-components";
import Image from "next/image";
import logoImg from "@/assets/logotipo.png";

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

// ─── Shell ────────────────────────────────────────────────────
const Shell = styled.div`
  display: flex;
  min-height: 100dvh;
  background: #fdf1f4;
`;

// ─── Sidebar skeleton ─────────────────────────────────────────
const Sidebar = styled.aside`
  display: none;
  flex-direction: column;
  width: 256px;
  background: #fff;
  border-right: 1px solid #f3d6e0;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 28px 20px 20px;
  border-bottom: 1px solid #f3d6e0;
`;

const BrandImgWrap = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  opacity: 0.5;
  animation: ${pulse} 1.5s ease infinite;
`;

const BrandTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NavArea = styled.div`
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

// ─── Shimmer block ────────────────────────────────────────────
const Shimmer = styled.div<{ $w?: string; $h?: string; $radius?: string }>`
  width: ${({ $w }) => $w ?? "100%"};
  height: ${({ $h }) => $h ?? "16px"};
  border-radius: ${({ $radius }) => $radius ?? "8px"};
  background: linear-gradient(
    90deg,
    #f3d6e0 25%,
    #fce8ef 50%,
    #f3d6e0 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.6s infinite linear;
`;

// ─── Main area ────────────────────────────────────────────────
const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100dvh;
  background: #fdf1f4;
`;

const Topbar = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: 60px;
  background: rgba(253, 241, 244, 0.92);
  border-bottom: 1px solid #f3d6e0;

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

const Row = styled.div<{ $gap?: string }>`
  display: flex;
  align-items: center;
  gap: ${({ $gap }) => $gap ?? "12px"};
`;

const CardGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CardSkeleton = styled.div`
  background: #fff;
  border: 1px solid #f3d6e0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NAV_ITEMS = 6;

export default function Loading() {
  return (
    <Shell>
      {/* Sidebar */}
      <Sidebar>
        <SidebarBrand>
          <BrandImgWrap>
            <Image src={logoImg} alt="" fill style={{ objectFit: "contain" }} sizes="44px" />
          </BrandImgWrap>
          <BrandTextWrap>
            <Shimmer $w="100px" $h="14px" />
            <Shimmer $w="72px" $h="11px" />
          </BrandTextWrap>
        </SidebarBrand>

        <NavArea>
          <Shimmer $w="60px" $h="10px" $radius="4px" />
          {Array.from({ length: NAV_ITEMS }).map((_, i) => (
            <Shimmer key={i} $h="36px" $radius="8px" />
          ))}
        </NavArea>
      </Sidebar>

      {/* Main */}
      <Main>
        <Topbar>
          <Shimmer $w="36px" $h="36px" $radius="8px" />
          <Shimmer $w="160px" $h="22px" $radius="8px" />
          <div style={{ marginLeft: "auto" }}>
            <Shimmer $w="80px" $h="30px" $radius="999px" />
          </div>
        </Topbar>

        <Content>
          {/* Header row */}
          <Row>
            <Shimmer $w="200px" $h="28px" $radius="8px" />
            <div style={{ marginLeft: "auto" }}>
              <Shimmer $w="120px" $h="38px" $radius="999px" />
            </div>
          </Row>

          {/* Cards */}
          <CardGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i}>
                <Row>
                  <Shimmer $w="60%" $h="16px" />
                  <Shimmer $w="60px" $h="20px" $radius="999px" />
                </Row>
                <Shimmer $h="12px" $w="90%" />
                <Shimmer $h="12px" $w="70%" />
                <Row $gap="8px">
                  <Shimmer $h="32px" />
                  <Shimmer $h="32px" />
                </Row>
              </CardSkeleton>
            ))}
          </CardGrid>
        </Content>
      </Main>
    </Shell>
  );
}
