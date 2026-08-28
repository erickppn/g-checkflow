import { queryOptions, useQuery } from "@tanstack/react-query";
import { issuersService } from "./issuers.service";
import { useDebounce } from "@/hooks/use-debounce";

export const issuersQueries = {
  search: (search: string) => queryOptions({
    queryKey: ["issuers", "search", search],
    queryFn: () => issuersService.getAll(search),
  }),
};

export function useIssuers(search: string) {
  const debouncedSearch = useDebounce(search);

  return useQuery({
    ...issuersQueries.search(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });
}