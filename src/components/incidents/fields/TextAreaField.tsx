import { FormField } from "./FormField";
import styles from "./fields.module.scss";

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  error?: string | null;
  onBlur?: () => void;
}

export function TextAreaField({ id, label, value, onChange, placeholder, required, invalid, error, onBlur }: TextAreaFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <textarea
        id={id}
        className={`${styles.textarea} ${invalid ? styles.inputInvalid : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-invalid={invalid}
      />
    </FormField>
  );
}
