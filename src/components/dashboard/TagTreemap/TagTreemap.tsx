"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { TagCount } from "@/lib/dashboardMetrics";
import styles from "./TagTreemap.module.scss";

interface TagTreemapProps {
  title: string;
  tags: TagCount[];
}

interface TreemapContentProps {
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  color?: string;
}

function TreemapCell({ depth, x = 0, y = 0, width = 0, height = 0, name, value, color }: TreemapContentProps) {
  if (depth !== 1) return null;

  const showLabel = width > 64 && height > 36;
  const showValueOnly = !showLabel && width > 36 && height > 20;

  return (
    <g>
      <rect x={x + 2} y={y + 2} width={Math.max(width - 4, 0)} height={Math.max(height - 4, 0)} fill={color} rx={8} />
      {showLabel && (
        <text x={x + 14} y={y + 26} fill="#fff" fontSize={13} fontWeight={500} letterSpacing={0.2}>
          {name}
        </text>
      )}
      {showLabel && (
        <text x={x + 14} y={y + 46} fill="#fff" fontSize={20} fontWeight={600} opacity={0.92}>
          {value}
        </text>
      )}
      {showValueOnly && (
        <text x={x + width / 2} y={y + height / 2} fill="#fff" fontSize={14} fontWeight={600} textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      )}
    </g>
  );
}

export function TagTreemap({ title, tags }: TagTreemapProps) {
  const data = tags.map((tag) => ({ name: tag.name, value: tag.value, color: tag.color }));
  const total = data.reduce((sum, tag) => sum + tag.value, 0);

  function renderTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
    if (!active || !payload?.length) return null;
    const entry = payload[0].payload as { name: string; value: number };
    const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;

    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltipLabel}>{entry.name}</span>
        <span className={styles.tooltipValue}>{entry.value} incidencias · {pct}% del total</span>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.headerText}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>Incidencias agrupadas por etiqueta. El tamaño de cada bloque refleja su frecuencia.</p>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            isAnimationActive
            animationDuration={600}
            content={<TreemapCell />}
          >
            <Tooltip content={renderTooltip} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
