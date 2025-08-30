"use client"

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DataTableSortListProps<TData> {
  table: Table<TData>;
}

export function DataTableSortList<TData>({
  table,
}: DataTableSortListProps<TData>) {
  const sorting = table.getState().sorting;
  const columns = table.getAllColumns().filter((column) => column.getCanSort());

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleSorting(direction === 'desc');
    }
  };

  const removeSorting = (columnId: string) => {
    const newSorting = sorting.filter(sort => sort.id !== columnId);
    table.setSorting(newSorting);
  };

  const clearAllSorting = () => {
    table.resetSorting();
  };

  const activeSortCount = sorting.length;
  const hasActiveSorting = activeSortCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort
          {hasActiveSorting && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {activeSortCount}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Sort Columns</Label>
            {hasActiveSorting && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSorting}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Active sorting */}
          {hasActiveSorting && (
            <div className="space-y-2 mb-4">
              <Label className="text-xs text-muted-foreground">Active Sorting</Label>
              {sorting.map((sort, index) => {
                const column = table.getColumn(sort.id);
                const columnTitle = 
                  (column?.columnDef.meta as any)?.title ||
                  (typeof column?.columnDef.header === 'string' 
                    ? column.columnDef.header 
                    : sort.id);

                return (
                  <div
                    key={sort.id}
                    className="flex items-center justify-between rounded-md border bg-muted/50 px-2 py-1.5"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{columnTitle}</span>
                      {sort.desc ? (
                        <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUp className="h-3 w-3" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSorting(sort.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
              <Separator />
            </div>
          )}

          {/* Available columns */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Available Columns</Label>
            {columns.map((column) => {
              const columnTitle = 
                (column.columnDef.meta as any)?.title ||
                (typeof column.columnDef.header === 'string' 
                  ? column.columnDef.header 
                  : column.id);
              
              const currentSort = sorting.find(sort => sort.id === column.id);
              const isCurrentlySorted = !!currentSort;

              return (
                <div
                  key={column.id}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50"
                >
                  <span className="text-sm">{columnTitle}</span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={currentSort && !currentSort.desc ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleSort(column.id, 'asc')}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={currentSort && currentSort.desc ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleSort(column.id, 'desc')}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Inline sort list (always visible)
export function InlineDataTableSortList<TData>({
  table,
}: DataTableSortListProps<TData>) {
  const sorting = table.getState().sorting;
  const columns = table.getAllColumns().filter((column) => column.getCanSort());

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleSorting(direction === 'desc');
    }
  };

  const removeSorting = (columnId: string) => {
    const newSorting = sorting.filter(sort => sort.id !== columnId);
    table.setSorting(newSorting);
  };

  const clearAllSorting = () => {
    table.resetSorting();
  };

  return (
    <div className="w-full max-w-sm rounded-md border p-3">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">Sort Columns</Label>
        {sorting.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllSorting}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active sorting */}
      {sorting.length > 0 && (
        <div className="space-y-2 mb-3">
          {sorting.map((sort, index) => {
            const column = table.getColumn(sort.id);
            const columnTitle = 
              (column?.columnDef.meta as any)?.title ||
              (typeof column?.columnDef.header === 'string' 
                ? column.columnDef.header 
                : sort.id);

            return (
              <div
                key={sort.id}
                className="flex items-center justify-between rounded-sm border bg-muted/50 px-2 py-1"
              >
                <div className="flex items-center space-x-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-xs text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-xs">{columnTitle}</span>
                  {sort.desc ? (
                    <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUp className="h-3 w-3" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSorting(sort.id)}
                  className="h-4 w-4 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick sort options */}
      <div className="space-y-1">
        {columns.slice(0, 3).map((column) => {
          const columnTitle = 
            (column.columnDef.meta as any)?.title ||
            (typeof column.columnDef.header === 'string' 
              ? column.columnDef.header 
              : column.id);
          
          const currentSort = sorting.find(sort => sort.id === column.id);

          return (
            <div
              key={column.id}
              className="flex items-center justify-between text-xs"
            >
              <span>{columnTitle}</span>
              <div className="flex">
                <Button
                  variant={currentSort && !currentSort.desc ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleSort(column.id, 'asc')}
                  className="h-5 w-5 p-0"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant={currentSort && currentSort.desc ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleSort(column.id, 'desc')}
                  className="h-5 w-5 p-0"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}