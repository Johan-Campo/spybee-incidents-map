"use client";

import { ChevronDown, HelpCircle, LogOut, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "./Header.module.scss";

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/brand/logo2.avif" alt="" className={styles.logoIcon} />
        <span>Spybee</span>
      </div>

      <span className={styles.projectName}>Proyecto Onboarding</span>

      <div className={styles.actions}>
        <span className={styles.deviceBadge}>
          <Smartphone size={16} />
        </span>

        {user && (
          <div className={styles.user}>
            <img className={styles.avatar} src={user.avatarUrl} alt={user.name} />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name.split(" ")[0]}</span>
              <span className={styles.userRole}>Superadmin</span>
            </div>
            <ChevronDown size={16} />
          </div>
        )}

        <button type="button" className={styles.helpButton} aria-label="Ayuda">
          <HelpCircle size={16} />
        </button>

        <button type="button" className={styles.helpButton} aria-label="Cerrar sesión" title="Cerrar sesión" onClick={handleLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
