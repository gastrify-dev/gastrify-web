"use client";

// third party
import { PaginationState, Row } from "@tanstack/react-table";
import {
  BanIcon,
  LoaderIcon,
  MoreHorizontal,
  TrashIcon,
  UserRoundPenIcon,
  BriefcaseMedical,
} from "lucide-react";
import { useTranslations } from "next-intl";

// shared
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { User } from "@/shared/types";

// features
import { BanUserDrawer } from "@/features/admin/components/ban-user-drawer";
import { UpdateUserDrawer } from "@/features/admin/components/update-user-drawer";
import { useDataTableRowActions } from "@/features/admin/hooks/use-data-table-row-actions";

interface DataTableRowActionsProps {
  row: Row<User>;
  pagination: PaginationState;
}

export function DataTableRowActions({
  row,
  pagination,
}: DataTableRowActionsProps) {
  const t = useTranslations("features.admin.data-table-row-actions");
  const {
    isAdmin,
    isBanned,
    isDeleteUserPending,
    isUnbarUserPending,
    banUserDrawerTriggerRef,
    updateUserDrawerTriggerRef,
    handleBanUser,
    handleUpdateUser,
    handleDeleteUser,
    handleMedicalHistory,
  } = useDataTableRowActions({ user: row.original, pagination });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <MoreHorizontal />
            <span className="sr-only">{t("open-menu-sr")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={handleUpdateUser}>
            <UserRoundPenIcon />
            {t("edit")}
          </DropdownMenuItem>
          {!isAdmin && (
            <DropdownMenuItem onSelect={handleMedicalHistory}>
              <BriefcaseMedical />
              {t("medical-history")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={isUnbarUserPending}
            variant={isBanned ? "default" : "destructive"}
            onSelect={handleBanUser}
          >
            {isUnbarUserPending ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <BanIcon />
            )}
            {isBanned ? t("unban") : t("ban")}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDeleteUserPending}
            variant="destructive"
            onSelect={handleDeleteUser}
          >
            {isDeleteUserPending ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <TrashIcon />
            )}
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BanUserDrawer
        banUserDrawerTriggerRef={banUserDrawerTriggerRef}
        user={row.original}
        pagination={pagination}
      />
      <UpdateUserDrawer
        updateUserDrawerTriggerRef={updateUserDrawerTriggerRef}
        user={row.original}
        pagination={pagination}
      />
    </>
  );
}
