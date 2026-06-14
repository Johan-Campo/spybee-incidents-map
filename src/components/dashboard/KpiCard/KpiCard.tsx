import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
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
  sparkline?: number[];
  critical?: boolean;
}

const DELTA_ICONS: Record<KpiDelta["direction"], LucideIcon> = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

export function KpiCard({ icon: Icon, label, value, accentColor, subtitle, delta, sparkline, critical }: KpiCardProps) {
  const DeltaIcon = delta ? DELTA_ICONS[delta.direction] : null;
  const sparklineData = sparkline?.map((value, index) => ({ index, value }));

  return (
    <div className={`${styles.card} ${critical ? styles.critical : ""}`} style={{ borderLeftColor: accentColor }}>
      <div className={styles.row}>
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
      {sparklineData && sparklineData.length > 1 && (
        <div className={styles.sparkline}>
          <ResponsiveContainer width="100%" height={28}>
            <AreaChart data={sparklineData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.15}
                strokeWidth={1.5}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
