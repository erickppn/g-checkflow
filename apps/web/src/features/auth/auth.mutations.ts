import {
  mutationOptions,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { authService } from "./auth.service";

export const authMutations = {
  login: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: ["auth", "login"],

      mutationFn: authService.login,

      onSuccess: (data) => {
        queryClient.setQueryData(
          ["auth-user"],
          data.user,
        );
      },
    }),

  logout: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: ["auth", "logout"],

      mutationFn: authService.logout,

      onSuccess: () => {
        queryClient.setQueryData(
          ["auth-user"],
          null,
        );
      },
    }),
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation(
    authMutations.login(queryClient)
  );
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation(
    authMutations.logout(queryClient)
  );
}