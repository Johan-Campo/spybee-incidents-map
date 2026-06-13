import type { MonthlyTrendPoint } from "@/lib/dashboardMetrics";
import styles from "./TrendChart.module.scss";

interface TrendChartProps {
  title: string;
  points: MonthlyTrendPoint[];
}

export function TrendChart({ title, points }: TrendChartProps) {
  const maxValue = Math.max(...points.flatMap((point) => [point.created, point.closed]), 1);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.dot} style={{ backgroundColor: "#3B82F6" }} />
            Creadas
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dot} style={{ backgroundColor: "#9CA3AF" }} />
            Cerradas
          </span>
        </div>
      </div>

      <div className={styles.chart}>
        {points.map((point) => (
          <div key={point.label} className={styles.column}>
            <div className={styles.bars}>
              <div
                className={styles.bar}
                style={{ height: `${(point.created / maxValue) * 100}%`, backgroundColor: "#3B82F6" }}
                title={`Creadas: ${point.created}`}
              />
              <div
                className={styles.bar}
                style={{ height: `${(point.closed / maxValue) * 100}%`, backgroundColor: "#9CA3AF" }}
                title={`Cerradas: ${point.closed}`}
              />
            </div>
            <span className={styles.monthLabel}>{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
