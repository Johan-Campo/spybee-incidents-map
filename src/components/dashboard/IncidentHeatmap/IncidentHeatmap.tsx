"use client";

import Map, { Layer, NavigationControl, Source } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { DEFAULT_MAP_VIEW, MAPBOX_TOKEN, MAP_STYLE } from "@/lib/mapConfig";
import type { Incident } from "@/types/incident";
import styles from "./IncidentHeatmap.module.scss";

interface IncidentHeatmapProps {
  incidents: Incident[];
}

export function IncidentHeatmap({ incidents }: IncidentHeatmapProps) {
  const geojson = {
    type: "FeatureCollection" as const,
    features: incidents
      .filter((incident) => !incident.deleted)
      .map((incident) => ({
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "Point" as const,
          coordinates: [incident.coordinates.lng, incident.coordinates.lat],
        },
      })),
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerText}>
        <h3 className={styles.title}>Mapa de calor de incidencias</h3>
        <p className={styles.subtitle}>Concentración geográfica de incidencias en la obra. Acércate para ver cada incidencia como un punto individual.</p>
      </div>

      <div className={styles.map}>
        <Map
          initialViewState={DEFAULT_MAP_VIEW}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={MAP_STYLE}
          style={{ width: "100%", height: "100%" }}
          dragRotate={false}
          pitchWithRotate={false}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <Source type="geojson" data={geojson}>
            <Layer
              id="incident-heatmap"
              type="heatmap"
              paint={{
                "heatmap-weight": 1,
                "heatmap-intensity": 1,
                "heatmap-radius": 32,
                "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0.75, 16, 0.2],
                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0, "rgba(245, 185, 20, 0)",
                  0.3, "rgba(245, 185, 20, 0.55)",
                  0.6, "rgba(249, 115, 22, 0.75)",
                  1, "rgba(220, 38, 38, 0.9)",
                ],
              }}
            />
            <Layer
              id="incident-points"
              type="circle"
              paint={{
                "circle-radius": 5,
                "circle-color": "#ef4444",
                "circle-stroke-width": 1.5,
                "circle-stroke-color": "#fff",
                "circle-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, 1],
                "circle-stroke-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, 1],
              }}
            />
          </Source>
        </Map>
      </div>
    </div>
  );
}
