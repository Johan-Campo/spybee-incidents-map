"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Map, { type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { DEFAULT_MAP_VIEW, MAPBOX_TOKEN, MAP_STYLE } from "@/lib/mapConfig";
import styles from "./MapView.module.scss";

interface MapViewProps {
  children?: ReactNode;
  markers?: ReactNode;
  popup?: ReactNode;
  pitch?: number;
  flyTo?: { longitude: number; latitude: number } | null;
}

export function MapView({ children, markers, popup, pitch = DEFAULT_MAP_VIEW.pitch, flyTo }: MapViewProps) {
  const [viewState, setViewState] = useState(DEFAULT_MAP_VIEW);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    const targetZoom = Math.max(mapRef.current.getZoom(), 16);
    mapRef.current.flyTo({ center: [flyTo.longitude, flyTo.latitude], zoom: targetZoom, duration: 1500 });
  }, [flyTo]);

  return (
    <div className={styles.wrapper}>
      <Map
        ref={mapRef}
        {...viewState}
        pitch={pitch}
        onMove={(event) => setViewState(event.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
      >
        {markers}
        {popup}
      </Map>
      {children}
    </div>
  );
}
