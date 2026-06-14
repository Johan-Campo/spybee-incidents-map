"use client";

import { Calendar, ChevronDown, Plus } from "lucide-react";
import { PERIOD_OPTIONS } from "@/lib/dashboardMetrics";
import { DEFAULT_PROJECT } from "@/lib/incidentOptions";
import styles from "./DashboardToolbar.module.scss";

interface DashboardToolbarProps {
  period: string;
  onPeriodChange: (value: string) => void;
  onCreateIncident: () => void;
}

export function DashboardToolbar({ period, onPeriodChange, onCreateIncident }: DashboardToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.titleGroup}>
        <span className={styles.breadcrumb}>
          Mis Proyectos / {DEFAULT_PROJECT.name}
        </span>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <div className={styles.actions}>
        <div className={styles.selectWrapper}>
          <Calendar size={14} className={styles.selectCalendarIcon} />
          <select
            className={styles.periodSelect}
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
            aria-label="Periodo del dashboard"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className={styles.selectIcon} />
        </div>

        <button type="button" className={styles.createButton} onClick={onCreateIncident}>
          <Plus size={16} />
          Crear incidencia
        </button>
      </div>
    </div>
  );
}
