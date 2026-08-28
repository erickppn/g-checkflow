import { mutationOptions, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { issuersService } from "./issuers.service";

export const issuersMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: issuersService.create,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["issuers"],
        })
      }
    }),
};

export function useCreateIssuer() {
  const queryClient = useQueryClient();

  return useMutation(issuersMutations.create(queryClient));
}