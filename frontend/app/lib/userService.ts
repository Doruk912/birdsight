import { apiClient } from "@/app/lib/apiClient";
import { UserSearchResult } from "@/app/types/explore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  suspended: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  email?: string;
  username?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  getByUsername: async (username: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/api/v1/users/username/${username}`);
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    return apiClient.put<UserResponse>("/api/v1/users/me", data);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return apiClient.put<void>("/api/v1/users/me/password", data);
  },

  uploadAvatar: async (file: File): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<UserResponse>(
      "/api/v1/users/me/avatar",
      formData,
    );
  },

  deleteAvatar: async (): Promise<UserResponse> => {
    return apiClient.delete<UserResponse>("/api/v1/users/me/avatar");
  },

  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    if (!query || query.trim().length === 0) return [];
    const response = await fetch(
      `${API_BASE}/api/v1/users/search?q=${encodeURIComponent(query.trim())}&size=10`,
      { cache: "no-store" },
    );
    if (!response.ok) return [];
    return response.json();
  },
};
