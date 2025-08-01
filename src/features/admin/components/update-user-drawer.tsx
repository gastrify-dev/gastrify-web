"use client";

import { type RefObject } from "react";
import { PaginationState } from "@tanstack/react-table";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import type { User } from "@/shared/types";

import { UpdateUserForm } from "@/features/admin/components/update-user-form";

interface Props {
  updateUserDrawerTriggerRef: RefObject<HTMLButtonElement | null>;
  user: User;
  pagination: PaginationState;
}

export const UpdateUserDrawer = ({
  updateUserDrawerTriggerRef,
  user,
  pagination,
}: Props) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger ref={updateUserDrawerTriggerRef} className="hidden" />

      <DrawerContent className="flex flex-col gap-4 p-6">
        <DrawerHeader>
          <DrawerTitle>Update User</DrawerTitle>

          <DrawerDescription>
            You are about to update {user.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="w-full flex-1 p-4">
          <UpdateUserForm user={user} pagination={pagination} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
