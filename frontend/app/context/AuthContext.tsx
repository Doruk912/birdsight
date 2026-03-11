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
 *
 * User profile data (avatarUrl, displayName, bio, etc.) is read directly from
 * the `user` object that the backend includes in every AuthResponse — NOT from
 * JWT claims. This guarantees the data is always fresh from the database.
 */

import { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/lib/authService";
import { tokenStore } from "@/app/lib/apiClient";
import { AuthResponse, AuthState, AuthUser, LoginRequest, RegisterRequest } from "@/app/types/auth";

/** Maps the UserResponse nested in AuthResponse to our client-side AuthUser shape. */
function userFromResponse(response: AuthResponse): AuthUser | null {
  const u = response.user;
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    displayName: u.displayName || undefined,
    bio: u.bio || undefined,
    avatarUrl: u.avatarUrl || undefined,
  };
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
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
          const data: AuthResponse = await res.json();
          if (data?.accessToken) {
            tokenStore.set(data.accessToken);
            setState({
              user: userFromResponse(data),
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
    setState({ user: userFromResponse(data), accessToken: data.accessToken, isLoading: false });
    router.push("/");
  }, [router]);

  const register = useCallback(async (payload: RegisterRequest) => {
    const data = await authService.register(payload);
    setState({ user: userFromResponse(data), accessToken: data.accessToken, isLoading: false });
    router.push("/");
  }, [router]);

  const logout = useCallback(() => {
    authService.logout();
    setState({ user: null, accessToken: null, isLoading: false });
    router.push("/");
  }, [router]);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...partial } : prev.user,
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
