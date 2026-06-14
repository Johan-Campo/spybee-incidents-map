"use client";

import { useState } from "react";
import { CreateIncidentModal } from "@/components/incidents/CreateIncidentModal/CreateIncidentModal";
import { IncidentDetailModal } from "@/components/map/IncidentDetailModal/IncidentDetailModal";
import { IncidentMarker } from "@/components/map/IncidentMarker/IncidentMarker";
import { IncidentPopup } from "@/components/map/IncidentPopup/IncidentPopup";
import { MapControls } from "@/components/map/MapControls/MapControls";
import { MapTopBar } from "@/components/map/MapTopBar/MapTopBar";
import { MapView } from "@/components/map/MapView/MapView";
import { Toast } from "@/components/shared/Toast/Toast";
import { useIncidentsStore } from "@/store/incidentsStore";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [newIncidentId, setNewIncidentId] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"2D" | "3D">("2D");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const incidents = useIncidentsStore((state) => state.incidents);
  const activeIncidents = incidents.filter((incident) => !incident.deleted);
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId);

  function handleMarkerClick(incidentId: string) {
    setSelectedIncidentId(incidentId);
    if (incidentId === newIncidentId) setNewIncidentId(null);
  }

  return (
    <MapView
      pitch={mapView === "3D" ? 50 : 0}
      markers={activeIncidents.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          isNew={incident.id === newIncidentId}
          onClick={() => handleMarkerClick(incident.id)}
        />
      ))}
      popup={
        selectedIncident && (
          <IncidentPopup
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
            onViewDetail={() => setIsDetailModalOpen(true)}
          />
        )
      }
    >
      <MapTopBar incidentCount={activeIncidents.length} />
      <MapControls onCreateIncident={() => setIsCreateModalOpen(true)} view={mapView} onViewChange={setMapView} />
      {isCreateModalOpen && (
        <CreateIncidentModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={(incident) => {
            setNewIncidentId(incident.id);
            setToastMessage(`Incidencia #${incident.sequenceId} creada correctamente`);
          }}
        />
      )}
      {isDetailModalOpen && selectedIncident && (
        <IncidentDetailModal incident={selectedIncident} onClose={() => setIsDetailModalOpen(false)} />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </MapView>
  );
}
