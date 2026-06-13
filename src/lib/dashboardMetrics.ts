import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "./incidentOptions";
import type { Incident, IncidentPriority, IncidentStatus } from "@/types/incident";

export interface StatusCount {
  status: IncidentStatus;
  label: string;
  value: number;
  color: string;
}

export interface PriorityCount {
  priority: IncidentPriority;
  label: string;
  value: number;
  color: string;
}

export interface CategoryCount {
  id: string;
  name: string;
  value: number;
  color: string;
}

export type TrendGranularity = "day" | "week" | "month";

export interface TrendPoint {
  label: string;
  created: number;
  closed: number;
  backlog: number;
}

export interface WorkloadEntry {
  id: string;
  name: string;
  avatarUrl: string;
  openCount: number;
}

export interface PeriodOption {
  value: string;
  label: string;
  days: number;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "7d", label: "Últimos 7 días", days: 7 },
  { value: "15d", label: "Últimos 15 días", days: 15 },
  { value: "30d", label: "Últimos 30 días", days: 30 },
  { value: "90d", label: "Últimos 90 días", days: 90 },
  { value: "6m", label: "Últimos 6 meses", days: 182 },
];

export interface PeriodRange {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
}

export interface PeriodComparison {
  created: number;
  createdPrevious: number;
  closed: number;
  closedPrevious: number;
  averageResolutionDays: number | null;
  averageResolutionDaysPrevious: number | null;
}

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  open: "Abierta",
  on_pause: "En pausa",
  closed: "Cerrada",
};

export const STATUS_COLORS: Record<IncidentStatus, string> = {
  open: "#10B981",
  on_pause: "#F59E0B",
  closed: "#9CA3AF",
};

function activeIncidents(incidents: Incident[]): Incident[] {
  return incidents.filter((incident) => !incident.deleted);
}

export function getOpenCount(incidents: Incident[]): number {
  return activeIncidents(incidents).filter((incident) => incident.status !== "closed").length;
}

export function getClosedCount(incidents: Incident[]): number {
  return activeIncidents(incidents).filter((incident) => incident.status === "closed").length;
}

export function getClosureRate(incidents: Incident[]): number {
  const active = activeIncidents(incidents);
  if (active.length === 0) return 0;
  return Math.round((getClosedCount(incidents) / active.length) * 100);
}

function averageResolutionForIncidents(incidents: Incident[]): number | null {
  const resolved = incidents.filter((incident) => incident.status === "closed" && incident.closingDate);
  if (resolved.length === 0) return null;

  const totalDays = resolved.reduce((sum, incident) => {
    const created = new Date(incident.createdAt).getTime();
    const closed = new Date(incident.closingDate as string).getTime();
    return sum + (closed - created) / (1000 * 60 * 60 * 24);
  }, 0);

  return totalDays / resolved.length;
}

export function getAverageResolutionDays(incidents: Incident[]): number | null {
  return averageResolutionForIncidents(activeIncidents(incidents));
}

export function getOverdueCount(incidents: Incident[], now: Date = new Date()): number {
  return activeIncidents(incidents).filter(
    (incident) => incident.status !== "closed" && incident.dueDate && new Date(incident.dueDate) < now
  ).length;
}

export function getStaleCount(incidents: Incident[], days = 7, now: Date = new Date()): number {
  const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return activeIncidents(incidents).filter(
    (incident) => incident.status !== "closed" && new Date(incident.updatedAt) < threshold
  ).length;
}

export function getHighPriorityOpenCount(incidents: Incident[]): number {
  return activeIncidents(incidents).filter((incident) => incident.status !== "closed" && incident.priority === "high").length;
}

export function getUpcomingDueCount(incidents: Incident[], days = 7, now: Date = new Date()): number {
  const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return activeIncidents(incidents).filter((incident) => {
    if (incident.status === "closed" || !incident.dueDate) return false;
    const dueDate = new Date(incident.dueDate);
    return dueDate >= now && dueDate <= threshold;
  }).length;
}

export function getStatusCounts(incidents: Incident[]): StatusCount[] {
  const active = activeIncidents(incidents);
  return (Object.keys(STATUS_LABELS) as IncidentStatus[]).map((status) => ({
    status,
    label: STATUS_LABELS[status],
    value: active.filter((incident) => incident.status === status).length,
    color: STATUS_COLORS[status],
  }));
}

export function getPriorityCounts(incidents: Incident[]): PriorityCount[] {
  const active = activeIncidents(incidents);
  return PRIORITY_OPTIONS.map(({ value, label, color }) => ({
    priority: value,
    label,
    value: active.filter((incident) => incident.priority === value).length,
    color,
  }));
}

export function getCategoryCounts(incidents: Incident[], limit = 8): CategoryCount[] {
  const active = activeIncidents(incidents);
  return CATEGORY_OPTIONS.map((category) => ({
    id: category.id,
    name: category.name,
    value: active.filter((incident) => incident.type.id === category.id).length,
    color: category.color,
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const TREND_BUCKET_COUNTS: Record<TrendGranularity, number> = {
  day: 14,
  week: 12,
  month: 6,
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface TrendBucket {
  start: Date;
  end: Date;
  label: string;
}

function buildTrendBuckets(granularity: TrendGranularity, now: Date): TrendBucket[] {
  const count = TREND_BUCKET_COUNTS[granularity];
  const buckets: TrendBucket[] = [];

  if (granularity === "month") {
    for (let offset = count - 1; offset >= 0; offset--) {
      const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
      const label = capitalize(start.toLocaleDateString("es-CO", { month: "short" }).replace(".", ""));
      buckets.push({ start, end, label });
    }
    return buckets;
  }

  const bucketDays = granularity === "week" ? 7 : 1;
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  for (let offset = count - 1; offset >= 0; offset--) {
    const end = new Date(todayEnd.getTime() - offset * bucketDays * ONE_DAY_MS);
    const start = new Date(end.getTime() - bucketDays * ONE_DAY_MS);
    const month = capitalize(start.toLocaleDateString("es-CO", { month: "short" }).replace(".", ""));
    const day = String(start.getDate()).padStart(2, "0");
    buckets.push({ start, end, label: `${month} ${day}` });
  }

  return buckets;
}

export function getTrendData(incidents: Incident[], granularity: TrendGranularity, now: Date = new Date()): TrendPoint[] {
  const active = activeIncidents(incidents);
  const buckets = buildTrendBuckets(granularity, now);

  return buckets.map(({ start, end, label }) => {
    const created = active.filter((incident) => {
      const createdAt = new Date(incident.createdAt);
      return createdAt >= start && createdAt < end;
    }).length;

    const closed = active.filter((incident) => {
      if (!incident.closingDate) return false;
      const closedAt = new Date(incident.closingDate);
      return closedAt >= start && closedAt < end;
    }).length;

    const totalCreated = active.filter((incident) => new Date(incident.createdAt) < end).length;
    const totalClosed = active.filter((incident) => incident.closingDate && new Date(incident.closingDate) < end).length;

    return { label, created, closed, backlog: totalCreated - totalClosed };
  });
}

export function getWorkload(incidents: Incident[], limit = 6): WorkloadEntry[] {
  const active = activeIncidents(incidents).filter((incident) => incident.status !== "closed");
  const counts = new Map<string, WorkloadEntry>();

  for (const incident of active) {
    for (const assignee of incident.assignees) {
      const entry = counts.get(assignee.id);
      if (entry) {
        entry.openCount += 1;
      } else {
        counts.set(assignee.id, {
          id: assignee.id,
          name: assignee.name,
          avatarUrl: assignee.avatarUrl,
          openCount: 1,
        });
      }
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.openCount - a.openCount)
    .slice(0, limit);
}

function dayMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

function isWithinRange(dateValue: string | null, start: Date, end: Date): boolean {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  return date >= start && date < end;
}

export function getPeriodRange(days: number, now: Date = new Date()): PeriodRange {
  const end = now;
  const start = new Date(end.getTime() - dayMs(days));
  const previousEnd = start;
  const previousStart = new Date(previousEnd.getTime() - dayMs(days));
  return { start, end, previousStart, previousEnd };
}

export function getPeriodComparison(incidents: Incident[], days: number, now: Date = new Date()): PeriodComparison {
  const active = activeIncidents(incidents);
  const { start, end, previousStart, previousEnd } = getPeriodRange(days, now);

  const created = active.filter((incident) => isWithinRange(incident.createdAt, start, end)).length;
  const createdPrevious = active.filter((incident) => isWithinRange(incident.createdAt, previousStart, previousEnd)).length;

  const closed = active.filter((incident) => isWithinRange(incident.closingDate, start, end)).length;
  const closedPrevious = active.filter((incident) => isWithinRange(incident.closingDate, previousStart, previousEnd)).length;

  const resolvedInPeriod = active.filter((incident) => isWithinRange(incident.closingDate, start, end));
  const resolvedInPrevious = active.filter((incident) => isWithinRange(incident.closingDate, previousStart, previousEnd));

  return {
    created,
    createdPrevious,
    closed,
    closedPrevious,
    averageResolutionDays: averageResolutionForIncidents(resolvedInPeriod),
    averageResolutionDaysPrevious: averageResolutionForIncidents(resolvedInPrevious),
  };
}

export interface MetricDelta {
  text: string;
  direction: "up" | "down" | "neutral";
}

export function formatCountDelta(current: number, previous: number): MetricDelta {
  const diff = current - previous;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";
  return { text: `${Math.abs(diff)} vs periodo anterior`, direction };
}

export function formatDaysDelta(current: number | null, previous: number | null): MetricDelta {
  if (current === null) return { text: "— vs periodo anterior", direction: "neutral" };
  const diff = current - (previous ?? 0);
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";
  return { text: `${Math.abs(diff).toFixed(1)} d vs periodo anterior`, direction };
}

export function formatPeriodRangeLabel(days: number, now: Date = new Date()): string {
  const { start, end } = getPeriodRange(days, now);
  const formatter = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  return `${formatter.format(start).replace(".", "")} a ${formatter.format(end).replace(".", "")}`;
}
