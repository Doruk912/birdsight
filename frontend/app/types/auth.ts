// ── Request DTOs ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// ── Response DTOs ─────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUserResponse;
}

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Client-side auth state ────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
}
