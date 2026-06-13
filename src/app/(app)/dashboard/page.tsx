"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, FolderOpen, Percent, PlusCircle } from "lucide-react";
import { CategoryBarChart } from "@/components/dashboard/CategoryBarChart/CategoryBarChart";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar/DashboardToolbar";
import { DonutChart } from "@/components/dashboard/DonutChart/DonutChart";
import { KpiCard } from "@/components/dashboard/KpiCard/KpiCard";
import { RiskIndicators } from "@/components/dashboard/RiskIndicators/RiskIndicators";
import { TrendChart } from "@/components/dashboard/TrendChart/TrendChart";
import { WorkloadList } from "@/components/dashboard/WorkloadList/WorkloadList";
import { CreateIncidentModal } from "@/components/incidents/CreateIncidentModal/CreateIncidentModal";
import {
  formatCountDelta,
  formatDaysDelta,
  getCategoryCounts,
  getHighPriorityOpenCount,
  getOpenCount,
  getOverdueCount,
  getPeriodComparison,
  getPriorityCounts,
  getStaleCount,
  getStatusCounts,
  getUpcomingDueCount,
  getWorkload,
  PERIOD_OPTIONS,
} from "@/lib/dashboardMetrics";
import { useIncidentsStore } from "@/store/incidentsStore";
import styles from "./page.module.scss";

export default function DashboardPage() {
  const incidents = useIncidentsStore((state) => state.incidents);
  const [period, setPeriod] = useState(PERIOD_OPTIONS[2].value);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const periodOption = PERIOD_OPTIONS.find((option) => option.value === period) ?? PERIOD_OPTIONS[2];
  const comparison = getPeriodComparison(incidents, periodOption.days);
  const periodClosureRate = comparison.created === 0 ? 0 : Math.round((comparison.closed / comparison.created) * 100);

  return (
    <div className={styles.page}>
      <DashboardToolbar period={period} onPeriodChange={setPeriod} onCreateIncident={() => setIsCreateModalOpen(true)} />

      {isCreateModalOpen && <CreateIncidentModal onClose={() => setIsCreateModalOpen(false)} />}

      <section className={styles.kpis}>
        <KpiCard
          icon={FolderOpen}
          label="Abiertas"
          value={String(getOpenCount(incidents))}
          subtitle="actualmente"
          accentColor="#10B981"
        />
        <KpiCard
          icon={PlusCircle}
          label="Creadas"
          value={String(comparison.created)}
          subtitle="en el periodo"
          delta={formatCountDelta(comparison.created, comparison.createdPrevious)}
          accentColor="#3B82F6"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Cerradas"
          value={String(comparison.closed)}
          subtitle="en el periodo"
          delta={formatCountDelta(comparison.closed, comparison.closedPrevious)}
          accentColor="#9CA3AF"
        />
        <KpiCard
          icon={Percent}
          label="Tasa de cierre"
          value={`${periodClosureRate}%`}
          subtitle="cerradas / creadas"
          accentColor="#8B5CF6"
        />
        <KpiCard
          icon={Clock}
          label="Tiempo medio resolución"
          value={comparison.averageResolutionDays === null ? "Sin datos" : `${comparison.averageResolutionDays.toFixed(1)} d`}
          subtitle="días promedio"
          delta={formatDaysDelta(comparison.averageResolutionDays, comparison.averageResolutionDaysPrevious)}
          accentColor="#6366F1"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Vencidas activas"
          value={String(getOverdueCount(incidents))}
          subtitle="estado actual"
          accentColor="#EF4444"
        />
      </section>

      <section className={styles.donutsRow}>
        <DonutChart title="Por estado" segments={getStatusCounts(incidents)} />
        <DonutChart
          title="Por prioridad"
          segments={getPriorityCounts(incidents).map((priority) => ({ label: priority.label, value: priority.value, color: priority.color }))}
        />
      </section>

      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tendencia y riesgo</h2>
          <span className={styles.sectionSubtitle}>Evolución temporal y alertas accionables</span>
        </div>

        <TrendChart title="Tendencia: creadas vs cerradas" incidents={incidents} />

        <RiskIndicators
          overdueToday={getOverdueCount(incidents)}
          staleCount={getStaleCount(incidents)}
          highPriorityOpen={getHighPriorityOpenCount(incidents)}
          upcomingDue={getUpcomingDueCount(incidents)}
        />
      </section>

      <section className={styles.bottomRow}>
        <CategoryBarChart title="Incidencias por categoría" categories={getCategoryCounts(incidents)} />
        <WorkloadList title="Carga actual de trabajo" entries={getWorkload(incidents)} />
      </section>
    </div>
  );
}
