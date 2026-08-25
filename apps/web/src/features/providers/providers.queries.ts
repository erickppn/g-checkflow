import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { providersService } from "./providers.service";

export const providersQueries = {
  all: () => queryOptions({
    queryKey: ["providers"],
    queryFn: providersService.getAll
  }),

  findById: (id: number) => queryOptions({
    queryKey: ["providers", id],
    queryFn: () => providersService.findById(id)
  })
}

export function useProviders() {
  return useSuspenseQuery(providersQueries.all())
}

export function useProvider(id: number) {
  return useSuspenseQuery(providersQueries.findById(id));
}