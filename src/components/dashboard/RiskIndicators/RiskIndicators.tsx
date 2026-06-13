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
    { icon: RefreshCw, label: "Sin actualizar 7d+ (actual)", value: staleCount, color: "#F59E0B" },
    { icon: Flame, label: "Alta prioridad abiertas", value: highPriorityOpen, color: "#EF4444" },
    { icon: CalendarClock, label: "Próximas a vencer (7d)", value: upcomingDue, color: "#3B82F6" },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Indicadores de riesgo</h3>
        <span className={styles.subtitle}>Click en cada chip para ver el detalle</span>
      </div>

      <div className={styles.row}>
        {items.map((item) => (
          <button key={item.label} type="button" className={styles.item}>
            <span className={styles.itemIcon} style={{ color: item.color }}>
              <item.icon size={16} />
            </span>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemValue}>{item.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
