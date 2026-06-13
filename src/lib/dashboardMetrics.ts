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

export interface MonthlyTrendPoint {
  label: string;
  created: number;
  closed: number;
}

export interface WorkloadEntry {
  id: string;
  name: string;
  avatarUrl: string;
  openCount: number;
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

export function getAverageResolutionDays(incidents: Incident[]): number | null {
  const resolved = activeIncidents(incidents).filter(
    (incident) => incident.status === "closed" && incident.closingDate
  );
  if (resolved.length === 0) return null;

  const totalDays = resolved.reduce((sum, incident) => {
    const created = new Date(incident.createdAt).getTime();
    const closed = new Date(incident.closingDate as string).getTime();
    return sum + (closed - created) / (1000 * 60 * 60 * 24);
  }, 0);

  return totalDays / resolved.length;
}

export function getOverdueCount(incidents: Incident[], now: Date = new Date()): number {
  return activeIncidents(incidents).filter(
    (incident) => incident.status !== "closed" && incident.dueDate && new Date(incident.dueDate) < now
  ).length;
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

export function getMonthlyTrend(incidents: Incident[], months = 6): MonthlyTrendPoint[] {
  const active = activeIncidents(incidents);
  const now = new Date();
  const points: MonthlyTrendPoint[] = [];

  for (let offset = months - 1; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const label = date.toLocaleDateString("es-CO", { month: "short" }).replace(".", "");

    const created = active.filter((incident) => {
      const createdAt = new Date(incident.createdAt);
      return createdAt.getFullYear() === year && createdAt.getMonth() === month;
    }).length;

    const closed = active.filter((incident) => {
      if (!incident.closingDate) return false;
      const closingDate = new Date(incident.closingDate);
      return closingDate.getFullYear() === year && closingDate.getMonth() === month;
    }).length;

    points.push({ label, created, closed });
  }

  return points;
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
