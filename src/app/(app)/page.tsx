"use client";

import { useState } from "react";
import { CreateIncidentModal } from "@/components/incidents/CreateIncidentModal/CreateIncidentModal";
import { IncidentMarker } from "@/components/map/IncidentMarker/IncidentMarker";
import { IncidentPopup } from "@/components/map/IncidentPopup/IncidentPopup";
import { MapControls } from "@/components/map/MapControls/MapControls";
import { MapTopBar } from "@/components/map/MapTopBar/MapTopBar";
import { MapView } from "@/components/map/MapView/MapView";
import { useIncidentsStore } from "@/store/incidentsStore";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [newIncidentId, setNewIncidentId] = useState<string | null>(null);
  const incidents = useIncidentsStore((state) => state.incidents);
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId);

  function handleMarkerClick(incidentId: string) {
    setSelectedIncidentId(incidentId);
    if (incidentId === newIncidentId) setNewIncidentId(null);
  }

  return (
    <MapView
      markers={incidents
        .filter((incident) => !incident.deleted)
        .map((incident) => (
          <IncidentMarker
            key={incident.id}
            incident={incident}
            isNew={incident.id === newIncidentId}
            onClick={() => handleMarkerClick(incident.id)}
          />
        ))}
      popup={
        selectedIncident && (
          <IncidentPopup incident={selectedIncident} onClose={() => setSelectedIncidentId(null)} />
        )
      }
    >
      <MapTopBar />
      <MapControls onCreateIncident={() => setIsCreateModalOpen(true)} />
      {isCreateModalOpen && (
        <CreateIncidentModal onClose={() => setIsCreateModalOpen(false)} onCreated={(incident) => setNewIncidentId(incident.id)} />
      )}
    </MapView>
  );
}
