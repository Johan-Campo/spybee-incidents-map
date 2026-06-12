"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FormField } from "./FormField";
import styles from "./fields.module.scss";

export interface SearchableSelectOption {
  value: string;
  label: string;
  color?: string;
}

interface SearchableSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder: string;
  required?: boolean;
}

export function SearchableSelectField({ id, label, value, onChange, options, placeholder, required }: SearchableSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  function handleSelect(option: SearchableSelectOption) {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  }

  return (
    <FormField label={label} htmlFor={id} required={required}>
      <div
        className={styles.comboboxWrapper}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <input
          id={id}
          className={`${styles.input} ${styles.comboboxInputPadded}`}
          value={open ? query : selectedOption?.label ?? ""}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => setQuery(event.target.value)}
        />

        {!open && <ChevronDown size={14} className={styles.comboboxChevron} />}

        {open && (
          <ul className={styles.comboboxPanel}>
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button type="button" className={styles.comboboxOption} onClick={() => handleSelect(option)}>
                  {option.color && <span className={styles.colorDot} style={{ backgroundColor: option.color }} />}
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
}
