import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboard.service";

export const dashboardQueries = {
  all: () =>
    queryOptions({
      queryKey: ["dashboard"],
      queryFn: dashboardService.get,
    }),
};

export function useDashboard() {
  return useSuspenseQuery(dashboardQueries.all());
}