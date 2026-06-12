import { CalendarDays, LayoutPanelLeft } from "lucide-react";
import styles from "./MapTopBar.module.scss";

export function MapTopBar() {
  return (
    <div className={styles.bar}>
      <button type="button" className={styles.detailsButton}>
        <LayoutPanelLeft size={14} />
        Ver detalles
      </button>

      <div className={styles.divider} />

      <div className={styles.date}>
        <CalendarDays size={14} />
        02 jun 2026
      </div>

      <div className={styles.visits}>
        Últimas 5 visitas
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.track} />
          <span className={styles.dot} />
          <span className={styles.track} />
          <span className={styles.dot} />
          <span className={styles.track} />
          <span className={styles.dot} />
          <span className={styles.track} />
          <span className={styles.dot} />
        </div>
      </div>

      <button type="button" className={`${styles.compareButton} ${styles.compareActive}`}>
        Comparar
      </button>
      <button type="button" className={`${styles.compareButton} ${styles.compareInactive}`}>
        Comparar BIM
      </button>
    </div>
  );
}
