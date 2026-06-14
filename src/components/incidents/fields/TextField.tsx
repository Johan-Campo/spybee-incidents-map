import { FormField } from "./FormField";
import styles from "./fields.module.scss";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "date" | "number";
  invalid?: boolean;
  error?: string | null;
  onBlur?: () => void;
}

export function TextField({ id, label, value, onChange, placeholder, required, type = "text", invalid, error, onBlur }: TextFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <input
        id={id}
        type={type}
        className={`${styles.input} ${invalid ? styles.inputInvalid : ""}`}
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
