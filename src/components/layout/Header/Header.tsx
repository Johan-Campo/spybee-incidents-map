import { ChevronDown, HelpCircle, Smartphone, Sparkles } from "lucide-react";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Sparkles size={18} className={styles.logoIcon} />
        <span>Spybee</span>
      </div>

      <span className={styles.projectName}>Proyecto Onboarding</span>

      <div className={styles.actions}>
        <span className={styles.deviceBadge}>
          <Smartphone size={16} />
        </span>

        <div className={styles.user}>
          <img
            className={styles.avatar}
            src="https://i.pravatar.cc/64?u=johan-superadmin"
            alt="Johan"
          />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Johan</span>
            <span className={styles.userRole}>Superadmin</span>
          </div>
          <ChevronDown size={16} />
        </div>

        <button type="button" className={styles.helpButton} aria-label="Ayuda">
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
}
