import { mutationOptions, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { providersService } from "./providers.service";
import { providersQueries } from "./providers.queries";
import type { UpdateProviderInput } from "./provider.types";

type UpdateProviderPayload = {
  id: number;
  data: UpdateProviderInput;
};

export const providersMutations = {
  create: (queryClient: QueryClient) => mutationOptions({
    mutationKey: ["providers"],
    mutationFn: providersService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: providersQueries.all().queryKey,
      });
    },
  }),

  update: (queryClient: QueryClient) => mutationOptions({
    mutationKey: ["providers", "update"],
    
    mutationFn: ({ id, data }: UpdateProviderPayload) =>
      providersService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: providersQueries.all().queryKey,
      });
    },
  }),
}

export function useCreateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    ...providersMutations.create(queryClient),
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();

  return useMutation(
    providersMutations.update(queryClient)
  );
}