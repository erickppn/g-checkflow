import { api } from "@/lib/api";
import type { CreateIssuerInput, Issuer } from "./types/issuers.types";

export const issuersService = {
  getAll: async (search?: string) => {
    const response = await api.get<Issuer[]>("/issuers", {
      params: {
        search,
      },
    });

    return response.data;
  },

  create: async (data: CreateIssuerInput) => {
    const response = await api.post<Issuer>("/issuers", data);

    return response.data;
  },
};

