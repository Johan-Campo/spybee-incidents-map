"use client";

import { useId, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
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
  const inputId = useId();
  const listId = `${inputId}-listbox`;

  const selectedOptions = options.filter((option) => selected.includes(option.value));
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <FormField label={label} htmlFor={inputId}>
      <div
        className={styles.comboboxWrapper}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <div className={`${styles.comboboxInputRow} ${styles.comboboxInputRowPadded}`} onClick={() => setOpen(true)}>
          {selectedOptions.map((option) => (
            <span key={option.value} className={styles.chip}>
              {option.avatarUrl ? (
                <Image className={styles.avatar} src={option.avatarUrl} alt="" width={16} height={16} />
              ) : (
                option.color && <span className={styles.colorDot} style={{ backgroundColor: option.color }} />
              )}
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
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            className={styles.comboboxInlineInput}
            value={query}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            onFocus={() => setOpen(true)}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {!open && <ChevronDown size={14} className={styles.comboboxChevron} />}

        {open && (
          <div className={styles.comboboxPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelHeaderLabel}>{label}</span>
              <button type="button" className={styles.panelCloseButton} onClick={() => setOpen(false)} aria-label="Cerrar">
                <X size={14} />
              </button>
            </div>
            {filteredOptions.length === 0 ? (
              <p className={styles.comboboxEmpty}>Sin resultados</p>
            ) : (
              <ul id={listId} role="listbox" aria-multiselectable="true" className={styles.comboboxList}>
                {filteredOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <li key={option.value} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        className={`${styles.comboboxOption} ${isSelected ? styles.comboboxOptionSelected : ""}`}
                        onClick={() => toggle(option.value)}
                      >
                        {option.avatarUrl && <Image className={styles.avatar} src={option.avatarUrl} alt="" width={20} height={20} />}
                        {option.color && <span className={styles.colorDot} style={{ backgroundColor: option.color }} />}
                        <span>{option.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}
