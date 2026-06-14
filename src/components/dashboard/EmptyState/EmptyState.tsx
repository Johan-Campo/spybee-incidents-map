import type { LucideIcon } from "lucide-react";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <Icon size={24} />
      <span>{message}</span>
    </div>
  );
}
