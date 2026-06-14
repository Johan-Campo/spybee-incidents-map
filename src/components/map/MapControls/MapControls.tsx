"use client";

import { Plus } from "lucide-react";
import styles from "./MapControls.module.scss";

interface MapControlsProps {
  onCreateIncident: () => void;
  view: "2D" | "3D";
  onViewChange: (view: "2D" | "3D") => void;
}

export function MapControls({ onCreateIncident, view, onViewChange }: MapControlsProps) {
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
            aria-pressed={view === "2D"}
            onClick={() => onViewChange("2D")}
          >
            2D
          </button>
          <button
            type="button"
            className={`${styles.viewButton} ${view === "3D" ? styles.viewButtonActive : ""}`}
            aria-pressed={view === "3D"}
            onClick={() => onViewChange("3D")}
          >
            3D
          </button>
        </div>
      </div>
    </>
  );
}
