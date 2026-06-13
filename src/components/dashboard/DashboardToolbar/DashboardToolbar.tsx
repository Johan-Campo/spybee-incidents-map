"use client";

import { ChevronDown, Download, FileBarChart, Plus, SlidersHorizontal } from "lucide-react";
import { formatPeriodRangeLabel, PERIOD_OPTIONS } from "@/lib/dashboardMetrics";
import { DEFAULT_PROJECT } from "@/lib/incidentOptions";
import styles from "./DashboardToolbar.module.scss";

interface DashboardToolbarProps {
  period: string;
  onPeriodChange: (value: string) => void;
  onCreateIncident: () => void;
}

export function DashboardToolbar({ period, onPeriodChange, onCreateIncident }: DashboardToolbarProps) {
  const periodOption = PERIOD_OPTIONS.find((option) => option.value === period) ?? PERIOD_OPTIONS[2];
  const rangeLabel = formatPeriodRangeLabel(periodOption.days);

  return (
    <div className={styles.toolbar}>
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <span className={styles.breadcrumb}>
            Mis Proyectos / {DEFAULT_PROJECT.name} / Incidencias
          </span>
          <h1 className={styles.title}>Incidencias</h1>
        </div>

        <div className={styles.actions}>
          <div className={styles.selectWrapper}>
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

          <button type="button" className={styles.iconButton} title="Filtros del dashboard" aria-label="Filtros del dashboard">
            <SlidersHorizontal size={16} />
          </button>

          <button type="button" className={styles.iconButton} title="Informes" aria-label="Informes">
            <FileBarChart size={16} />
          </button>

          <button type="button" className={styles.createButton} onClick={onCreateIncident}>
            <Plus size={16} />
            Crear incidencia
          </button>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <button type="button" className={styles.pdfButton} title="Descargar PDF" aria-label="Descargar PDF">
          <Download size={14} />
          Descargar PDF
        </button>
        <span className={styles.summaryText}>
          Resumen general (<strong>{rangeLabel}</strong>)
        </span>
        <span className={styles.summaryMuted}>Indicadores clave del periodo</span>
      </div>
    </div>
  );
}
