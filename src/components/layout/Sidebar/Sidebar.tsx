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
import styles from "./Sidebar.module.scss";

const navItems = [
  { icon: Home, label: "Inicio" },
  { icon: Clock, label: "Historial" },
  { icon: MapPin, label: "Mapa", active: true },
  { icon: Info, label: "Información" },
  { icon: Calendar, label: "Calendario" },
  { icon: ImageIcon, label: "Galería" },
  { icon: Folder, label: "Documentos" },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <span className={styles.projectAvatar}>PO</span>

      <nav className={styles.nav}>
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
            aria-label={label}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
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
