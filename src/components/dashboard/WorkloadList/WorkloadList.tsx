import type { WorkloadEntry } from "@/lib/dashboardMetrics";
import styles from "./WorkloadList.module.scss";

interface WorkloadListProps {
  title: string;
  entries: WorkloadEntry[];
}

export function WorkloadList({ title, entries }: WorkloadListProps) {
  const maxValue = Math.max(...entries.map((entry) => entry.openCount), 1);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      {entries.length === 0 ? (
        <p className={styles.empty}>Sin incidencias asignadas.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.row}>
              <img src={entry.avatarUrl} alt="" className={styles.avatar} />
              <span className={styles.name}>{entry.name}</span>
              <div className={styles.track}>
                <div className={styles.bar} style={{ width: `${(entry.openCount / maxValue) * 100}%` }} />
              </div>
              <span className={styles.value}>{entry.openCount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
