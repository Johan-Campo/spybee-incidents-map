"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import styles from "./Toast.module.scss";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={styles.toast} role="status">
      <CheckCircle2 size={18} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar notificación">
        <X size={14} />
      </button>
    </div>
  );
}
