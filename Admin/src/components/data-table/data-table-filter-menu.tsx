"use client"

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { MoreHorizontal, Filter, Eye, EyeOff, SortAsc, SortDesc } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableFilterMenuProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterMenu<TData>({
  table,
}: DataTableFilterMenuProps<TData>) {
  const columns = table.getAllColumns().filter(
    (column) => column.getCanHide() || column.getCanSort() || column.getCanFilter()
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <MoreHorizontal className="mr-2 h-4 w-4" />
          More Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Table Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Column Visibility */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Eye className="mr-2 h-4 w-4" />
            Column Visibility
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[180px]">
            {columns
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnTitle = 
                  (column.columnDef.meta as any)?.title ||
                  (typeof column.columnDef.header === 'string' 
                    ? column.columnDef.header 
                    : column.id);
                
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columnTitle}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Column Sorting */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SortAsc className="mr-2 h-4 w-4" />
            Quick Sort
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[180px]">
            {columns
              .filter((column) => column.getCanSort())
              .map((column) => {
                const columnTitle = 
                  (column.columnDef.meta as any)?.title ||
                  (typeof column.columnDef.header === 'string' 
                    ? column.columnDef.header 
                    : column.id);
                const sortDirection = column.getIsSorted();
                
                return (
                  <React.Fragment key={column.id}>
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(false)}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center">
                        <SortAsc className="mr-2 h-4 w-4" />
                        {columnTitle} (A-Z)
                      </span>
                      {sortDirection === 'asc' && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(true)}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center">
                        <SortDesc className="mr-2 h-4 w-4" />
                        {columnTitle} (Z-A)
                      </span>
                      {sortDirection === 'desc' && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                  </React.Fragment>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => table.resetSorting()}
              className="text-muted-foreground"
            >
              Clear sorting
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Table Actions */}
        <DropdownMenuItem
          onClick={() => table.resetColumnFilters()}
          disabled={table.getState().columnFilters.length === 0}
        >
          <Filter className="mr-2 h-4 w-4" />
          Clear Filters
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => table.resetSorting()}
          disabled={table.getState().sorting.length === 0}
        >
          <SortAsc className="mr-2 h-4 w-4" />
          Clear Sorting
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => table.resetRowSelection()}
          disabled={Object.keys(table.getState().rowSelection).length === 0}
        >
          Clear Selection
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Display Options */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Display Options
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <DropdownMenuRadioItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple filter menu for basic operations
export function SimpleDataTableFilterMenu<TData>({
  table,
}: DataTableFilterMenuProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => table.resetColumnFilters()}
          disabled={table.getState().columnFilters.length === 0}
        >
          Clear Filters
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => table.resetSorting()}
          disabled={table.getState().sorting.length === 0}
        >
          Clear Sorting
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => table.resetRowSelection()}
          disabled={Object.keys(table.getState().rowSelection).length === 0}
        >
          Clear Selection
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            table.resetColumnFilters();
            table.resetSorting();
            table.resetRowSelection();
          }}
        >
          Reset All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}