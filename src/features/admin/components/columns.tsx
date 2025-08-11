"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleXIcon, UserRoundCogIcon, UserRoundIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/ui/badge";
import type { User } from "@/shared/types";

import { DataTableColumnHeader } from "@/features/admin/components/data-table-column-header";
import { DataTableRowActions } from "@/features/admin/components/data-table-row-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

import type { HeaderContext, Row } from "@tanstack/react-table";

function IdentificationNumberHeader({
  column,
}: {
  column: HeaderContext<User, unknown>["column"];
}) {
  const t = useTranslations("features.admin.columns");
  return (
    <DataTableColumnHeader column={column} title={t("identification-number")} />
  );
}

function NameHeader({
  column,
}: {
  column: HeaderContext<User, unknown>["column"];
}) {
  const t = useTranslations("features.admin.columns");
  return <DataTableColumnHeader column={column} title={t("name")} />;
}

function NameCell({ row }: { row: Row<User> }) {
  const t = useTranslations("features.admin.columns");
  const isBanned =
    row.original.banned &&
    (row.original.banExpires === null || row.original.banExpires > new Date());

  return (
    <div className="ml-2.5 flex items-center gap-2">
      <span className="w-max font-medium">{row.getValue("name")}</span>

      {isBanned && (
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <Badge variant="destructive" className="text-xs">
              {t("banned-badge")}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col gap-1">
            <span>
              <b>{t("ban-reason-label")}:</b> {row.original.banReason}
            </span>

            <span>
              <b>{t("ban-expires-label")}:</b>{" "}
              {row.original.banExpires
                ? `${format(row.original.banExpires, "PPP, HH:mm")} (${formatDistanceToNow(row.original.banExpires)})`
                : t("never")}
            </span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function EmailHeader({
  column,
}: {
  column: HeaderContext<User, unknown>["column"];
}) {
  const t = useTranslations("features.admin.columns");
  return <DataTableColumnHeader column={column} title={t("email")} />;
}

function EmailCell({ row }: { row: Row<User> }) {
  const t = useTranslations("features.admin.columns");
  const isEmailVerified = row.original.emailVerified;

  return (
    <div className="ml-2.5 flex items-center gap-2">
      <span className="w-max font-medium">{row.getValue("email")}</span>

      {!isEmailVerified && (
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <CircleXIcon className="text-destructive size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("email-not-verified")}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function RoleHeader({
  column,
}: {
  column: HeaderContext<User, unknown>["column"];
}) {
  const t = useTranslations("features.admin.columns");
  return <DataTableColumnHeader column={column} title={t("role")} />;
}

function CreatedAtHeader({
  column,
}: {
  column: HeaderContext<User, unknown>["column"];
}) {
  const t = useTranslations("features.admin.columns");
  return <DataTableColumnHeader column={column} title={t("created-at")} />;
}

function UpdatedAtHeader({
  column,
}: {
  column: HeaderContext<User, unknown>["column"];
}) {
  const t = useTranslations("features.admin.columns");
  return <DataTableColumnHeader column={column} title={t("updated-at")} />;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div className="ml-2.5 flex space-x-2">
        <span className="w-fit font-medium">{row.getValue("id")}</span>
      </div>
    ),
  },
  {
    accessorKey: "identificationNumber",
    header: ({ column }) => <IdentificationNumberHeader column={column} />,
    cell: ({ row }) => (
      <div className="ml-2.5 flex space-x-2">
        <span className="w-fit font-medium">
          {row.getValue("identificationNumber")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <NameHeader column={column} />,
    cell: ({ row }) => <NameCell row={row} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <EmailHeader column={column} />,
    cell: ({ row }) => <EmailCell row={row} />,
  },
  {
    accessorKey: "emailVerified",
    accessorFn: (row) => String(!!row.emailVerified),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <RoleHeader column={column} />,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const isAdmin = role === "admin";

      return (
        <div className="ml-2.5 flex space-x-2">
          <Badge variant={isAdmin ? "default" : "secondary"}>
            {isAdmin ? <UserRoundCogIcon /> : <UserRoundIcon />}
            {role}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "banned",
    accessorFn: (row) =>
      String(
        row.banned && (row.banExpires === null || row.banExpires > new Date()),
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <CreatedAtHeader column={column} />,
    cell: ({ row }) => {
      return (
        <div className="ml-2.5 flex space-x-2">
          <Tooltip>
            <TooltipTrigger className="cursor-pointer">
              <span className="w-max font-medium">
                {format(row.getValue("createdAt") as Date, "PPP, HH:mm")}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {formatDistanceToNow(row.getValue("createdAt") as Date)}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <UpdatedAtHeader column={column} />,
    cell: ({ row }) => {
      return (
        <div className="ml-2.5 flex space-x-2">
          <Tooltip>
            <TooltipTrigger className="cursor-pointer">
              <span className="w-max font-medium">
                {format(row.getValue("updatedAt") as Date, "PPP, HH:mm")}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {formatDistanceToNow(row.getValue("updatedAt") as Date)}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DataTableRowActions row={row} pagination={table.getState().pagination} />
    ),
  },
];
