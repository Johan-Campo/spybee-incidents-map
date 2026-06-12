"use client";

import { MapControls } from "@/components/map/MapControls/MapControls";
import { MapTopBar } from "@/components/map/MapTopBar/MapTopBar";
import { MapView } from "@/components/map/MapView/MapView";

export default function Home() {
  return (
    <MapView>
      <MapTopBar />
      <MapControls onCreateIncident={() => {}} />
    </MapView>
  );
}
