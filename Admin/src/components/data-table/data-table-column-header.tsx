"use client"

import * as React from "react";
import type { Column } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  canSort?: boolean;
  canHide?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  canSort = true,
  canHide = true,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !canSort) {
    return (
      <div className={cn("flex items-center space-x-2", className)} {...props}>
        <span className="font-medium">{title}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent -ml-3"
          >
            <span className="font-medium">{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && column.getCanSort() && (
            <>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)}
                className="cursor-pointer"
              >
                <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)}
                className="cursor-pointer"
              >
                <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
              {(canHide || column.getCanSort()) && <DropdownMenuSeparator />}
            </>
          )}
          {canHide && (
            <DropdownMenuItem
              onClick={() => column.toggleVisibility(false)}
              className="cursor-pointer"
            >
              <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Simplified sortable header for basic use cases
export function SortableHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
} & React.ComponentProps<typeof Button>) {
  const handleSort = () => {
    if (!column.getCanSort()) return;
    
    if (column.getIsSorted() === "asc") {
      column.toggleSorting(true); // Sort descending
    } else if (column.getIsSorted() === "desc") {
      column.clearSorting(); // Clear sorting
    } else {
      column.toggleSorting(false); // Sort ascending
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className={cn(
        "h-8 p-0 hover:bg-transparent font-medium justify-start",
        column.getCanSort() && "cursor-pointer",
        !column.getCanSort() && "cursor-default",
        className
      )}
      {...props}
    >
      {title}
      {column.getCanSort() && (
        <span className="ml-2">
          {column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </span>
      )}
    </Button>
  );
}