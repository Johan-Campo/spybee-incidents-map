"use client";

import { useEffect, useState } from "react";
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
  const [mapInteraction, setMapInteraction] = useState<{ incidentId: string; view: "popup" | "detail" } | null>(
    null,
  );
  const [newIncidentId, setNewIncidentId] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ longitude: number; latitude: number } | null>(null);
  const [mapView, setMapView] = useState<"2D" | "3D">("2D");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const incidents = useIncidentsStore((state) => state.incidents);
  const deleteIncident = useIncidentsStore((state) => state.deleteIncident);
  const activeIncidents = incidents.filter((incident) => !incident.deleted);
  const selectedIncident = incidents.find((incident) => incident.id === mapInteraction?.incidentId);

  function handleMarkerClick(incidentId: string) {
    setMapInteraction({ incidentId, view: "popup" });
    if (incidentId === newIncidentId) setNewIncidentId(null);
  }

  useEffect(() => {
    if (!newIncidentId) return;
    const timer = setTimeout(() => setNewIncidentId(null), 9000);
    return () => clearTimeout(timer);
  }, [newIncidentId]);

  return (
    <MapView
      pitch={mapView === "3D" ? 50 : 0}
      flyTo={flyToTarget}
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
            onClose={() => setMapInteraction(null)}
            onViewDetail={() => setMapInteraction((current) => current && { ...current, view: "detail" })}
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
            setFlyToTarget({ longitude: incident.coordinates.lng, latitude: incident.coordinates.lat });
            setToastMessage(`Incidencia #${incident.sequenceId} creada correctamente`);
          }}
        />
      )}
      {mapInteraction?.view === "detail" && selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setMapInteraction((current) => current && { ...current, view: "popup" })}
          onDelete={() => {
            deleteIncident(selectedIncident.id);
            setMapInteraction(null);
            setToastMessage("Incidencia eliminada correctamente");
          }}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </MapView>
  );
}
