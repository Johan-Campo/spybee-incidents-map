export type IncidentPriority = "low" | "medium" | "high";

export type IncidentStatus = "open" | "on_pause" | "closed";

export interface IncidentType {
  id: string;
  key: string;
  name: string;
  name_en: string;
}

export interface IncidentProject {
  id: string;
  name: string;
}

export interface IncidentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface IncidentCoordinates {
  lat: number;
  lng: number;
}

export type IncidentMediaType = "image" | "video";

export interface IncidentMedia {
  id: string;
  name: string;
  type: IncidentMediaType;
  format: string;
  size: number;
  status: string;
  url: string;
}

export interface IncidentTag {
  id: string;
  name: string;
  color: string;
}

export interface Incident {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;
  type: IncidentType;
  priority: IncidentPriority;
  status: IncidentStatus;
  approval: boolean;
  project: IncidentProject;
  owner: IncidentUser;
  whatsappOwner: string | null;
  assignees: IncidentUser[];
  observers: IncidentUser[];
  coordinates: IncidentCoordinates;
  locationDescription: string;
  dueDate: string | null;
  closingDate: string | null;
  media: IncidentMedia[];
  tags: IncidentTag[];
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string;
}
