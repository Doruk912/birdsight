/**
 * authService
 *
 * All authentication-related API calls. Components never call fetch directly —
 * they go through this service, keeping the API contract in one place.
 */

import { apiClient, tokenStore } from "@/app/lib/apiClient";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/app/types/auth";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>("/api/auth/login", credentials, { skipAuth: true });
    tokenStore.set(data.accessToken);
    return data;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>("/api/auth/register", payload, { skipAuth: true });
    tokenStore.set(data.accessToken);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/api/auth/logout", {}, { skipAuth: true });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      tokenStore.clear();
    }
  },
};
