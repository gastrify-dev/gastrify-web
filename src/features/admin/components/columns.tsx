"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleXIcon, UserRoundCogIcon, UserRoundIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

import { Badge } from "@/shared/components/ui/badge";
import type { User } from "@/shared/types";

import { DataTableColumnHeader } from "@/features/admin/components/data-table-column-header";
import { DataTableRowActions } from "@/features/admin/components/data-table-row-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const isBanned =
        row.original.banned &&
        (row.original.banExpires === null ||
          row.original.banExpires > new Date());

      return (
        <div className="ml-2.5 flex items-center gap-2">
          <span className="w-max font-medium">{row.getValue("name")}</span>

          {isBanned && (
            <Tooltip>
              <TooltipTrigger className="cursor-pointer">
                <Badge variant="destructive" className="text-xs">
                  banned
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col gap-1">
                <span>
                  <b>Reason:</b> {row.original.banReason}
                </span>

                <span>
                  <b>Expires:</b>{" "}
                  {row.original.banExpires
                    ? `${format(row.original.banExpires, "PPP, HH:mm")} (${formatDistanceToNow(row.original.banExpires)})`
                    : "Never"}
                </span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
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
                <p>Email not verified</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    accessorFn: (row) => String(!!row.emailVerified),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
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
