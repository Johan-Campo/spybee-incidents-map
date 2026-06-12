"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useIncidentsStore } from "@/store/incidentsStore";
import { CATEGORY_OPTIONS, CURRENT_USER, DEFAULT_PROJECT, PEOPLE_OPTIONS, PRIORITY_OPTIONS } from "@/lib/incidentOptions";
import { DEFAULT_MAP_VIEW } from "@/lib/mapConfig";
import { LOCATION_TAGS, flattenLocationTags } from "@/lib/locationTags";
import type { Incident, IncidentCoordinates, IncidentMedia, IncidentPriority } from "@/types/incident";
import { TextField } from "../fields/TextField";
import { TextAreaField } from "../fields/TextAreaField";
import { SelectField } from "../fields/SelectField";
import { SearchableSelectField } from "../fields/SearchableSelectField";
import { SearchableMultiSelectField } from "../fields/SearchableMultiSelectField";
import { TreeMultiSelectField } from "../fields/TreeMultiSelectField";
import { DateField } from "../fields/DateField";
import { FileUploadField } from "../fields/FileUploadField";
import { LocationPicker } from "../fields/LocationPicker";
import styles from "./CreateIncidentModal.module.scss";

interface CreateIncidentModalProps {
  onClose: () => void;
}

const INITIAL_COORDINATES: IncidentCoordinates = {
  lat: DEFAULT_MAP_VIEW.latitude,
  lng: DEFAULT_MAP_VIEW.longitude,
};

export function CreateIncidentModal({ onClose }: CreateIncidentModalProps) {
  const incidentsCount = useIncidentsStore((state) => state.incidents.length);
  const addIncident = useIncidentsStore((state) => state.addIncident);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<IncidentPriority | "">("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [observerIds, setObserverIds] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<IncidentCoordinates>(INITIAL_COORDINATES);
  const [locationDescription, setLocationDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const category = CATEGORY_OPTIONS.find((option) => option.id === categoryId);
    if (!category || !priority) return;

    const order = incidentsCount + 1;
    const now = new Date().toISOString();

    const media: IncidentMedia[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      format: file.name.split(".").pop() ?? "",
      size: file.size,
      status: "uploaded",
      url: URL.createObjectURL(file),
    }));

    const newIncident: Incident = {
      id: crypto.randomUUID(),
      sequenceId: String(order).padStart(4, "0"),
      order,
      title,
      description,
      type: category,
      priority,
      status: "open",
      approval: false,
      project: DEFAULT_PROJECT,
      owner: CURRENT_USER,
      whatsappOwner: null,
      assignees: PEOPLE_OPTIONS.filter((person) => assigneeIds.includes(person.id)),
      observers: PEOPLE_OPTIONS.filter((person) => observerIds.includes(person.id)),
      coordinates,
      locationDescription,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      closingDate: null,
      media,
      tags: flattenLocationTags().filter((tag) => tagIds.includes(tag.id)),
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };

    addIncident(newIncident);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Crear Incidencia</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <form className={styles.body} onSubmit={handleSubmit} id="create-incident-form">
          <TextField id="title" label="Título" value={title} onChange={setTitle} placeholder="Nombre de la incidencia" required />

          <TextAreaField
            id="description"
            label="Descripción"
            value={description}
            onChange={setDescription}
            placeholder="Describe la incidencia"
            required
          />

          <DateField id="dueDate" label="Fecha de vencimiento" value={dueDate} onChange={setDueDate} required />

          <div className={styles.categoryRow}>
            <SearchableSelectField
              id="category"
              label="Categoría"
              value={categoryId}
              onChange={setCategoryId}
              placeholder="Seleccione categoría"
              required
              options={CATEGORY_OPTIONS.map((category) => ({ value: category.id, label: category.name, color: category.color }))}
            />
            <button type="button" className={styles.manageButton}>
              Gestionar categorías
            </button>
          </div>

          <SelectField
            id="priority"
            label="Prioridad"
            value={priority}
            onChange={(value) => setPriority(value as IncidentPriority)}
            placeholder="Selecciona una prioridad"
            required
            options={PRIORITY_OPTIONS.map((option) => ({ value: option.value, label: option.label, color: option.color }))}
          />

          <div className={styles.categoryRow}>
            <TreeMultiSelectField
              label="Etiquetas"
              placeholder="Buscar etiquetas"
              selected={tagIds}
              onChange={setTagIds}
              nodes={LOCATION_TAGS}
            />
            <button type="button" className={styles.manageButton}>
              Manage
            </button>
          </div>

          <SearchableMultiSelectField
            label="Asignados"
            placeholder="Selecciona asignados"
            selected={assigneeIds}
            onChange={setAssigneeIds}
            options={PEOPLE_OPTIONS.map((person) => ({ value: person.id, label: person.name, avatarUrl: person.avatarUrl }))}
          />

          <SearchableMultiSelectField
            label="Observadores"
            placeholder="Selecciona observadores"
            selected={observerIds}
            onChange={setObserverIds}
            options={PEOPLE_OPTIONS.map((person) => ({ value: person.id, label: person.name, avatarUrl: person.avatarUrl }))}
          />

          <LocationPicker
            coordinates={coordinates}
            onChange={setCoordinates}
            locationDescription={locationDescription}
            onLocationDescriptionChange={setLocationDescription}
          />

          <FileUploadField label="Adjuntos" files={files} onChange={setFiles} />
        </form>

        <footer className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="create-incident-form" className={styles.submitButton}>
            Crear Incidente
          </button>
        </footer>
      </div>
    </div>
  );
}
