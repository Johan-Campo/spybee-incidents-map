import type { ReactNode } from "react";
import styles from "./fields.module.scss";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {required && <span className={styles.required}>*</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
