import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { operationsService } from "./operations.service"

export const operationsQueries = {
  findById: (id: string) =>
    queryOptions({
      queryKey: ["operations", id],
      queryFn: () => operationsService.findById(id),
    }),
}

export function useOperation(id: string) {
  return useSuspenseQuery(operationsQueries.findById(id))
}