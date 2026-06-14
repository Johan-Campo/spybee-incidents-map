"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActivityCalendar } from "@/lib/dashboardMetrics";
import type { Incident } from "@/types/incident";
import styles from "./ActivityCalendar.module.scss";

interface ActivityCalendarProps {
  incidents: Incident[];
}

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function intensityLevel(count: number, maxCount: number): number {
  if (count === 0 || maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function ActivityCalendar({ incidents }: ActivityCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = useMemo(() => getActivityCalendar(incidents, year, month), [incidents, year, month]);
  const maxCount = Math.max(...days.map((day) => day.count), 1);
  const leadingOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const monthLabel = capitalize(new Date(year, month, 1).toLocaleDateString("es-CO", { month: "long", year: "numeric" }));

  function goToPreviousMonth() {
    if (month === 0) {
      setYear((value) => value - 1);
      setMonth(11);
    } else {
      setMonth((value) => value - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((value) => value + 1);
      setMonth(0);
    } else {
      setMonth((value) => value + 1);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Calendario de actividad</h3>
          <p className={styles.subtitle}>Cantidad de incidencias reportadas por día. Los tonos más cálidos indican días con mayor actividad.</p>
        </div>
        <div className={styles.nav}>
          <button type="button" className={styles.navButton} onClick={goToPreviousMonth} aria-label="Mes anterior">
            <ChevronLeft size={14} />
          </button>
          <span className={styles.monthLabel}>{monthLabel}</span>
          <button type="button" className={styles.navButton} onClick={goToNextMonth} aria-label="Mes siguiente">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className={styles.weekday}>
            {label}
          </span>
        ))}

        {Array.from({ length: leadingOffset }).map((_, index) => (
          <span key={`empty-${index}`} className={styles.empty} />
        ))}

        {days.map(({ day, count }) => {
          const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
          const dateLabel = capitalize(new Date(year, month, day).toLocaleDateString("es-CO", { day: "numeric", month: "long" }));

          return (
            <div
              key={day}
              className={`${styles.day} ${styles[`level${intensityLevel(count, maxCount)}`]} ${isToday ? styles.today : ""}`}
            >
              <span className={styles.dayNumber}>{day}</span>
              {count > 0 && <span className={styles.dayCount}>{count}</span>}
              <span className={styles.tooltip}>
                {dateLabel} · {count} incidencia{count === 1 ? "" : "s"} creada{count === 1 ? "" : "s"}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Menos</span>
        <span className={`${styles.legendSwatch} ${styles.level0}`} />
        <span className={`${styles.legendSwatch} ${styles.level1}`} />
        <span className={`${styles.legendSwatch} ${styles.level2}`} />
        <span className={`${styles.legendSwatch} ${styles.level3}`} />
        <span className={`${styles.legendSwatch} ${styles.level4}`} />
        <span className={styles.legendLabel}>Más</span>
      </div>
    </div>
  );
}
