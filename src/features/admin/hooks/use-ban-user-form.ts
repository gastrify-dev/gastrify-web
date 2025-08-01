import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { useRef } from "react";

import { useBanUserMutation } from "@/features/admin/hooks/use-ban-user-mutation";
import { banUserSchema } from "@/features/admin/schemas/ban-user";
import type { BanUserVariables } from "@/features/admin/types";

interface Props {
  userId: string;
  pagination: PaginationState;
}

export const useBanUserForm = ({ userId, pagination }: Props) => {
  const banUserDrawerCloseRef = useRef<HTMLButtonElement>(null);

  const form = useForm<BanUserVariables>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId,
      banReason: "",
      banExpiresIn: undefined,
    },
  });

  const { mutate: banUser, isPending } = useBanUserMutation({
    pagination,
  });

  const onSubmit = (variables: BanUserVariables) =>
    banUser(variables, {
      onSuccess: () => {
        banUserDrawerCloseRef.current?.click();
      },
    });

  return {
    form,
    onSubmit,
    isPending,
    banUserDrawerCloseRef,
  };
};
