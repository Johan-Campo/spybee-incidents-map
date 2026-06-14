"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { EmptyState } from "@/components/dashboard/EmptyState/EmptyState";
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

function renderActiveShape(props: PieSectorDataItem) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={Number(outerRadius ?? 0) + 5}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill ?? "#ccc"}
    />
  );
}

export function DonutChart({ title, subtitle, segments, onSegmentClick, activeId }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const data = segments.filter((segment) => segment.value > 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <span className={styles.total}>{total}</span>
      </div>

      {data.length === 0 ? (
        <EmptyState icon={PieChartIcon} message="Sin incidencias registradas" />
      ) : (
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={75}
                paddingAngle={data.length > 1 ? 2 : 0}
                startAngle={90}
                endAngle={-270}
                animationDuration={600}
                stroke="none"
                activeShape={renderActiveShape}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.label}-${index}`}
                    fill={entry.color}
                    opacity={activeId && activeId !== entry.id ? 0.3 : 1}
                    cursor={onSegmentClick ? "pointer" : "default"}
                    onClick={() => onSegmentClick?.(entry)}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
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
      )}
    </div>
  );
}
