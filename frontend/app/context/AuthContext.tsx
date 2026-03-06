"use client";

/**
 * AuthContext
 *
 * Provides global auth state (user, accessToken, isLoading) and
 * exposes login / register / logout actions to the entire app.
 *
 * Token storage strategy:
 *  - Access token: in-memory via tokenStore (not persisted — cleared on tab close)
 *  - Refresh token: httpOnly cookie managed by the backend
 *
 * On mount, a silent refresh is attempted so users with a valid refresh-token
 * cookie stay logged in across page reloads.
 */

import { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/lib/authService";
import { tokenStore } from "@/app/lib/apiClient";
import { AuthState, AuthUser, LoginRequest, RegisterRequest } from "@/app/types/auth";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function userFromToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return {
    email: (payload.sub ?? payload.email ?? "") as string,
    username: (payload.username ?? "") as string,
  };
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  });

  useEffect(() => {
    const attemptSilentRefresh = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.accessToken) {
            tokenStore.set(data.accessToken);
            setState({
              user: userFromToken(data.accessToken),
              accessToken: data.accessToken,
              isLoading: false,
            });
            return;
          }
        }
      } catch {
        // No refresh token cookie — user is not logged in
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    attemptSilentRefresh();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const data = await authService.login(credentials);
    setState({ user: userFromToken(data.accessToken), accessToken: data.accessToken, isLoading: false });
    router.push("/");
  }, [router]);

  const register = useCallback(async (payload: RegisterRequest) => {
    const data = await authService.register(payload);
    setState({ user: userFromToken(data.accessToken), accessToken: data.accessToken, isLoading: false });
    router.push("/");
  }, [router]);

  const logout = useCallback(() => {
    authService.logout();
    setState({ user: null, accessToken: null, isLoading: false });
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
