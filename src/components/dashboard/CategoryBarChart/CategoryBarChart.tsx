import type { CategoryCount } from "@/lib/dashboardMetrics";
import styles from "./CategoryBarChart.module.scss";

interface CategoryBarChartProps {
  title: string;
  categories: CategoryCount[];
}

export function CategoryBarChart({ title, categories }: CategoryBarChartProps) {
  const maxValue = Math.max(...categories.map((category) => category.value), 1);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id} className={styles.row}>
            <span className={styles.label}>{category.name}</span>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ width: `${(category.value / maxValue) * 100}%`, backgroundColor: category.color }}
              />
            </div>
            <span className={styles.value}>{category.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
