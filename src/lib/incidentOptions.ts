import incidentsMock from "../../data/incidents.mock.json";
import type { Incident, IncidentPriority, IncidentProject, IncidentTag, IncidentType, IncidentUser } from "@/types/incident";

const incidents = incidentsMock as Incident[];

export const CURRENT_USER: IncidentUser = {
  id: "current-user-johan",
  name: "Johan Campo",
  email: "johan.campo@constructora.com",
  avatarUrl: "https://i.pravatar.cc/64?u=johan-superadmin",
};

export const DEFAULT_PROJECT: IncidentProject = incidents[0].project;

const CATEGORY_COLORS: Record<string, string> = {
  plumbing: "#3B82F6",
  coordination: "#6366F1",
  electrical: "#F59E0B",
  infrastructure: "#0EA5E9",
  safety_hazard: "#EF4444",
  structural: "#8B5CF6",
  materials: "#14B8A6",
  masonry: "#A16207",
  achitectural: "#EC4899",
  stability: "#10B981",
  excavation: "#92400E",
  urban_planning: "#84CC16",
  "soil-study": "#78716C",
  observation: "#64748B",
  foundation: "#DC2626",
};

export interface CategoryOption extends IncidentType {
  color: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = Array.from(
  new Map(incidents.map((incident) => [incident.type.id, incident.type])).values()
).map((type) => ({ ...type, color: CATEGORY_COLORS[type.key] ?? "#6B7280" }));

export const PRIORITY_OPTIONS: { value: IncidentPriority; label: string; color: string }[] = [
  { value: "high", label: "Alta", color: "#EF4444" },
  { value: "medium", label: "Media", color: "#F59E0B" },
  { value: "low", label: "Baja", color: "#10B981" },
];

export const TAG_OPTIONS: IncidentTag[] = Array.from(
  new Map(incidents.flatMap((incident) => incident.tags).map((tag) => [tag.id, tag])).values()
);

export const PEOPLE_OPTIONS: IncidentUser[] = Array.from(
  new Map(
    incidents
      .flatMap((incident) => [incident.owner, ...incident.assignees, ...incident.observers])
      .filter((user): user is IncidentUser => Boolean(user))
      .map((user) => [user.id, user])
  ).values()
);
