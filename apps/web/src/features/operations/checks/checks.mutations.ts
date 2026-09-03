import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { checksService } from "./checks.service";
import { operationsQueries } from "../operations.queries";

import type {
  ReturnCheckMutationInput,
  UpdateCheckMutationInput,
} from "./types/check.types";
import type { Operation } from "../types/operation.types";

export const checksMutations = {
  update: () =>
    mutationOptions({
      mutationFn: ({ id, data }: UpdateCheckMutationInput) =>
        checksService.update(id, data),
    }),

  compensate: () =>
    mutationOptions({
      mutationFn: checksService.compensate,
    }),

  returnCheck: () =>
    mutationOptions({
      mutationFn: ({ id, data }: ReturnCheckMutationInput) =>
        checksService.returnCheck(id, data),
    }),

  delete: () =>
    mutationOptions({
      mutationFn: checksService.delete,
    }),
}

export function useUpdateCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    ...checksMutations.update(),

    onSuccess: (updatedCheck) => {
      queryClient.setQueryData(
        operationsQueries.findById(updatedCheck.operationId).queryKey,
        (operation: Operation | undefined) => {
          if (!operation) return operation;

          return {
            ...operation,

            checks: operation.checks.map((check) =>
              check.id === updatedCheck.id
                ? updatedCheck
                : check
            ),
          };
        },
      );
    },
  });
}

export function useCompensateCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    ...checksMutations.compensate(),

    onSuccess: (data) => {
      queryClient.setQueryData(
        operationsQueries.findById(data.check.operationId).queryKey,
        (operation: Operation | undefined) => {
          if (!operation) return operation;

          return {
            ...operation,
            closedAt: data.operation.closedAt,

            checks: operation.checks.map((check) =>
              check.id === data.check.id
                ? data.check
                : check
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useReturnCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    ...checksMutations.returnCheck(),

    onSuccess: (data) => {
      queryClient.setQueryData(
        operationsQueries.findById(data.check.operationId).queryKey,
        (operation: Operation | undefined) => {
          if (!operation) return operation;

          return {
            ...operation,
            closedAt: data.operation.closedAt,

            checks: operation.checks.map((check) =>
              check.id === data.check.id
                ? data.check
                : check
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useDeleteCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    ...checksMutations.delete(),

    onSuccess: (data, checkId) => {
      queryClient.setQueryData(
        operationsQueries.findById(data.operationId).queryKey,
        (operation: Operation | undefined) => {
          if (!operation) return operation;

          return {
            ...operation,
            closedAt: data.closedAt,

            checks: operation.checks.filter(
              (check) => check.id !== checkId
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}