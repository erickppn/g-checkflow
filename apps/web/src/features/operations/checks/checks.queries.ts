import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { checksService } from "./checks.service";
import type { GetChecksParams } from "./types/check.types";
import { useDebounce } from "@/hooks/use-debounce";

export const checksQueries = {
  all: (params: GetChecksParams) =>
    queryOptions({
      queryKey: ["checks", params],
      queryFn: () => checksService.getAll(params),
    }),
};

export function useChecks(params: GetChecksParams) {
  const debouncedSearch = useDebounce(params.search ?? "");

  return useQuery({
    ...checksQueries.all({
      ...params,
      search: debouncedSearch,
    }),

    placeholderData: keepPreviousData
  });
}