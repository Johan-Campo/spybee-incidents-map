import { FormField } from "./FormField";
import styles from "./fields.module.scss";

export interface MultiSelectOption {
  value: string;
  label: string;
  color?: string;
  avatarUrl?: string;
}

interface MultiSelectFieldProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export function MultiSelectField({ label, options, selected, onChange, placeholder }: MultiSelectFieldProps) {
  const selectedOptions = options.filter((option) => selected.includes(option.value));

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <FormField label={label}>
      <details className={styles.multiSelect}>
        <summary className={styles.multiSelectSummary}>
          {selectedOptions.length > 0 ? (
            <span className={styles.chips}>
              {selectedOptions.map((option) => (
                <span key={option.value} className={styles.chip}>
                  {option.label}
                </span>
              ))}
            </span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </summary>
        <ul className={styles.multiSelectPanel}>
          {options.map((option) => (
            <li key={option.value}>
              <label className={styles.optionRow}>
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                {option.avatarUrl && <img className={styles.avatar} src={option.avatarUrl} alt="" />}
                {option.color && <span className={styles.colorDot} style={{ backgroundColor: option.color }} />}
                <span>{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </details>
    </FormField>
  );
}
