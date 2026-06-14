"use client";

import { useState, type ReactNode } from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { DEFAULT_MAP_VIEW, MAPBOX_TOKEN, MAP_STYLE } from "@/lib/mapConfig";
import styles from "./MapView.module.scss";

interface MapViewProps {
  children?: ReactNode;
  markers?: ReactNode;
  popup?: ReactNode;
  pitch?: number;
}

export function MapView({ children, markers, popup, pitch = DEFAULT_MAP_VIEW.pitch }: MapViewProps) {
  const [viewState, setViewState] = useState(DEFAULT_MAP_VIEW);

  return (
    <div className={styles.wrapper}>
      <Map
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
