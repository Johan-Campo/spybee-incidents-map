"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./DonutChart.module.scss";

export interface DonutChartSegment {
  id?: string;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  segments: DonutChartSegment[];
  onSegmentClick?: (segment: DonutChartSegment) => void;
  activeId?: string | null;
}

const EMPTY_COLOR = "#f0f0f0";

export function DonutChart({ title, subtitle, segments, onSegmentClick, activeId }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const data = segments.filter((segment) => segment.value > 0);
  const chartData = data.length > 0 ? data : [{ label: "Sin datos", value: 1, color: EMPTY_COLOR }];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <span className={styles.total}>{total}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={56}
                paddingAngle={chartData.length > 1 ? 2 : 0}
                startAngle={90}
                endAngle={-270}
                animationDuration={600}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`${entry.label}-${index}`}
                    fill={entry.color}
                    opacity={activeId && activeId !== entry.id ? 0.3 : 1}
                    cursor={onSegmentClick && data.length > 0 ? "pointer" : "default"}
                    onClick={() => data.length > 0 && onSegmentClick?.(entry)}
                  />
                ))}
              </Pie>
              {data.length > 0 && (
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
              )}
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerLabel}>
            <span className={styles.centerValue}>{total}</span>
            <span className={styles.centerCaption}>total</span>
          </div>
        </div>

        <ul className={styles.legend}>
          {segments.map((segment) => {
            const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
            return (
              <li
                key={segment.label}
                className={`${styles.legendItem} ${onSegmentClick ? styles.clickable : ""} ${activeId === segment.id ? styles.active : ""}`}
                onClick={() => segment.value > 0 && onSegmentClick?.(segment)}
              >
                <span className={styles.dot} style={{ backgroundColor: segment.color }} />
                <span className={styles.legendLabel}>{segment.label}</span>
                <span className={styles.legendPct}>{pct}%</span>
                <span className={styles.legendValue}>{segment.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
