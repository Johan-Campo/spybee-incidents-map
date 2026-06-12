"use client";

import { useId, useState } from "react";
import { ChevronDown, Minus, Plus, Search, X } from "lucide-react";
import { FormField } from "./FormField";
import type { LocationTag } from "@/lib/locationTags";
import styles from "./fields.module.scss";

interface TreeMultiSelectFieldProps {
  label: string;
  nodes: LocationTag[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

function collectIds(node: LocationTag): string[] {
  return [node.id, ...(node.children ?? []).flatMap(collectIds)];
}

function matchesQuery(node: LocationTag, query: string): boolean {
  if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
  return (node.children ?? []).some((child) => matchesQuery(child, query));
}

function defaultExpandedIds(nodes: LocationTag[]): string[] {
  return nodes.filter((node) => node.children?.length).map((node) => node.id);
}

function flattenNodes(nodes: LocationTag[]): LocationTag[] {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
}

export function TreeMultiSelectField({ label, nodes, selected, onChange, placeholder }: TreeMultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>(() => defaultExpandedIds(nodes));
  const inputId = useId();
  const treeId = `${inputId}-tree`;

  const selectedNodes = flattenNodes(nodes).filter((node) => selected.includes(node.id));

  function removeTag(id: string) {
    onChange(selected.filter((item) => item !== id));
  }

  function toggleExpanded(id: string) {
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleSelection(node: LocationTag) {
    const ids = collectIds(node);
    const allSelected = ids.every((id) => selected.includes(id));
    if (allSelected) {
      onChange(selected.filter((id) => !ids.includes(id)));
    } else {
      onChange([...new Set([...selected, ...ids])]);
    }
  }

  function renderNode(node: LocationTag, depth: number) {
    if (query && !matchesQuery(node, query)) return null;

    const ids = collectIds(node);
    const selectedCount = ids.filter((id) => selected.includes(id)).length;
    const isChecked = selectedCount === ids.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < ids.length;
    const hasChildren = !!node.children?.length;
    const isExpanded = expanded.includes(node.id);

    return (
      <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
        <div className={styles.treeRow} style={{ paddingLeft: depth * 20 }}>
          {hasChildren ? (
            <button
              type="button"
              className={styles.treeToggle}
              aria-label={isExpanded ? `Contraer ${node.name}` : `Expandir ${node.name}`}
              onClick={() => toggleExpanded(node.id)}
            >
              {isExpanded ? <Minus size={10} /> : <Plus size={10} />}
            </button>
          ) : (
            <span className={styles.treeToggleSpacer} />
          )}
          <label className={styles.treeLabel}>
            <input
              type="checkbox"
              checked={isChecked}
              ref={(el) => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onChange={() => toggleSelection(node)}
            />
            <span className={styles.colorDot} style={{ backgroundColor: node.color }} />
            <span>{node.name}</span>
          </label>
        </div>

        {hasChildren && isExpanded && (
          <ul role="group" className={styles.treeChildren}>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
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
          {selectedNodes.map((node) => (
            <span key={node.id} className={styles.chip}>
              {node.name}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={(event) => {
                  event.stopPropagation();
                  removeTag(node.id);
                }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {open && <Search size={14} className={styles.comboboxIcon} />}
          <input
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-controls={treeId}
            className={styles.comboboxInlineInput}
            value={query}
            placeholder={selectedNodes.length === 0 ? placeholder : ""}
            onFocus={() => setOpen(true)}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {!open && <ChevronDown size={14} className={styles.comboboxChevron} />}

        {open && (
          <ul id={treeId} role="tree" aria-label={label} className={`${styles.comboboxPanel} ${styles.treePanel}`}>
            {nodes.map((node) => renderNode(node, 0))}
          </ul>
        )}
      </div>
    </FormField>
  );
}
