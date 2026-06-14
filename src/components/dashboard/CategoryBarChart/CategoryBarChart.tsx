"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategoryCount } from "@/lib/dashboardMetrics";
import styles from "./CategoryBarChart.module.scss";

interface CategoryBarChartProps {
  title: string;
  categories: CategoryCount[];
}

export function CategoryBarChart({ title, categories }: CategoryBarChartProps) {
  const data = [...categories].sort((a, b) => a.value - b.value);
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartHeight = Math.max(180, data.length * 36);

  return (
    <div className={styles.card}>
      <div className={styles.headerText}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>Cantidad de incidencias registradas por categoría de obra.</p>
      </div>

      <div className={styles.chart} style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 28, bottom: 0, left: 0 }}>
            <XAxis type="number" domain={[0, maxValue]} hide />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#374151" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={600} barSize={14}>
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="right" fontSize={12} fontWeight={600} fill="#374151" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
