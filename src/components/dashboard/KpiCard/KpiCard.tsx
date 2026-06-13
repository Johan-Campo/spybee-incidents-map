import type { LucideIcon } from "lucide-react";
import styles from "./KpiCard.module.scss";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accentColor: string;
}

export function KpiCard({ icon: Icon, label, value, accentColor }: KpiCardProps) {
  return (
    <div className={styles.card} style={{ borderLeftColor: accentColor }}>
      <div className={styles.iconWrapper} style={{ color: accentColor }}>
        <Icon size={18} />
      </div>
      <div className={styles.text}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
