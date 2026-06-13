"use client";

import { AlertTriangle, CheckCircle2, Clock, FolderOpen, Percent } from "lucide-react";
import { CategoryBarChart } from "@/components/dashboard/CategoryBarChart/CategoryBarChart";
import { DonutChart } from "@/components/dashboard/DonutChart/DonutChart";
import { KpiCard } from "@/components/dashboard/KpiCard/KpiCard";
import { TrendChart } from "@/components/dashboard/TrendChart/TrendChart";
import { WorkloadList } from "@/components/dashboard/WorkloadList/WorkloadList";
import {
  getAverageResolutionDays,
  getCategoryCounts,
  getClosedCount,
  getClosureRate,
  getMonthlyTrend,
  getOpenCount,
  getOverdueCount,
  getPriorityCounts,
  getStatusCounts,
  getWorkload,
} from "@/lib/dashboardMetrics";
import { DEFAULT_PROJECT } from "@/lib/incidentOptions";
import { useIncidentsStore } from "@/store/incidentsStore";
import styles from "./page.module.scss";

export default function DashboardPage() {
  const incidents = useIncidentsStore((state) => state.incidents);

  const averageResolutionDays = getAverageResolutionDays(incidents);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Incidencias</h1>
        <p className={styles.subtitle}>{DEFAULT_PROJECT.name}</p>
      </header>

      <section className={styles.kpis}>
        <KpiCard icon={FolderOpen} label="Abiertas" value={String(getOpenCount(incidents))} accentColor="#10B981" />
        <KpiCard icon={CheckCircle2} label="Cerradas" value={String(getClosedCount(incidents))} accentColor="#9CA3AF" />
        <KpiCard icon={Percent} label="Tasa de cierre" value={`${getClosureRate(incidents)}%`} accentColor="#3B82F6" />
        <KpiCard
          icon={Clock}
          label="Tiempo medio de resolución"
          value={averageResolutionDays === null ? "Sin datos" : `${averageResolutionDays.toFixed(1)} d`}
          accentColor="#6366F1"
        />
        <KpiCard icon={AlertTriangle} label="Vencidas activas" value={String(getOverdueCount(incidents))} accentColor="#EF4444" />
      </section>

      <section className={styles.donutsRow}>
        <DonutChart title="Por estado" segments={getStatusCounts(incidents)} />
        <DonutChart
          title="Por prioridad"
          segments={getPriorityCounts(incidents).map((priority) => ({ label: priority.label, value: priority.value, color: priority.color }))}
        />
      </section>

      <section className={styles.trendRow}>
        <TrendChart title="Tendencia: creadas vs cerradas" points={getMonthlyTrend(incidents)} />
      </section>

      <section className={styles.bottomRow}>
        <CategoryBarChart title="Incidencias por categoría" categories={getCategoryCounts(incidents)} />
        <WorkloadList title="Carga actual de trabajo" entries={getWorkload(incidents)} />
      </section>
    </div>
  );
}
