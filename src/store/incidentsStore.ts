import { create } from "zustand";
import incidentsMock from "../../data/incidents.mock.json";
import type { Incident } from "@/types/incident";

interface IncidentsState {
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
}

export const useIncidentsStore = create<IncidentsState>((set) => ({
  incidents: incidentsMock as Incident[],
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
}));
