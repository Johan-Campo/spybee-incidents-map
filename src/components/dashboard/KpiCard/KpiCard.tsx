import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";
import styles from "./KpiCard.module.scss";

export interface KpiDelta {
  text: string;
  direction: "up" | "down" | "neutral";
}

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accentColor: string;
  subtitle?: string;
  delta?: KpiDelta;
}

const DELTA_ICONS: Record<KpiDelta["direction"], LucideIcon> = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

export function KpiCard({ icon: Icon, label, value, accentColor, subtitle, delta }: KpiCardProps) {
  const DeltaIcon = delta ? DELTA_ICONS[delta.direction] : null;

  return (
    <div className={styles.card} style={{ borderLeftColor: accentColor }}>
      <div className={styles.iconWrapper} style={{ color: accentColor }}>
        <Icon size={18} />
      </div>
      <div className={styles.text}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        {delta && DeltaIcon && (
          <span className={`${styles.delta} ${styles[delta.direction]}`}>
            <DeltaIcon size={12} />
            {delta.text}
          </span>
        )}
      </div>
    </div>
  );
}
