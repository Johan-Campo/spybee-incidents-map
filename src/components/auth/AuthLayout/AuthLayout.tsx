import type { ReactNode } from "react";
import Image from "next/image";
import { BrainCircuit, Camera, Drone, MessageCircle } from "lucide-react";
import { DroneSwarm } from "@/components/auth/DroneSwarm/DroneSwarm";
import styles from "./AuthLayout.module.scss";

const features = [
  { icon: Camera, label: "Cámaras 360° y time-lapse" },
  { icon: Drone, label: "Captura aérea con drones" },
  { icon: MessageCircle, label: "Reportes vía WhatsApp" },
  { icon: BrainCircuit, label: "IA que anticipa riesgos" },
];

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <Image src="/brand/logo2.avif" alt="" width={985} height={900} className={styles.beeWatermark} />
        <DroneSwarm />

        <div className={`${styles.brandLogo} ${styles.fadeInUp}`}>
          <Image src="/brand/logo2.avif" alt="" width={31} height={28} className={styles.brandLogoIcon} />
          <span className={styles.lightSweep} style={{ animationDuration: "9s", animationDelay: "-1s" }}>
            Spybee
          </span>
        </div>

        <div className={`${styles.brandCopy} ${styles.fadeInUp}`} style={{ animationDelay: "0.08s" }}>
          <span className={styles.brandEyebrow}>Gestión inteligente de obra</span>
          <h2 className={styles.brandTitle}>
            <span className={styles.lightSweep} style={{ animationDuration: "9s", animationDelay: "0s" }}>
              Controla tu <span className={styles.brandHighlight}>obra</span>.
            </span>
            <br />
            <span className={styles.lightSweep} style={{ animationDuration: "12s", animationDelay: "-3s" }}>
              Entiende su avance.
            </span>
          </h2>
          <p className={styles.brandSubtitle}>
            <span className={styles.lightSweep} style={{ animationDuration: "13s", animationDelay: "-5s" }}>
              Actúa antes de los retrasos y alinea a tu equipo en tiempo real.
            </span>
          </p>

          <ul className={styles.brandFeatures}>
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className={styles.brandFeatureItem}>
                <span className={styles.brandFeatureIconWrap}>
                  <Icon size={16} strokeWidth={1.5} className={styles.brandFeatureIcon} />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.formPanel}>{children}</div>
    </div>
  );
}
