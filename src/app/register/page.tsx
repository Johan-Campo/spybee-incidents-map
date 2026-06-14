"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Info, Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthLayout } from "@/components/auth/AuthLayout/AuthLayout";
import cardStyles from "@/components/auth/AuthCard/AuthCard.module.scss";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  }

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        {isSubmitted ? (
          <div className={cardStyles.card}>
            <span className={cardStyles.successIcon}>
              <CheckCircle2 size={24} />
            </span>
            <h1 className={cardStyles.successTitle}>Cuenta creada (demo)</h1>
            <p className={cardStyles.successText}>
              Esta cuenta fue creada solo con fines de demostración y no queda registrada. En este modo demo, únicamente
              el usuario <strong>administrador</strong> puede iniciar sesión.
            </p>
            <Link href="/login" className={cardStyles.backLink}>
              <ArrowLeft size={16} />
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form className={cardStyles.card} onSubmit={handleSubmit}>
            <Image src="/brand/logo1.avif" alt="Spybee" width={81} height={40} className={cardStyles.formLogo} />

            <div className={cardStyles.intro}>
              <h1 className={cardStyles.title}>Crear cuenta</h1>
              <p className={cardStyles.subtitle}>Regístrate para acceder al mapa e incidencias de tu proyecto.</p>
            </div>

            <div className={cardStyles.banner}>
              <Info size={16} className={cardStyles.bannerIcon} />
              <span>
                Modo demo: este formulario es solo una demostración visual. Únicamente el usuario administrador puede
                iniciar sesión.
              </span>
            </div>

            <label className={cardStyles.field}>
              <span className={cardStyles.label}>Nombre completo</span>
              <input
                type="text"
                className={cardStyles.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre"
                required
              />
            </label>

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

            <label className={cardStyles.field}>
              <span className={cardStyles.label}>Confirmar contraseña</span>
              <input
                type={showPassword ? "text" : "password"}
                className={cardStyles.input}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className={cardStyles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className={cardStyles.spinner} />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>

            <Link href="/login" className={cardStyles.backLink}>
              <ArrowLeft size={16} />
              Volver a iniciar sesión
            </Link>
          </form>
        )}
      </AuthLayout>
    </AuthGuard>
  );
}
