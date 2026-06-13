"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle, LogOut, Settings, Smartphone, User as UserIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "./Header.module.scss";

const PAGE_TITLES: Record<string, string> = {
  "/": "Mapa de incidencias",
  "/dashboard": "Dashboard",
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageTitle = PAGE_TITLES[pathname] ?? PAGE_TITLES["/"];

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

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

      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbProject}>Proyecto Onboarding</span>
        <ChevronRight size={14} className={styles.breadcrumbSeparator} />
        <span className={styles.breadcrumbPage}>{pageTitle}</span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.deviceBadge} disabled title="Vista móvil (próximamente)" aria-label="Vista móvil (próximamente)">
          <Smartphone size={16} />
        </button>

        {user && (
          <div className={styles.user} ref={menuRef}>
            <button
              type="button"
              className={styles.userTrigger}
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
            >
              <img className={styles.avatar} src={user.avatarUrl} alt={user.name} />
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name.split(" ")[0]}</span>
                <span className={styles.userRole}>Superadmin</span>
              </div>
              <ChevronDown size={16} className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ""}`} />
            </button>

            {isMenuOpen && (
              <div className={styles.userMenu}>
                <div className={styles.userMenuHeader}>
                  <span className={styles.userMenuName}>{user.name}</span>
                  <span className={styles.userMenuEmail}>{user.email}</span>
                </div>
                <button type="button" className={styles.userMenuItem} disabled title="Próximamente">
                  <UserIcon size={16} />
                  Perfil
                </button>
                <button type="button" className={styles.userMenuItem} disabled title="Próximamente">
                  <Settings size={16} />
                  Configuración
                </button>
                <div className={styles.userMenuDivider} />
                <button type="button" className={`${styles.userMenuItem} ${styles.userMenuLogout}`} onClick={handleLogout}>
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}

        <button type="button" className={styles.helpButton} aria-label="Ayuda" title="Ayuda">
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
}
