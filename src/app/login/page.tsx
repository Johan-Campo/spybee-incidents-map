"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/store/authStore";
import styles from "./page.module.scss";

const STATS = [
  { value: "50+", label: "Ciudades en toda la región" },
  { value: "500+", label: "Proyectos completados en Latinoamérica" },
  { value: "1200+", label: "Clientes confiando en nuestra plataforma" },
  { value: "8", label: "Países con presencia activa" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login();
    router.replace("/");
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className={styles.page}>
        <div className={styles.brandPanel}>
          <img src="/brand/logo2.avif" alt="" className={styles.beeWatermark} />

          <div className={styles.brandLogo}>
            <img src="/brand/logo2.avif" alt="" className={styles.brandLogoIcon} />
            <span>Spybee</span>
          </div>

          <div className={styles.brandCopy}>
            <h2 className={styles.brandTitle}>
              Controla tu obra.
              <br />
              Entiende su avance.
            </h2>
            <p className={styles.brandSubtitle}>
              Actúa antes de los retrasos. Integra datos de drones, cámaras 360°, time-lapse y WhatsApp, con IA que
              anticipa riesgos y alinea a tu equipo en tiempo real.
            </p>
          </div>

          <dl className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.formPanel}>
          <form className={styles.card} onSubmit={handleSubmit}>
            <img src="/brand/logo1.avif" alt="Spybee" className={styles.formLogo} />

            <div className={styles.intro}>
              <h1 className={styles.title}>Iniciar sesión</h1>
              <p className={styles.subtitle}>Accede al mapa e incidencias de tu proyecto.</p>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Correo electrónico</span>
              <input
                type="email"
                className={styles.input}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@constructora.com"
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Contraseña</span>
              <input
                type="password"
                className={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className={styles.submitButton}>
              Iniciar sesión
            </button>

            <p className={styles.demoHint}>Modo demo: cualquier correo y contraseña funcionan.</p>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
