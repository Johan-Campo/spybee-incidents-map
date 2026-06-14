import { CalendarDays, MapPin } from "lucide-react";
import styles from "./MapTopBar.module.scss";

interface MapTopBarProps {
  incidentCount: number;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" });

export function MapTopBar({ incidentCount }: MapTopBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.date}>
        <CalendarDays size={14} />
        {dateFormatter.format(new Date())}
      </div>

      <div className={styles.divider} />

      <div className={styles.summary}>
        <MapPin size={14} />
        {incidentCount} {incidentCount === 1 ? "incidencia activa" : "incidencias activas"} en el mapa
      </div>
    </div>
  );
}
