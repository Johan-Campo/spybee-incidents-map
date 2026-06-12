"use client";

import { useState } from "react";
import { CreateIncidentModal } from "@/components/incidents/CreateIncidentModal/CreateIncidentModal";
import { MapControls } from "@/components/map/MapControls/MapControls";
import { MapTopBar } from "@/components/map/MapTopBar/MapTopBar";
import { MapView } from "@/components/map/MapView/MapView";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <MapView>
      <MapTopBar />
      <MapControls onCreateIncident={() => setIsCreateModalOpen(true)} />
      {isCreateModalOpen && <CreateIncidentModal onClose={() => setIsCreateModalOpen(false)} />}
    </MapView>
  );
}
