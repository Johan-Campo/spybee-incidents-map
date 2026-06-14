"use client";

import { useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getTrendData, type TrendGranularity } from "@/lib/dashboardMetrics";
import type { Incident } from "@/types/incident";
import styles from "./TrendChart.module.scss";

interface TrendChartProps {
  title: string;
  incidents: Incident[];
}

const GRANULARITY_OPTIONS: { value: TrendGranularity; label: string }[] = [
  { value: "day", label: "Día" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];

export function TrendChart({ title, incidents }: TrendChartProps) {
  const [granularity, setGranularity] = useState<TrendGranularity>("month");
  const points = getTrendData(incidents, granularity);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>Comparativa temporal con pendientes acumuladas</p>
        </div>

        <div className={styles.toggle}>
          {GRANULARITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.toggleButton} ${granularity === option.value ? styles.toggleButtonActive : ""}`}
              onClick={() => setGranularity(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={points} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis width={32} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
            <Bar dataKey="created" name="Creadas" fill="#3B82F6" radius={[2, 2, 0, 0]} animationDuration={600} />
            <Bar dataKey="closed" name="Cerradas" fill="#10B981" radius={[2, 2, 0, 0]} animationDuration={600} />
            <Line
              type="monotone"
              dataKey="backlog"
              name="Pendientes acumuladas"
              stroke="#F5B914"
              strokeWidth={2}
              dot={{ r: 2 }}
              animationDuration={600}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
