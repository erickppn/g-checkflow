import { api } from "@/lib/api";
import type { LoginInput, LoginResponse, User } from "./types/auth.types";

export const authService = {
  login: async (data: LoginInput) => {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get<User>("/auth/me");

    return response.data;
  },

  async logout() {
    const response = await api.post("/auth/logout");

    return response.data;
  }
};