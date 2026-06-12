"use client";

import { useState } from "react";
import { Clock, Plus } from "lucide-react";
import styles from "./MapControls.module.scss";

export function MapControls({ onCreateIncident }: { onCreateIncident: () => void }) {
  const [view, setView] = useState<"2D" | "3D">("2D");

  return (
    <>
      <button type="button" className={styles.createButton} onClick={onCreateIncident} aria-label="Crear incidencia">
        <Plus size={20} />
      </button>

      <div className={styles.bottomBar}>
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={`${styles.viewButton} ${view === "2D" ? styles.viewButtonActive : ""}`}
            onClick={() => setView("2D")}
          >
            2D
          </button>
          <button
            type="button"
            className={`${styles.viewButton} ${view === "3D" ? styles.viewButtonActive : ""}`}
            onClick={() => setView("3D")}
          >
            3D
          </button>
        </div>

        <button type="button" className={styles.iconButton} aria-label="Línea de tiempo">
          <Clock size={16} />
        </button>

        <div className={styles.toggle360}>
          360°
          <span className={styles.switch} />
        </div>
      </div>
    </>
  );
}
