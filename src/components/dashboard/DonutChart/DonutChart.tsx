import styles from "./DonutChart.module.scss";

interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  segments: DonutChartSegment[];
}

const SIZE = 120;
const STROKE_WIDTH = 16;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({ title, segments }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let offset = 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.total}>{total}</span>
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className={styles.chart}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#f0f0f0" strokeWidth={STROKE_WIDTH} />
          {total > 0 &&
            segments
              .filter((segment) => segment.value > 0)
              .map((segment) => {
                const length = (segment.value / total) * CIRCUMFERENCE;
                const dashOffset = CIRCUMFERENCE - offset;
                offset += length;
                return (
                  <circle
                    key={segment.label}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  />
                );
              })}
        </svg>

        <ul className={styles.legend}>
          {segments.map((segment) => (
            <li key={segment.label} className={styles.legendItem}>
              <span className={styles.dot} style={{ backgroundColor: segment.color }} />
              <span className={styles.legendLabel}>{segment.label}</span>
              <span className={styles.legendValue}>{segment.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
