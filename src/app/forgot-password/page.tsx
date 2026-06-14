"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthLayout } from "@/components/auth/AuthLayout/AuthLayout";
import cardStyles from "@/components/auth/AuthCard/AuthCard.module.scss";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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
              <MailCheck size={24} />
            </span>
            <h1 className={cardStyles.successTitle}>Revisa tu bandeja de entrada</h1>
            <p className={cardStyles.successText}>
              Si <strong>{email}</strong> está asociado a una cuenta, te enviamos un enlace para restablecer tu
              contraseña. (Demo: no se envía ningún correo real).
            </p>
            <Link href="/login" className={cardStyles.backLink}>
              <ArrowLeft size={16} />
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form className={cardStyles.card} onSubmit={handleSubmit}>
            <img src="/brand/logo1.avif" alt="Spybee" className={cardStyles.formLogo} />

            <div className={cardStyles.intro}>
              <h1 className={cardStyles.title}>¿Olvidaste tu contraseña?</h1>
              <p className={cardStyles.subtitle}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
              </p>
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

            <button type="submit" className={cardStyles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className={cardStyles.spinner} />
                  Enviando...
                </>
              ) : (
                "Enviar instrucciones"
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
