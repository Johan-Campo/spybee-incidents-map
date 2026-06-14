import { AlertTriangle, CalendarClock, Flame, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./RiskIndicators.module.scss";

interface RiskIndicatorsProps {
  overdueToday: number;
  staleCount: number;
  highPriorityOpen: number;
  upcomingDue: number;
}

interface RiskItem {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}

export function RiskIndicators({ overdueToday, staleCount, highPriorityOpen, upcomingDue }: RiskIndicatorsProps) {
  const items: RiskItem[] = [
    { icon: AlertTriangle, label: "Vencidas hoy", value: overdueToday, color: "#EF4444" },
    { icon: RefreshCw, label: "Sin actualizar hace 7 días o más", value: staleCount, color: "#D97706" },
    { icon: Flame, label: "Alta prioridad abiertas", value: highPriorityOpen, color: "#EF4444" },
    { icon: CalendarClock, label: "Próximas a vencer en 7 días", value: upcomingDue, color: "#3B82F6" },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Indicadores de riesgo</h3>
        <span className={styles.subtitle}>Lo que necesita atención hoy</span>
      </div>

      <div className={styles.row}>
        {items.map((item) => (
          <div key={item.label} className={`${styles.item} ${item.value > 0 ? styles.itemActive : ""}`}>
            <span className={styles.itemIcon} style={{ color: item.color }}>
              <item.icon size={16} />
            </span>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
