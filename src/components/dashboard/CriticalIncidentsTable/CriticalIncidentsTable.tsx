"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react";
import { formatDueLabel, type CriticalIncident } from "@/lib/dashboardMetrics";
import { PRIORITY_OPTIONS } from "@/lib/incidentOptions";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/dashboardMetrics";
import styles from "./CriticalIncidentsTable.module.scss";

export interface TableFilter {
  label: string;
  color: string;
}

interface CriticalIncidentsTableProps {
  incidents: CriticalIncident[];
  totalCount: number;
  filter?: TableFilter | null;
  onClearFilter?: () => void;
}

type SortKey = "priority" | "due";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;
const PRIORITY_MAP = new Map(PRIORITY_OPTIONS.map((option) => [option.value, option]));
const PRIORITY_RANK: Record<CriticalIncident["priority"], number> = { high: 0, medium: 1, low: 2 };

export function CriticalIncidentsTable({ incidents, totalCount, filter, onClearFilter }: CriticalIncidentsTableProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const sortedIncidents = useMemo(() => {
    if (!sort) return incidents;

    const sorted = [...incidents];
    sorted.sort((a, b) => {
      let result = 0;
      if (sort.key === "priority") {
        result = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      } else {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        result = aTime - bTime;
      }
      return sort.direction === "asc" ? result : -result;
    });
    return sorted;
  }, [incidents, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedIncidents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const rows = useMemo(
    () => sortedIncidents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [sortedIncidents, currentPage]
  );

  function toggleSort(key: SortKey) {
    setPage(1);
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  function sortIcon(key: SortKey) {
    if (sort?.key !== key) return null;
    return sort.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) pages.push(i);
    return pages;
  }, [totalPages]);

  function goTo(targetPage: number) {
    setPage(Math.min(Math.max(targetPage, 1), totalPages));
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Críticas para hoy</h3>
        <span className={styles.subtitle}>Alta prioridad o con fecha próxima</span>
        {filter && (
          <button type="button" className={styles.filterChip} style={{ color: filter.color, backgroundColor: `${filter.color}1A` }} onClick={onClearFilter}>
            {filter.label}
            <X size={12} />
          </button>
        )}
        <span className={styles.total}>{incidents.length} de {totalCount}</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th className={styles.sortable} onClick={() => toggleSort("priority")}>
                <span className={styles.sortLabel}>Prioridad {sortIcon("priority")}</span>
              </th>
              <th>Estado</th>
              <th>Asignados</th>
              <th>Creado por</th>
              <th className={styles.sortable} onClick={() => toggleSort("due")}>
                <span className={styles.sortLabel}>Vencimiento {sortIcon("due")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((incident) => {
              const priority = PRIORITY_MAP.get(incident.priority);
              const due = formatDueLabel(incident.dueDate);

              return (
                <tr key={incident.id}>
                  <td className={styles.sequence}>#{incident.sequenceId}</td>
                  <td className={styles.titleCell}>{incident.title}</td>
                  <td>
                    {priority && (
                      <span className={styles.badge} style={{ color: priority.color, backgroundColor: `${priority.color}1A` }}>
                        {priority.label}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{ color: STATUS_COLORS[incident.status], backgroundColor: `${STATUS_COLORS[incident.status]}1A` }}
                    >
                      {STATUS_LABELS[incident.status]}
                    </span>
                  </td>
                  <td>
                    {incident.assignees.length > 0 ? (
                      <div className={styles.avatarStack}>
                        {incident.assignees.slice(0, 3).map((assignee) => (
                          <img key={assignee.id} src={assignee.avatarUrl} alt={assignee.name} title={assignee.name} className={styles.avatar} />
                        ))}
                        {incident.assignees.length > 3 && (
                          <span className={styles.avatarMore}>+{incident.assignees.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className={styles.muted}>--</span>
                    )}
                  </td>
                  <td>
                    {incident.owner ? (
                      <div className={styles.creator}>
                        <img src={incident.owner.avatarUrl} alt={incident.owner.name} className={styles.avatar} />
                        <span className={styles.creatorName}>{incident.owner.name.split(" ")[0]}</span>
                      </div>
                    ) : (
                      <span className={styles.muted}>--</span>
                    )}
                  </td>
                  <td className={due.overdue ? styles.dueOverdue : styles.dueNormal}>{due.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.rangeLabel}>
          {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, incidents.length)} de {incidents.length}
        </span>

        <div className={styles.pageControls}>
          <button type="button" className={styles.pageButton} onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior">
            <ChevronLeft size={14} />
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`${styles.pageButton} ${pageNumber === currentPage ? styles.pageButtonActive : ""}`}
              onClick={() => goTo(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {totalPages > 5 && (
            <>
              <span className={styles.ellipsis}>…</span>
              <button
                type="button"
                className={`${styles.pageButton} ${totalPages === currentPage ? styles.pageButtonActive : ""}`}
                onClick={() => goTo(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button type="button" className={styles.pageButton} onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Página siguiente">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
