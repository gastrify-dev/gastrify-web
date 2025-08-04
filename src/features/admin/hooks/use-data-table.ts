import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { authClient } from "@/shared/lib/better-auth/client";
import type { User } from "@/shared/types";

import { columns } from "@/features/admin/components/columns";

export const useDataTable = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    banned: false,
    emailVerified: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isSuccess, isLoading, isError, refetch, isRefetching } =
    useQuery({
      queryKey: ["user", "list", pagination],
      queryFn: async ({ signal }) => {
        const { data, error } = await authClient.admin.listUsers({
          query: {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
            sortBy: "createdAt",
            sortDirection: "desc",
          },
          fetchOptions: { signal },
        });

        if (error) return Promise.reject(error);

        return data;
      },
    });

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: (data?.users as User[]) ?? defaultData,
    columns,
    rowCount: data?.total,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return {
    table,
    isSuccess,
    isLoading,
    isError,
    refetch,
    isRefetching,
    pagination,
  };
};
