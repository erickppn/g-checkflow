import { api } from "@/lib/api";
import type { ProviderWithOperationsCount } from "./provider.types";

export const providersService = {
  getAll: async () => {
    const response = await api.get<ProviderWithOperationsCount[]>(
      "/providers"
    )

    return response.data;
  }
}