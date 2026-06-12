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
}

export function TextField({ id, label, value, onChange, placeholder, required, type = "text" }: TextFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <input
        id={id}
        type={type}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </FormField>
  );
}
