import type { ReactNode } from "react";
import { requireAdminAuth } from "@/lib/auth";

type ProtectedAdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  await requireAdminAuth();

  return children;
}
