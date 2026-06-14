import { FormField } from "./FormField";
import styles from "./fields.module.scss";

export interface SelectFieldOption {
  value: string;
  label: string;
  color?: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  placeholder: string;
  required?: boolean;
  invalid?: boolean;
  error?: string | null;
  onBlur?: () => void;
}

export function SelectField({ id, label, value, onChange, options, placeholder, required, invalid, error, onBlur }: SelectFieldProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <div className={styles.selectWrapper}>
        {selectedOption?.color && (
          <span className={styles.colorDot} style={{ backgroundColor: selectedOption.color }} />
        )}
        <select
          id={id}
          className={`${styles.select} ${selectedOption?.color ? styles.selectWithDot : ""} ${invalid ? styles.inputInvalid : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          required={required}
          aria-invalid={invalid}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
}
