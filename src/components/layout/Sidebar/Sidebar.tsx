"use client";

import {
  Calendar,
  Clock,
  Folder,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  MapPin,
  Settings,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_PROJECT } from "@/lib/incidentOptions";
import styles from "./Sidebar.module.scss";

const navItems = [
  { icon: Home, label: "Inicio", href: null },
  { icon: Clock, label: "Historial", href: null },
  { icon: MapPin, label: "Mapa", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Calendario", href: null },
  { icon: ImageIcon, label: "Galería", href: null },
  { icon: Folder, label: "Documentos", href: null },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebarContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.projectHeader} title={DEFAULT_PROJECT.name}>
          <span className={styles.projectAvatarWrap}>
            <span className={styles.projectAvatar}>PO</span>
          </span>
          <div className={styles.projectInfo}>
            <span className={styles.projectName}>{DEFAULT_PROJECT.name}</span>
            <span className={styles.projectMeta}>Proyecto activo</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ icon: Icon, label, href }) => {
            if (!href) {
              return (
                <button
                  key={label}
                  type="button"
                  className={`${styles.navItem} ${styles.navItemDisabled}`}
                  disabled
                  aria-label={`${label} (próximamente)`}
                  title={`${label} (próximamente)`}
                >
                  <span className={styles.navIcon}>
                    <Icon size={20} />
                  </span>
                  <span className={styles.navLabel}>{label}</span>
                </button>
              );
            }

            const isActive = pathname === href;
            const className = `${styles.navItem} ${isActive ? styles.navItemActive : ""}`;

            return (
              <Link key={label} href={href} className={className} aria-label={label} title={label}>
                <span className={styles.navIcon}>
                  <Icon size={20} />
                </span>
                <span className={styles.navLabel}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.divider} />
          <button type="button" className={`${styles.navItem} ${styles.navItemMuted}`} aria-label="Configuración" title="Configuración">
            <span className={styles.navIcon}>
              <Settings size={20} />
            </span>
            <span className={styles.navLabel}>Configuración</span>
          </button>
          <button type="button" className={`${styles.navItem} ${styles.navItemMuted}`} aria-label="Compartir" title="Compartir">
            <span className={styles.navIcon}>
              <Share2 size={20} />
            </span>
            <span className={styles.navLabel}>Compartir</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
