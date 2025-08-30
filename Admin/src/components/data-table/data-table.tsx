"use client"

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableSkeleton } from "./data-table-skeleton";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableActionBar } from "./data-table-action-bar";
import type {
  DataTableConfig,
  DataTableToolbarConfig,
  DataTableState,
} from "./types";

interface DataTableProps<TData> extends DataTableConfig<TData> {
  className?: string;
  toolbarConfig?: DataTableToolbarConfig<TData>;
  state?: Partial<DataTableState>;
  onStateChange?: (state: DataTableState) => void;
}

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  className,
  toolbarConfig,
  state: externalState,
  onStateChange,
  onRowSelect,
  enableRowSelection = true,
  enableMultiSelect = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableColumnVisibility = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TData>) {
  // Internal state
  const [sorting, setSorting] = React.useState(
    externalState?.sorting || []
  );
  const [columnFilters, setColumnFilters] = React.useState(
    externalState?.columnFilters || []
  );
  const [columnVisibility, setColumnVisibility] = React.useState(
    externalState?.columnVisibility || {}
  );
  const [rowSelection, setRowSelection] = React.useState(
    externalState?.rowSelection || {}
  );
  const [globalFilter, setGlobalFilter] = React.useState(
    externalState?.globalFilter || ""
  );
  const [pagination, setPagination] = React.useState(
    externalState?.pagination || {
      pageIndex: 0,
      pageSize: pageSize,
    }
  );

  // Update external state when internal state changes
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange({
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        globalFilter,
        pagination,
      });
    }
  }, [
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    pagination,
    onStateChange,
  ]);

  // Update internal state when external state changes
  React.useEffect(() => {
    if (externalState) {
      if (externalState.sorting) setSorting(externalState.sorting);
      if (externalState.columnFilters)
        setColumnFilters(externalState.columnFilters);
      if (externalState.columnVisibility)
        setColumnVisibility(externalState.columnVisibility);
      if (externalState.rowSelection)
        setRowSelection(externalState.rowSelection);
      if (externalState.globalFilter !== undefined)
        setGlobalFilter(externalState.globalFilter);
      if (externalState.pagination)
        setPagination(externalState.pagination);
    }
  }, [externalState]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : [],
      columnFilters: enableFiltering ? columnFilters : [],
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      rowSelection: enableRowSelection ? rowSelection : {},
      globalFilter: enableFiltering ? globalFilter : "",
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onGlobalFilterChange: enableFiltering ? setGlobalFilter : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableRowSelection: enableRowSelection,
    enableMultiRowSelection: enableMultiSelect,
    enableSorting,
    enableColumnFilters: enableFiltering,
    enableGlobalFilter: enableFiltering,
  });

  // Handle row selection callback
  React.useEffect(() => {
    if (onRowSelect && enableRowSelection) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original
      );
      onRowSelect(selectedRows);
    }
  }, [rowSelection, onRowSelect, enableRowSelection, table]);

  const selectedRowCount = Object.keys(rowSelection).length;
  const hasSelection = selectedRowCount > 0;

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <DataTableSkeleton />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {toolbarConfig && (
        <DataTableToolbar
          table={table}
          config={toolbarConfig}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}

      {hasSelection && toolbarConfig?.actions && (
        <DataTableActionBar
          selectedCount={selectedRowCount}
          actions={toolbarConfig.actions}
          selectedRows={table.getFilteredSelectedRowModel().rows.map(
            (row) => row.original
          )}
          onClearSelection={() => setRowSelection({})}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.getCanSort() && "cursor-pointer select-none",
                      (header.column.columnDef.meta as any)?.headerClassName
                    )}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    row.getCanSelect() && "cursor-pointer",
                    row.original &&
                      typeof row.original === "object" &&
                      "meta" in row.original &&
                      (row.original as any).meta?.rowClassName
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.columnDef.meta as any)?.cellClassName
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}