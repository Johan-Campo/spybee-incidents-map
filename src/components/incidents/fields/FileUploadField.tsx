"use client";

import { useEffect, useId, useMemo, useState, type DragEvent } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { FormField } from "./FormField";
import styles from "./fields.module.scss";

interface FileUploadFieldProps {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function FileUploadField({ label, files, onChange }: FileUploadFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  const previews = useMemo(
    () => files.map((file) => (file.type.startsWith("image/") ? URL.createObjectURL(file) : null)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;

    const incoming = Array.from(newFiles);
    const valid: File[] = [];
    let validationError: string | null = null;

    for (const file of incoming) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        validationError = `"${file.name}" no es una imagen o video válido.`;
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        validationError = `"${file.name}" supera el tamaño máximo de ${MAX_SIZE_MB}MB.`;
        continue;
      }
      valid.push(file);
    }

    const availableSlots = Math.max(MAX_FILES - files.length, 0);
    if (valid.length > availableSlots) {
      validationError = `Solo puedes adjuntar hasta ${MAX_FILES} archivos.`;
    }

    const accepted = valid.slice(0, availableSlots);

    setError(validationError);
    if (accepted.length > 0) {
      onChange([...files, ...accepted]);
    }
  }

  function removeFile(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragOver(false);
    addFiles(event.dataTransfer.files);
  }

  const limitReached = files.length >= MAX_FILES;

  return (
    <FormField label={label} error={error}>
      <label
        htmlFor={inputId}
        className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ""} ${limitReached ? styles.dropzoneDisabled : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!limitReached) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          if (limitReached) {
            event.preventDefault();
            return;
          }
          handleDrop(event);
        }}
      >
        <Upload size={20} className={styles.dropzoneIcon} />
        <span>Arrastra archivos aquí o haz clic para seleccionar</span>
        <span className={styles.dropzoneHint}>
          Imágenes o videos · máx. {MAX_FILES} archivos, {MAX_SIZE_MB}MB c/u ({files.length}/{MAX_FILES})
        </span>
        <input
          id={inputId}
          type="file"
          multiple
          accept="image/*,video/*"
          className={styles.fileInput}
          disabled={limitReached}
          onChange={(event) => addFiles(event.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              {previews[index] ? (
                // eslint-disable-next-line @next/next/no-img-element -- previews son blob: URLs locales, next/image no las soporta
                <img className={styles.filePreview} src={previews[index]!} alt="" />
              ) : (
                <ImageIcon size={16} />
              )}
              <span className={styles.fileName}>{file.name}</span>
              <button
                type="button"
                className={styles.fileRemove}
                onClick={() => removeFile(index)}
                aria-label={`Quitar ${file.name}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
}
