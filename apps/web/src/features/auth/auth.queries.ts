import { queryOptions } from "@tanstack/react-query";

import { authService } from "./auth.service";

export const authQueries = {
  currentUser: () =>
    queryOptions({
      queryKey: ["auth-user"],
      queryFn: authService.getCurrentUser,
      retry: false,
    }),
};