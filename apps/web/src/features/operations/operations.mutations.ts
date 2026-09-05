import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { operationsService } from "./operations.service";

export const operationsMutations = {
  create: () =>
    mutationOptions({
      mutationFn: operationsService.create
    }),
}

export function useCreateOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...operationsMutations.create(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["checks"],
      });
    },
  });
}