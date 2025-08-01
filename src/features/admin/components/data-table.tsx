"use client";

import { flexRender } from "@tanstack/react-table";
import { LoaderIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";

import { DataTablePagination } from "@/features/admin/components/data-table-pagination";
import { DataTableToolbar } from "@/features/admin/components/data-table-toolbar";
import { columns } from "@/features/admin/components/columns";
import { useDataTable } from "@/features/admin/hooks/use-data-table";

export function DataTable() {
  const {
    table,
    isSuccess,
    isLoading,
    isError,
    refetch,
    isRefetching,
    pagination,
  } = useDataTable();

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar table={table} />

      <div className="flex w-full">
        <ScrollArea className="w-1 flex-1 rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: pagination.pageSize }).map(
                  (_, rowIndex) => (
                    <TableRow key={rowIndex} className="h-12">
                      {columns.slice(0, -2).map((_, columnIndex) => (
                        <TableCell key={columnIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ),
                )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24">
                    <div className="flex flex-col items-center justify-center gap-2">
                      Something went wrong 😢
                      <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        size="sm"
                      >
                        {isRefetching && (
                          <LoaderIcon className="animate-spin" />
                        )}
                        Try again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {table.getRowModel().rows?.length > 0 &&
                isSuccess &&
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {table.getRowModel().rows?.length === 0 && isSuccess && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No users found in this page. 😢 <br /> Try changing the
                    filters or going to the next page
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
