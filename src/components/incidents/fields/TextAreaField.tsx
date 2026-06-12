import { FormField } from "./FormField";
import styles from "./fields.module.scss";

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function TextAreaField({ id, label, value, onChange, placeholder, required }: TextAreaFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </FormField>
  );
}
