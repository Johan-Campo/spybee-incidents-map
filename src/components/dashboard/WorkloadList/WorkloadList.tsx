import { Users } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/dashboard/EmptyState/EmptyState";
import type { RankedEntry } from "@/lib/dashboardMetrics";
import styles from "./WorkloadList.module.scss";

interface WorkloadListProps {
  title: string;
  subtitle?: string;
  entries: RankedEntry[];
}

export function WorkloadList({ title, subtitle, entries }: WorkloadListProps) {
  const maxValue = Math.max(...entries.map((entry) => entry.value), 1);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={Users} message="Sin datos disponibles" />
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.row}>
              <Image src={entry.avatarUrl} alt="" title={entry.name} width={28} height={28} className={styles.avatar} />
              <div className={styles.info}>
                <span className={styles.name} title={entry.name}>{entry.name}</span>
                <div className={styles.track}>
                  <div className={styles.bar} style={{ width: `${(entry.value / maxValue) * 100}%` }} />
                </div>
              </div>
              <div className={styles.valueGroup}>
                <span className={styles.value}>
                  {entry.value}
                  <span className={styles.valueMax}>/{maxValue}</span>
                </span>
                {entry.meta && <span className={styles.meta}>{entry.meta}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
