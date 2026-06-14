import type { ReactNode } from "react";
import { DroneSwarm } from "@/components/login/DroneSwarm/DroneSwarm";
import styles from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <img src="/brand/logo2.avif" alt="" className={styles.beeWatermark} />
        <DroneSwarm />

        <div className={`${styles.brandLogo} ${styles.fadeInUp}`}>
          <img src="/brand/logo2.avif" alt="" className={styles.brandLogoIcon} />
          <span className={styles.lightSweep} style={{ animationDuration: "9s", animationDelay: "-1s" }}>
            Spybee
          </span>
        </div>

        <div className={`${styles.brandCopy} ${styles.fadeInUp}`} style={{ animationDelay: "0.08s" }}>
          <h2 className={styles.brandTitle}>
            <span className={styles.lightSweep} style={{ animationDuration: "9s", animationDelay: "0s" }}>
              Controla tu obra.
            </span>
            <br />
            <span className={styles.lightSweep} style={{ animationDuration: "12s", animationDelay: "-3s" }}>
              Entiende su avance.
            </span>
          </h2>
          <p className={styles.brandSubtitle}>
            <span className={styles.lightSweep} style={{ animationDuration: "13s", animationDelay: "-5s" }}>
              Actúa antes de los retrasos.
            </span>{" "}
            <span className={styles.lightSweep} style={{ animationDuration: "13s", animationDelay: "-4s" }}>
              Integra datos de drones, cámaras 360°,
            </span>{" "}
            <span className={styles.lightSweep} style={{ animationDuration: "13s", animationDelay: "-3s" }}>
              time-lapse y WhatsApp,
            </span>{" "}
            <span className={styles.lightSweep} style={{ animationDuration: "13s", animationDelay: "-2s" }}>
              con IA que anticipa riesgos y alinea a tu equipo en tiempo real.
            </span>
          </p>
        </div>
      </div>

      <div className={styles.formPanel}>{children}</div>
    </div>
  );
}
