"use client";

import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";

/**
 * useAuth
 *
 * Consumes AuthContext. Throws if used outside of <AuthProvider> so
 * misuse is caught immediately during development.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
