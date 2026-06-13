"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import type { TagCount } from "@/lib/dashboardMetrics";
import styles from "./TagTreemap.module.scss";

interface TagTreemapProps {
  title: string;
  tags: TagCount[];
}

interface TreemapContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  color?: string;
}

function TreemapCell({ x = 0, y = 0, width = 0, height = 0, name, value, color }: TreemapContentProps) {
  const showLabel = width > 60 && height > 32;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} stroke="#fff" strokeWidth={2} rx={4} />
      {showLabel && (
        <text x={x + 8} y={y + 20} fill="#fff" fontSize={12} fontWeight={600}>
          {name}
        </text>
      )}
      {showLabel && (
        <text x={x + 8} y={y + 38} fill="#fff" fontSize={11} opacity={0.85}>
          {value}
        </text>
      )}
    </g>
  );
}

export function TagTreemap({ title, tags }: TagTreemapProps) {
  const data = tags.map((tag) => ({ name: tag.name, value: tag.value, color: tag.color }));

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            stroke="#fff"
            isAnimationActive
            animationDuration={600}
            content={<TreemapCell />}
          >
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
