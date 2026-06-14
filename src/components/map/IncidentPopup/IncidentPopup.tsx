"use client";

import { X } from "lucide-react";
import { Popup } from "react-map-gl/mapbox";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/lib/incidentOptions";
import type { Incident, IncidentStatus } from "@/types/incident";
import styles from "./IncidentPopup.module.scss";

interface IncidentPopupProps {
  incident: Incident;
  onClose: () => void;
  onViewDetail: () => void;
}

const STATUS_LABELS: Record<IncidentStatus, string> = {
  open: "Abierta",
  on_pause: "En pausa",
  closed: "Cerrada",
};

export function IncidentPopup({ incident, onClose, onViewDetail }: IncidentPopupProps) {
  const category = CATEGORY_OPTIONS.find((option) => option.id === incident.type.id);
  const priority = PRIORITY_OPTIONS.find((option) => option.value === incident.priority);

  return (
    <Popup
      longitude={incident.coordinates.lng}
      latitude={incident.coordinates.lat}
      anchor="bottom"
      offset={20}
      closeButton={false}
      closeOnClick={false}
      onClose={onClose}
      className={styles.popup}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.sequence}>#{incident.sequenceId}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <X size={14} />
          </button>
        </div>

        <h3 className={styles.title}>{incident.title}</h3>
        <p className={styles.description}>{incident.description}</p>

        <div className={styles.badges}>
          {category && (
            <span className={styles.badge}>
              <span className={styles.dot} style={{ backgroundColor: category.color }} />
              {category.name}
            </span>
          )}
          {priority && (
            <span className={styles.badge}>
              <span className={styles.dot} style={{ backgroundColor: priority.color }} />
              {priority.label}
            </span>
          )}
          <span className={styles.badge}>{STATUS_LABELS[incident.status]}</span>
        </div>

        {incident.locationDescription && <p className={styles.location}>{incident.locationDescription}</p>}

        <button type="button" className={styles.detailButton} onClick={onViewDetail}>
          Ver detalle completo
        </button>
      </div>
    </Popup>
  );
}
