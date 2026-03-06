"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { ApiError } from "@/app/lib/apiClient";
import AuthCard from "@/app/components/auth/AuthCard";
import FormField from "@/app/components/auth/FormField";
import PasswordStrengthIndicator from "@/app/components/auth/PasswordStrengthIndicator";
import { ArrowRight, Loader2 } from "lucide-react";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
  }

  // ── Client-side validation ─────────────────────────────────────────────────
  function validate(): boolean {
    const next: FormErrors = {};

    if (!fields.username.trim()) next.username = "Username is required.";
    else if (fields.username.trim().length < 3)
      next.username = "Username must be at least 3 characters.";
    else if (!/^[a-zA-Z0-9_.-]+$/.test(fields.username.trim()))
      next.username = "Only letters, numbers, underscores, dots and hyphens allowed.";

    if (!fields.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = "Enter a valid email address.";

    if (!fields.password) next.password = "Password is required.";
    else if (fields.password.length < 8)
      next.password = "Password must be at least 8 characters.";

    if (!fields.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (fields.password !== fields.confirmPassword)
      next.confirmPassword = "Passwords do not match.";

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
      await register({
        username: fields.username.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const msg = err.message.toLowerCase();
        if (msg.includes("username")) {
          setErrors({ username: "This username is already taken." });
        } else if (msg.includes("email")) {
          setErrors({ email: "An account with this email already exists." });
        } else {
          setErrors({ form: err.message });
        }
      } else if (err instanceof ApiError) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join thousands of birdwatchers on BirdSight"
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="e.g. alex_birder"
          value={fields.username}
          onChange={setField("username")}
          error={errors.username}
        />

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={setField("email")}
          error={errors.email}
        />

        {/* Password + strength indicator grouped together */}
        <div className="flex flex-col gap-2">
          <FormField
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={fields.password}
            onChange={setField("password")}
            error={errors.password}
          />
          <PasswordStrengthIndicator password={fields.password} />
        </div>

        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={fields.confirmPassword}
          onChange={setField("confirmPassword")}
          error={errors.confirmPassword}
        />

        {/* Form-level error (fallback for unexpected errors) */}
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
            <>Create account <ArrowRight size={16} /></>
          )}
        </button>

        <p className="text-center text-xs text-stone-500">
          By creating an account you agree to our{" "}
          <a href="#" className="text-stone-400 hover:text-white transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-stone-400 hover:text-white transition-colors">Privacy Policy</a>.
        </p>
      </form>
    </AuthCard>
  );
}

