"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthLayout } from "@/components/auth/AuthLayout/AuthLayout";
import { CURRENT_USER, DEMO_PASSWORD } from "@/lib/incidentOptions";
import { useAuthStore } from "@/store/authStore";
import cardStyles from "@/components/auth/AuthCard/AuthCard.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = email.trim().toLowerCase() === CURRENT_USER.email.toLowerCase() && password === DEMO_PASSWORD;
    if (!isValid) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      login();
      router.replace("/");
    }, 600);
  }

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <form className={cardStyles.card} onSubmit={handleSubmit}>
          <Image src="/brand/logo1.avif" alt="Spybee" width={81} height={40} className={cardStyles.formLogo} />

          <div className={cardStyles.intro}>
            <h1 className={cardStyles.title}>Iniciar sesión</h1>
            <p className={cardStyles.subtitle}>Accede al mapa e incidencias de tu proyecto.</p>
          </div>

          <label className={cardStyles.field}>
            <span className={cardStyles.label}>Correo electrónico</span>
            <input
              type="email"
              className={cardStyles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@constructora.com"
              required
            />
          </label>

          <label className={cardStyles.field}>
            <span className={cardStyles.label}>Contraseña</span>
            <div className={cardStyles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={cardStyles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={cardStyles.togglePassword}
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className={cardStyles.footerLinks}>
            <Link href="/register" className={cardStyles.link}>
              Crear cuenta
            </Link>
            <Link href="/forgot-password" className={cardStyles.linkMuted}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && (
            <p className={cardStyles.errorMessage}>
              <AlertCircle size={14} />
              {error}
            </p>
          )}

          <button type="submit" className={cardStyles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className={cardStyles.spinner} />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </AuthLayout>
    </AuthGuard>
  );
}
