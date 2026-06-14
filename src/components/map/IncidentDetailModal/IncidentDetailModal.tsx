"use client";

import { Calendar, FileVideo, ImageIcon, MapPin, X } from "lucide-react";
import Image from "next/image";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/lib/incidentOptions";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { Incident, IncidentStatus } from "@/types/incident";
import styles from "./IncidentDetailModal.module.scss";

interface IncidentDetailModalProps {
  incident: Incident;
  onClose: () => void;
}

const STATUS_LABELS: Record<IncidentStatus, string> = {
  open: "Abierta",
  on_pause: "En pausa",
  closed: "Cerrada",
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" });

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function IncidentDetailModal({ incident, onClose }: IncidentDetailModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  const category = CATEGORY_OPTIONS.find((option) => option.id === incident.type.id);
  const priority = PRIORITY_OPTIONS.find((option) => option.value === incident.priority);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-detail-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <header className={styles.header}>
          <div>
            <span className={styles.sequence}>#{incident.sequenceId}</span>
            <h2 id="incident-detail-title" className={styles.title}>
              {incident.title}
            </h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <div className={styles.body}>
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

          <p className={styles.description}>{incident.description}</p>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ubicación</h3>
            {incident.locationDescription && <p className={styles.sectionText}>{incident.locationDescription}</p>}
            <p className={styles.sectionMuted}>
              <MapPin size={14} />
              {incident.coordinates.lat.toFixed(5)}, {incident.coordinates.lng.toFixed(5)}
            </p>
          </div>

          {incident.dueDate && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Fecha de vencimiento</h3>
              <p className={styles.sectionText}>
                <Calendar size={14} />
                {dateFormatter.format(new Date(incident.dueDate))}
              </p>
            </div>
          )}

          {incident.tags.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Etiquetas</h3>
              <div className={styles.badges}>
                {incident.tags.map((tag) => (
                  <span key={tag.id} className={styles.badge}>
                    <span className={styles.dot} style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(incident.assignees.length > 0 || incident.observers.length > 0) && (
            <div className={styles.peopleGrid}>
              {incident.assignees.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Asignados</h3>
                  <ul className={styles.peopleList}>
                    {incident.assignees.map((person) => (
                      <li key={person.id} className={styles.person}>
                        <Image src={person.avatarUrl} alt="" width={24} height={24} className={styles.avatar} />
                        {person.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {incident.observers.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Observadores</h3>
                  <ul className={styles.peopleList}>
                    {incident.observers.map((person) => (
                      <li key={person.id} className={styles.person}>
                        <Image src={person.avatarUrl} alt="" width={24} height={24} className={styles.avatar} />
                        {person.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {incident.media.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Adjuntos</h3>
              <ul className={styles.mediaList}>
                {incident.media.map((media) => (
                  <li key={media.id} className={styles.mediaItem}>
                    {media.type === "image" ? <ImageIcon size={14} /> : <FileVideo size={14} />}
                    <span className={styles.mediaName}>{media.name}</span>
                    <span className={styles.mediaSize}>{formatFileSize(media.size)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
