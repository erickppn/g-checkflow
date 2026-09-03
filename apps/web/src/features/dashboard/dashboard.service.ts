import { api } from "@/lib/api";
import type { DashboardResponse } from "./types/dashboard.types";

export const dashboardService = {
  get: async () => {
    const response = await api.get<DashboardResponse>(
      "/dashboard",
    );

    return response.data;
  },
};