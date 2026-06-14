"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIncidentsStore } from "@/store/incidentsStore";
import { CATEGORY_OPTIONS, CURRENT_USER, DEFAULT_PROJECT, PEOPLE_OPTIONS, PRIORITY_OPTIONS } from "@/lib/incidentOptions";
import { DEFAULT_MAP_VIEW } from "@/lib/mapConfig";
import { LOCATION_TAGS, flattenLocationTags } from "@/lib/locationTags";
import { parseLocalDate } from "@/lib/date";
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
  onCreated?: (incident: Incident) => void;
}

const INITIAL_COORDINATES: IncidentCoordinates = {
  lat: DEFAULT_MAP_VIEW.latitude,
  lng: DEFAULT_MAP_VIEW.longitude,
};

export function CreateIncidentModal({ onClose, onCreated }: CreateIncidentModalProps) {
  const incidentsCount = useIncidentsStore((state) => state.incidents.length);
  const addIncident = useIncidentsStore((state) => state.addIncident);
  const modalRef = useFocusTrap<HTMLDivElement>(true);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") onClose();
  }

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fieldErrors = {
    title: title.trim() ? null : "El título es obligatorio.",
    description: description.trim() ? null : "La descripción es obligatoria.",
    dueDate: dueDate ? null : "Selecciona una fecha de vencimiento.",
    categoryId: categoryId ? null : "Selecciona una categoría.",
    priority: priority ? null : "Selecciona una prioridad.",
  };

  function markTouched(field: keyof typeof fieldErrors) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function fieldError(field: keyof typeof fieldErrors) {
    return touched[field] || hasSubmitted ? fieldErrors[field] : null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    const category = CATEGORY_OPTIONS.find((option) => option.id === categoryId);
    if (!category || !priority || Object.values(fieldErrors).some(Boolean)) {
      setSubmitError("Completa los campos marcados en rojo antes de continuar.");
      return;
    }
    setSubmitError(null);

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
      dueDate: dueDate ? parseLocalDate(dueDate).toISOString() : null,
      closingDate: null,
      media,
      tags: flattenLocationTags().filter((tag) => tagIds.includes(tag.id)),
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };

    addIncident(newIncident);
    onCreated?.(newIncident);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-incident-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <header className={styles.header}>
          <h2 id="create-incident-title" className={styles.title}>Crear Incidencia</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <form className={styles.body} onSubmit={handleSubmit} id="create-incident-form">
          <TextField
            id="title"
            label="Título"
            value={title}
            onChange={setTitle}
            onBlur={() => markTouched("title")}
            placeholder="Nombre de la incidencia"
            required
            invalid={!!fieldError("title")}
            error={fieldError("title")}
          />

          <TextAreaField
            id="description"
            label="Descripción"
            value={description}
            onChange={setDescription}
            onBlur={() => markTouched("description")}
            placeholder="Describe la incidencia"
            required
            invalid={!!fieldError("description")}
            error={fieldError("description")}
          />

          <DateField
            id="dueDate"
            label="Fecha de vencimiento"
            value={dueDate}
            onChange={setDueDate}
            onBlur={() => markTouched("dueDate")}
            required
            invalid={!!fieldError("dueDate")}
            error={fieldError("dueDate")}
          />

          <SearchableSelectField
            id="category"
            label="Categoría"
            value={categoryId}
            onChange={setCategoryId}
            onBlur={() => markTouched("categoryId")}
            placeholder="Seleccione categoría"
            required
            invalid={!!fieldError("categoryId")}
            error={fieldError("categoryId")}
            options={CATEGORY_OPTIONS.map((category) => ({ value: category.id, label: category.name, color: category.color }))}
          />

          <SelectField
            id="priority"
            label="Prioridad"
            value={priority}
            onChange={(value) => setPriority(value as IncidentPriority)}
            onBlur={() => markTouched("priority")}
            placeholder="Selecciona una prioridad"
            required
            invalid={!!fieldError("priority")}
            error={fieldError("priority")}
            options={PRIORITY_OPTIONS.map((option) => ({ value: option.value, label: option.label, color: option.color }))}
          />

          <TreeMultiSelectField
            label="Etiquetas"
            placeholder="Buscar etiquetas"
            selected={tagIds}
            onChange={setTagIds}
            nodes={LOCATION_TAGS}
          />

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

        {submitError && (
          <p className={styles.formError} role="alert">
            {submitError}
          </p>
        )}

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
