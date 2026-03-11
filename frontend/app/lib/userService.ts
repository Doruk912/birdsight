import { apiClient } from "@/app/lib/apiClient";

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

export const userService = {
  getByUsername: async (username: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/api/v1/users/username/${username}`);
  },

  uploadAvatar: async (file: File): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<UserResponse>("/api/v1/users/me/avatar", formData);
  },

  deleteAvatar: async (): Promise<UserResponse> => {
    return apiClient.delete<UserResponse>("/api/v1/users/me/avatar");
  },
};
