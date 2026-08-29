import { api } from "@/lib/api"
import type { CreateOperationInput, Operation, OperationWithSummary } from "./types/operation.types"

export const operationsService = {
  create: async (data: CreateOperationInput) => {
    const response = await api.post<OperationWithSummary>("/operations", data)

    return response.data;
  },

  findById: async (id: string) => {
    const response = await api.get<Operation>(`/operations/${id}`)

    return response.data
  },
}