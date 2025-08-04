import { PaginationState } from "@tanstack/react-table";
import { useRef } from "react";

import type { User } from "@/shared/types";

import { useDeleteUserMutation } from "@/features/admin/hooks/use-delete-user-mutation";
import { useUnbanUserMutation } from "@/features/admin/hooks/use-unban-user-mutation";

interface Props {
  user: User;
  pagination: PaginationState;
}

export const useDataTableRowActions = ({ user, pagination }: Props) => {
  const isBanned =
    user.banned && (user.banExpires === null || user.banExpires > new Date());

  const { mutate: deleteUser, isPending: isDeleteUserPending } =
    useDeleteUserMutation({ pagination });

  const { mutate: unbanUSer, isPending: isUnbarUserPending } =
    useUnbanUserMutation({ pagination });

  const banUserDrawerTriggerRef = useRef<HTMLButtonElement>(null);
  const updateUserDrawerTriggerRef = useRef<HTMLButtonElement>(null);

  const handleBanUser = (event: Event) => {
    if (isBanned) {
      event.preventDefault();

      unbanUSer({ userId: user.id });
    } else {
      banUserDrawerTriggerRef.current?.click();
    }
  };

  const handleUpdateUser = () => updateUserDrawerTriggerRef.current?.click();

  const handleDeleteUser = (event: Event) => {
    event.preventDefault();

    deleteUser({
      userId: user.id,
    });
  };

  return {
    isBanned,
    isDeleteUserPending,
    isUnbarUserPending,
    banUserDrawerTriggerRef,
    updateUserDrawerTriggerRef,
    handleBanUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
