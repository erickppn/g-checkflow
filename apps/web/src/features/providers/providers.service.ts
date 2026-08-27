import { api } from "@/lib/api";
import { type Provider, type CreateProviderInput, type ProviderWithOperationsCount, type UpdateProviderInput } from "./types/provider.types";

export const providersService = {
  getAll: async () => {
    const response = await api.get<ProviderWithOperationsCount[]>(
      "/providers"
    )

    return response.data;
  },

  create: async (data: CreateProviderInput) => {
    const response = await api.post("/providers", data);

    return response.data;
  },

  findById: async (id: string) => {
    const response = await api.get<Provider>(`/providers/${id}`);

    return response.data;
  },

  update: async (id: string, data: UpdateProviderInput) => {
    const response = await api.patch(`/providers/${id}`, data);

    return response.data;
  }
}