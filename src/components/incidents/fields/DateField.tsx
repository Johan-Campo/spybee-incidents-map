"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { FormField } from "./FormField";
import { formatLocalDate, parseLocalDate } from "@/lib/date";
import styles from "./fields.module.scss";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
}

function buildCalendarDays(year: number, month: number): Date[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDayOfMonth.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function DateField({ id, label, value, onChange, required, invalid }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const referenceDate = value ? parseLocalDate(value) : today;
  const [viewYear, setViewYear] = useState(referenceDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(referenceDate.getMonth());

  const days = buildCalendarDays(viewYear, viewMonth);

  function changeMonth(offset: number) {
    const date = new Date(viewYear, viewMonth + offset, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }

  function handleSelectDay(date: Date) {
    onChange(formatLocalDate(date));
    setOpen(false);
  }

  function handleToday() {
    onChange(formatLocalDate(today));
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setOpen(false);
  }

  return (
    <FormField label={label} htmlFor={id} required={required}>
      <div
        className={styles.comboboxWrapper}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <button
          type="button"
          id={id}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={invalid}
          className={`${styles.dateInput} ${invalid ? styles.dateInputInvalid : ""}`}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          <span className={value ? "" : styles.placeholder}>{value || "Seleccionar fecha"}</span>
          <Calendar size={16} />
        </button>

        {open && (
          <div className={styles.calendarPanel} role="dialog" aria-label="Seleccionar fecha">
            <div className={styles.calendarHeader}>
              <button type="button" onClick={() => setViewYear((year) => year - 1)} aria-label="Año anterior">
                <ChevronsLeft size={14} />
              </button>
              <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
                <ChevronLeft size={14} />
              </button>
              <span className={styles.calendarTitle}>
                {MONTH_LABELS[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
                <ChevronRight size={14} />
              </button>
              <button type="button" onClick={() => setViewYear((year) => year + 1)} aria-label="Año siguiente">
                <ChevronsRight size={14} />
              </button>
              <button type="button" className={styles.panelCloseButton} onClick={() => setOpen(false)} aria-label="Cerrar">
                <X size={14} />
              </button>
            </div>

            <div className={styles.calendarWeekdays} role="row">
              {WEEKDAY_LABELS.map((weekday) => (
                <span key={weekday} role="columnheader" aria-label={weekday}>
                  {weekday}
                </span>
              ))}
            </div>

            <div className={styles.calendarGrid} role="grid" aria-label={`${MONTH_LABELS[viewMonth]} ${viewYear}`}>
              {days.map((date) => {
                const isCurrentMonth = date.getMonth() === viewMonth;
                const isSelected = value === formatLocalDate(date);
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={`${date.getDate()} de ${MONTH_LABELS[date.getMonth()]} de ${date.getFullYear()}`}
                    className={`${styles.calendarDay} ${isCurrentMonth ? "" : styles.calendarDayMuted} ${isSelected ? styles.calendarDaySelected : ""}`}
                    onClick={() => handleSelectDay(date)}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <button type="button" className={styles.calendarToday} onClick={handleToday}>
              Hoy
            </button>
          </div>
        )}
      </div>
    </FormField>
  );
}
