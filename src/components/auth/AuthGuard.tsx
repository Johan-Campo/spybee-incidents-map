"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth: boolean;
}

function useHydrated() {
  return useSyncExternalStore(
    (callback) => useAuthStore.persist?.onFinishHydration(callback) ?? (() => {}),
    () => useAuthStore.persist?.hasHydrated() ?? false,
    () => false
  );
}

export function AuthGuard({ children, requireAuth }: AuthGuardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (requireAuth && !user) router.replace("/login");
    if (!requireAuth && user) router.replace("/");
  }, [hydrated, user, requireAuth, router]);

  if (!hydrated) return null;
  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return <>{children}</>;
}
