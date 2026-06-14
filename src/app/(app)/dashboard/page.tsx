"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, FolderOpen, Percent, PlusCircle } from "lucide-react";
import { ActivityCalendar } from "@/components/dashboard/ActivityCalendar/ActivityCalendar";
import { CategoryBarChart } from "@/components/dashboard/CategoryBarChart/CategoryBarChart";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar/DashboardToolbar";
import { CriticalIncidentsTable } from "@/components/dashboard/CriticalIncidentsTable/CriticalIncidentsTable";
import { DonutChart } from "@/components/dashboard/DonutChart/DonutChart";
import { IncidentHeatmap } from "@/components/dashboard/IncidentHeatmap/IncidentHeatmap";
import { KpiCard } from "@/components/dashboard/KpiCard/KpiCard";
import { RiskIndicators } from "@/components/dashboard/RiskIndicators/RiskIndicators";
import { TagTreemap } from "@/components/dashboard/TagTreemap/TagTreemap";
import { TrendChart } from "@/components/dashboard/TrendChart/TrendChart";
import { WorkloadList } from "@/components/dashboard/WorkloadList/WorkloadList";
import { CreateIncidentModal } from "@/components/incidents/CreateIncidentModal/CreateIncidentModal";
import {
  formatCountDelta,
  formatDaysDelta,
  getCategoryCounts,
  getCriticalIncidents,
  getHighPriorityOpenCount,
  getOpenCount,
  getOverdueCount,
  getPeriodComparison,
  getPriorityCounts,
  getReporterRanking,
  getResolverRanking,
  getStaleCount,
  getStatusCounts,
  getTagCounts,
  getTrendData,
  getUpcomingDueCount,
  getWorkload,
  PERIOD_OPTIONS,
} from "@/lib/dashboardMetrics";
import { useIncidentsStore } from "@/store/incidentsStore";
import styles from "./page.module.scss";

interface TableFilter {
  type: "status" | "priority";
  id: string;
  label: string;
  color: string;
}

export default function DashboardPage() {
  const incidents = useIncidentsStore((state) => state.incidents);
  const [period, setPeriod] = useState(PERIOD_OPTIONS[2].value);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tableFilter, setTableFilter] = useState<TableFilter | null>(null);

  const periodOption = PERIOD_OPTIONS.find((option) => option.value === period) ?? PERIOD_OPTIONS[2];
  const comparison = getPeriodComparison(incidents, periodOption.days);
  const periodClosureRate = comparison.created === 0 ? 0 : Math.round((comparison.closed / comparison.created) * 100);

  const dailyTrend = getTrendData(incidents, "day");
  const backlogSparkline = dailyTrend.map((point) => point.backlog);
  const createdSparkline = dailyTrend.map((point) => point.created);
  const closedSparkline = dailyTrend.map((point) => point.closed);

  const criticalIncidents = getCriticalIncidents(incidents);
  const filteredCriticalIncidents = tableFilter
    ? criticalIncidents.filter((incident) =>
        tableFilter.type === "status" ? incident.status === tableFilter.id : incident.priority === tableFilter.id
      )
    : criticalIncidents;

  function toggleStatusFilter(segment: { id?: string; label: string; color: string }) {
    if (!segment.id) return;
    setTableFilter((current) =>
      current?.type === "status" && current.id === segment.id
        ? null
        : { type: "status", id: segment.id!, label: segment.label, color: segment.color }
    );
  }

  function togglePriorityFilter(segment: { id?: string; label: string; color: string }) {
    if (!segment.id) return;
    setTableFilter((current) =>
      current?.type === "priority" && current.id === segment.id
        ? null
        : { type: "priority", id: segment.id!, label: segment.label, color: segment.color }
    );
  }

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
          sparkline={backlogSparkline}
        />
        <KpiCard
          icon={PlusCircle}
          label="Creadas"
          value={String(comparison.created)}
          subtitle="en el periodo"
          delta={formatCountDelta(comparison.created, comparison.createdPrevious)}
          accentColor="#3B82F6"
          sparkline={createdSparkline}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Cerradas"
          value={String(comparison.closed)}
          subtitle="en el periodo"
          delta={formatCountDelta(comparison.closed, comparison.closedPrevious)}
          accentColor="#9CA3AF"
          sparkline={closedSparkline}
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
          critical={getOverdueCount(incidents) > 0}
        />
      </section>

      <RiskIndicators
        overdueToday={getOverdueCount(incidents)}
        staleCount={getStaleCount(incidents)}
        highPriorityOpen={getHighPriorityOpenCount(incidents)}
        upcomingDue={getUpcomingDueCount(incidents)}
      />

      <section className={styles.donutsRow}>
        <DonutChart
          title="Por estado"
          subtitle="Distribución de todas las incidencias registradas"
          segments={getStatusCounts(incidents).map((status) => ({ id: status.status, label: status.label, value: status.value, color: status.color }))}
          activeId={tableFilter?.type === "status" ? tableFilter.id : null}
          onSegmentClick={toggleStatusFilter}
        />
        <DonutChart
          title="Por prioridad"
          subtitle="Nivel de urgencia de las incidencias abiertas"
          segments={getPriorityCounts(incidents).map((priority) => ({ id: priority.priority, label: priority.label, value: priority.value, color: priority.color }))}
          activeId={tableFilter?.type === "priority" ? tableFilter.id : null}
          onSegmentClick={togglePriorityFilter}
        />
      </section>

      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tendencia y riesgo</h2>
          <span className={styles.sectionSubtitle}>Evolución temporal y alertas accionables</span>
        </div>

        <TrendChart title="Tendencia: creadas vs cerradas" incidents={incidents} />

        <CriticalIncidentsTable
          incidents={filteredCriticalIncidents}
          totalCount={criticalIncidents.length}
          filter={tableFilter ? { label: tableFilter.label, color: tableFilter.color } : null}
          onClearFilter={() => setTableFilter(null)}
        />
      </section>

      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Distribución detallada</h2>
          <span className={styles.sectionSubtitle}>Incidencias por categoría y por etiqueta</span>
        </div>

        <div className={styles.distributionRow}>
          <CategoryBarChart title="Por categoría de incidencia" categories={getCategoryCounts(incidents)} />
          <TagTreemap title="Por etiqueta" tags={getTagCounts(incidents)} />
        </div>
      </section>

      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Desempeño del equipo</h2>
          <span className={styles.sectionSubtitle}>Quién resuelve, quién reporta y cómo está repartida la carga</span>
        </div>

        <div className={styles.teamRow}>
          <WorkloadList title="Quién resuelve más" subtitle="Incidencias cerradas" entries={getResolverRanking(incidents)} />
          <WorkloadList title="Quién reporta más" subtitle="Incidencias creadas" entries={getReporterRanking(incidents)} />
          <WorkloadList title="Carga actual de trabajo" subtitle="Incidencias abiertas asignadas" entries={getWorkload(incidents)} />
        </div>
      </section>

      <section className={styles.calendarRow}>
        <ActivityCalendar incidents={incidents} />
        <IncidentHeatmap incidents={incidents} />
      </section>
    </div>
  );
}
