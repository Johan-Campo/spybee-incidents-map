import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell/AppShell";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
