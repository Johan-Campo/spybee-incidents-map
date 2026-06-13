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

export function FileUploadField({ label, files, onChange }: FileUploadFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
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
    onChange([...files, ...Array.from(newFiles)]);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragOver(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <FormField label={label}>
      <label
        htmlFor={inputId}
        className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload size={20} className={styles.dropzoneIcon} />
        <span>Arrastra archivos aquí o haz clic para seleccionar</span>
        <span className={styles.dropzoneHint}>Imágenes o videos</span>
        <input
          id={inputId}
          type="file"
          multiple
          accept="image/*,video/*"
          className={styles.fileInput}
          onChange={(event) => addFiles(event.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              {previews[index] ? (
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
