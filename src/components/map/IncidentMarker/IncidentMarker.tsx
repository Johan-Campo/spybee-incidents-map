"use client";

import { AlertTriangle } from "lucide-react";
import { Marker } from "react-map-gl/mapbox";
import { CATEGORY_OPTIONS } from "@/lib/incidentOptions";
import type { Incident } from "@/types/incident";
import styles from "./IncidentMarker.module.scss";

interface IncidentMarkerProps {
  incident: Incident;
  onClick: () => void;
  isNew?: boolean;
}

export function IncidentMarker({ incident, onClick, isNew }: IncidentMarkerProps) {
  const color = CATEGORY_OPTIONS.find((option) => option.id === incident.type.id)?.color ?? "#6B7280";

  return (
    <Marker longitude={incident.coordinates.lng} latitude={incident.coordinates.lat} anchor="bottom">
      <div className={styles.markerWrapper}>
        {isNew && (
          <>
            <span className={styles.pulseRing} />
            <span className={styles.pulseRing} />
            <span className={styles.pulseRing} />
          </>
        )}
        <button
          type="button"
          className={styles.pin}
          style={{ backgroundColor: color }}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          aria-label={`${incident.type.name}: ${incident.title}`}
        >
          <AlertTriangle size={12} />
        </button>
      </div>
    </Marker>
  );
}
