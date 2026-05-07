"use client";

import { AdminLogin } from "@/components/AdminLogin";
import { PageContainer, PageShell } from "./style";

export function AdminLoginView() {
  return (
    <PageShell>
      <PageContainer>
        <AdminLogin />
      </PageContainer>
    </PageShell>
  );
}
