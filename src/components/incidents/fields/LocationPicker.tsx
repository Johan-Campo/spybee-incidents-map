"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN, MAP_STYLE } from "@/lib/mapConfig";
import type { IncidentCoordinates } from "@/types/incident";
import { FormField } from "./FormField";
import { TextField } from "./TextField";
import styles from "./LocationPicker.module.scss";
import fieldStyles from "./fields.module.scss";

interface LocationPickerProps {
  coordinates: IncidentCoordinates;
  onChange: (coordinates: IncidentCoordinates) => void;
  locationDescription: string;
  onLocationDescriptionChange: (value: string) => void;
}

export function LocationPicker({
  coordinates,
  onChange,
  locationDescription,
  onLocationDescriptionChange,
}: LocationPickerProps) {
  return (
    <FormField label="Ubicación">
      <div className={styles.locationPicker}>
        <div className={styles.coords}>
          <TextField
            id="latitude"
            label="Latitud"
            type="number"
            value={String(coordinates.lat)}
            onChange={(value) => onChange({ ...coordinates, lat: Number(value) })}
          />
          <TextField
            id="longitude"
            label="Longitud"
            type="number"
            value={String(coordinates.lng)}
            onChange={(value) => onChange({ ...coordinates, lng: Number(value) })}
          />
        </div>

        <div className={styles.miniMap}>
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle={MAP_STYLE}
            style={{ width: "100%", height: "100%" }}
            longitude={coordinates.lng}
            latitude={coordinates.lat}
            zoom={15}
            onClick={(event) => onChange({ lat: event.lngLat.lat, lng: event.lngLat.lng })}
          >
            <Marker
              longitude={coordinates.lng}
              latitude={coordinates.lat}
              draggable
              onDragEnd={(event) => onChange({ lat: event.lngLat.lat, lng: event.lngLat.lng })}
            >
              <div className={styles.marker} />
            </Marker>
          </Map>
        </div>

        <input
          id="locationDescription"
          type="text"
          className={fieldStyles.input}
          placeholder="Descripción de la ubicación"
          value={locationDescription}
          onChange={(event) => onLocationDescriptionChange(event.target.value)}
        />
      </div>
    </FormField>
  );
}
