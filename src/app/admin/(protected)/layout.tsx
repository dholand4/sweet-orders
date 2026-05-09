import type { ReactNode } from "react";
import { requireAdminAuth } from "@/lib/auth";
import { AdminLayout } from "@/components/AdminLayout";

type ProtectedAdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  await requireAdminAuth();

  return <AdminLayout>{children}</AdminLayout>;
}
