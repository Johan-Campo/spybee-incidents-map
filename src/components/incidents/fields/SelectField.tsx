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
}

export function SelectField({ id, label, value, onChange, options, placeholder, required }: SelectFieldProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <FormField label={label} htmlFor={id} required={required}>
      <div className={styles.selectWrapper}>
        {selectedOption?.color && (
          <span className={styles.colorDot} style={{ backgroundColor: selectedOption.color }} />
        )}
        <select
          id={id}
          className={`${styles.select} ${selectedOption?.color ? styles.selectWithDot : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
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
