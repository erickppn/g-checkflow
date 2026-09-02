import { api } from "@/lib/api"
import type {
  Check,
  ChecksListResponse,
  GetChecksParams,
  ReturnCheckInput,
  UpdateCheckInput,
} from "./types/check.types"

export const checksService = {
  update: async (id: string, data: UpdateCheckInput) => {
    const response = await api.patch<Check>(
      `/checks/${id}`,
      data
    )

    return response.data
  },

  compensate: async (id: string) => {
    const response = await api.patch<{
      check: Check,
      operation: { closedAt: string | null }
    }>(
      `/checks/${id}/compensate`
    )

    return response.data
  },

  returnCheck: async (id: string, data: ReturnCheckInput) => {
    const response = await api.patch<{
      check: Check,
      operation: { closedAt: string | null }
    }>(
      `/checks/${id}/return`,
      data
    )

    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete<{ operationId: string, closedAt: string | null }>(
      `/checks/${id}`,
    );

    return response.data;
  },

  getAll: async (params: GetChecksParams) => {
    const response = await api.get<ChecksListResponse>(
      "/checks",
      {
        params,
      },
    )

    return response.data
  },
}