import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { providersService } from "./providers.service";

export const providersQueries = {
  all: () => queryOptions({
    queryKey: ["providers"],
    queryFn: providersService.getAll
  })
}

export function useProviders() {
  return useSuspenseQuery(providersQueries.all())
}