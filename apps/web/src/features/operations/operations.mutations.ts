import { mutationOptions, useMutation } from "@tanstack/react-query";
import { operationsService } from "./operations.service";

export const operationsMutations = {
  create: () =>
    mutationOptions({
      mutationFn: operationsService.create,
    }),
}

export function useCreateOperation() {
  return useMutation(operationsMutations.create())
}