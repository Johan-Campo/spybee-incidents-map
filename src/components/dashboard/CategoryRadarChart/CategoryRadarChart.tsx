"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryCount } from "@/lib/dashboardMetrics";
import styles from "./CategoryRadarChart.module.scss";

interface CategoryRadarChartProps {
  title: string;
  categories: CategoryCount[];
}

export function CategoryRadarChart({ title, categories }: CategoryRadarChartProps) {
  const data = categories.map((category) => ({ name: category.name, value: category.value }));
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <PolarRadiusAxis angle={90} domain={[0, maxValue]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Radar dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.35} animationDuration={600} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
