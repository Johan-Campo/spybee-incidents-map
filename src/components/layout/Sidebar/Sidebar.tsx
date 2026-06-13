"use client";

import {
  Calendar,
  Clock,
  Folder,
  Home,
  Image as ImageIcon,
  Info,
  MapPin,
  Settings,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";

const navItems = [
  { icon: Home, label: "Inicio", href: null },
  { icon: Clock, label: "Historial", href: null },
  { icon: MapPin, label: "Mapa", href: "/" },
  { icon: Info, label: "Información", href: "/dashboard" },
  { icon: Calendar, label: "Calendario", href: null },
  { icon: ImageIcon, label: "Galería", href: null },
  { icon: Folder, label: "Documentos", href: null },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <span className={styles.projectAvatar}>PO</span>

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
                <Icon size={20} />
              </button>
            );
          }

          const isActive = pathname === href;
          const className = `${styles.navItem} ${isActive ? styles.navItemActive : ""}`;

          return (
            <Link key={label} href={href} className={className} aria-label={label} title={label}>
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.divider} />
        <button type="button" className={styles.navItem} aria-label="Configuración" title="Configuración">
          <Settings size={20} />
        </button>
        <button type="button" className={styles.navItem} aria-label="Compartir" title="Compartir">
          <Share2 size={20} />
        </button>
      </div>
    </aside>
  );
}
