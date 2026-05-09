"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";

const grow = keyframes`
  from { width: 0%; opacity: 1; }
  to   { width: 85%; opacity: 1; }
`;

const finish = keyframes`
  from { width: 85%; opacity: 1; }
  to   { width: 100%; opacity: 0; }
`;

const Bar = styled.div<{ $phase: "grow" | "finish" | "idle" }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  z-index: 9999;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primaryHover}
  );
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};

  animation: ${({ $phase }) =>
    $phase === "grow"
      ? grow
      : $phase === "finish"
      ? finish
      : "none"}
    ${({ $phase }) => ($phase === "grow" ? "4s" : "0.3s")} ease forwards;

  display: ${({ $phase }) => ($phase === "idle" ? "none" : "block")};
`;

export function AdminProgressBar() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"grow" | "finish" | "idle">("idle");
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    setPhase("grow");

    const done = setTimeout(() => {
      setPhase("finish");
    }, 300);

    const reset = setTimeout(() => {
      setPhase("idle");
    }, 650);

    return () => {
      clearTimeout(done);
      clearTimeout(reset);
    };
  }, [pathname]);

  return <Bar $phase={phase} />;
}
