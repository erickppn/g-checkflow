import { useQuery } from "@tanstack/react-query";

import { authQueries } from "@/features/auth/auth.queries";

export function useCurrentUser() {
  return useQuery(authQueries.currentUser());
}