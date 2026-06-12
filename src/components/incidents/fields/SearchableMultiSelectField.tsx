"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { FormField } from "./FormField";
import styles from "./fields.module.scss";

export interface SearchableMultiSelectOption {
  value: string;
  label: string;
  color?: string;
  avatarUrl?: string;
}

interface SearchableMultiSelectFieldProps {
  label: string;
  options: SearchableMultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export function SearchableMultiSelectField({ label, options, selected, onChange, placeholder }: SearchableMultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOptions = options.filter((option) => selected.includes(option.value));
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <FormField label={label}>
      <div
        className={styles.comboboxWrapper}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <div className={`${styles.comboboxInputRow} ${styles.comboboxInputRowPadded}`} onClick={() => setOpen(true)}>
          {selectedOptions.map((option) => (
            <span key={option.value} className={styles.chip}>
              {option.label}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={(event) => {
                  event.stopPropagation();
                  toggle(option.value);
                }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            className={styles.comboboxInlineInput}
            value={query}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            onFocus={() => setOpen(true)}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {!open && <ChevronDown size={14} className={styles.comboboxChevron} />}

        {open && (
          <ul className={styles.comboboxPanel}>
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`${styles.comboboxOption} ${isSelected ? styles.comboboxOptionSelected : ""}`}
                    onClick={() => toggle(option.value)}
                  >
                    {option.avatarUrl && <img className={styles.avatar} src={option.avatarUrl} alt="" />}
                    {option.color && <span className={styles.colorDot} style={{ backgroundColor: option.color }} />}
                    <span>{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FormField>
  );
}
