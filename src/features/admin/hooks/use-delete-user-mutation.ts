import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

import type { DeleteUserVariables, ListUsers } from "@/features/admin/types";

interface Props {
  pagination: PaginationState;
}

export const useDeleteUserMutation = ({ pagination }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: DeleteUserVariables) => {
      const { error } = await authClient.admin.removeUser({
        userId: variables.userId,
      });

      if (error) return Promise.reject(error);
    },
    onError: () => {
      toast.error("Failed to delete user 😢", {
        description: "Please try again later",
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["user", "list", pagination],
        (old: ListUsers) => ({
          ...old,
          users: old.users.filter((user) => user.id !== variables.userId),
          total: old.total - 1,
        }),
      );

      toast.success("User deleted successfully 🎉");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
  });
};
