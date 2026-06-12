"use client";

import { useRef, useState, type DragEvent } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    onChange([...files, ...Array.from(newFiles)]);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <FormField label={label}>
      <div
        className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ""}`}
        onClick={() => inputRef.current?.click()}
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
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className={styles.fileInput}
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              {file.type.startsWith("image/") ? (
                <img className={styles.filePreview} src={URL.createObjectURL(file)} alt="" />
              ) : (
                <ImageIcon size={16} />
              )}
              <span className={styles.fileName}>{file.name}</span>
              <button type="button" className={styles.fileRemove} onClick={() => removeFile(index)}>
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
}
