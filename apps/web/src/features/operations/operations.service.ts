import { api } from "@/lib/api"
import type { CreateOperationInput, OperationWithSummary } from "./types/operation.types"

export const operationsService = {
  create: async (data: CreateOperationInput) => {
    const response = await api.post<OperationWithSummary>("/operations", data)

    return response.data;
  },
}