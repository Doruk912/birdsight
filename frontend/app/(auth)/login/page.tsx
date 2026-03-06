"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { ApiError } from "@/app/lib/apiClient";
import AuthCard from "@/app/components/auth/AuthCard";
import FormField from "@/app/components/auth/FormField";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Client-side validation ─────────────────────────────────────────────────
  function validate(): boolean {
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = "Email or username is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({ identifier: identifier.trim(), password });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 401
            ? "Incorrect email/username or password."
            : err.message
          : "Something went wrong. Please try again.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your BirdSight account"
      footerText="Don't have an account?"
      footerLinkLabel="Join free"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          label="Email or username"
          type="text"
          autoComplete="username"
          placeholder="you@example.com or alex_birder"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
        />

        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {/* Form-level error */}
        {errors.form && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors duration-200 text-sm"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>Sign in <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </AuthCard>
  );
}


