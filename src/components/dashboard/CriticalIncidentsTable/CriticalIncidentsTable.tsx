"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDueLabel, type CriticalIncident } from "@/lib/dashboardMetrics";
import { PRIORITY_OPTIONS } from "@/lib/incidentOptions";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/dashboardMetrics";
import styles from "./CriticalIncidentsTable.module.scss";

interface CriticalIncidentsTableProps {
  incidents: CriticalIncident[];
}

const PAGE_SIZE = 10;
const PRIORITY_MAP = new Map(PRIORITY_OPTIONS.map((option) => [option.value, option]));

export function CriticalIncidentsTable({ incidents }: CriticalIncidentsTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(incidents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const rows = useMemo(
    () => incidents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [incidents, currentPage]
  );

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
        <span className={styles.total}>{incidents.length} en total</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Asignados</th>
              <th>Creado por</th>
              <th>Vencimiento</th>
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
                    <div className={styles.creator}>
                      <img src={incident.owner.avatarUrl} alt={incident.owner.name} className={styles.avatar} />
                      <span className={styles.creatorName}>{incident.owner.name.split(" ")[0]}</span>
                    </div>
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
