import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { useRef } from "react";

import type { User } from "@/shared/types";

import { useUpdateUserMutation } from "@/features/admin/hooks/use-update-user-mutation";
import { updateUserSchema } from "@/features/admin/schemas/update-user";
import type { UpdateUserVariables } from "@/features/admin/types";

interface Props {
  user: User;
  pagination: PaginationState;
}

export const useUpdateUserForm = ({ user, pagination }: Props) => {
  const updateUserDrawerCloseRef = useRef<HTMLButtonElement>(null);

  const form = useForm<UpdateUserVariables>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "user",
    },
  });

  const { mutate: updateUser, isPending } = useUpdateUserMutation({
    pagination,
  });

  const onSubmit = (variables: UpdateUserVariables) =>
    updateUser(variables, {
      onSuccess: () => {
        updateUserDrawerCloseRef.current?.click();
      },
    });

  return {
    form,
    onSubmit,
    isPending,
    updateUserDrawerCloseRef,
  };
};
