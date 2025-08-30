"use client"

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DataTableFilterListProps<TData> {
  table: Table<TData>;
  onReset?: () => void;
}

interface FilterChip {
  id: string;
  label: string;
  value: any;
  onRemove: () => void;
}

export function DataTableFilterList<TData>({
  table,
  onReset,
}: DataTableFilterListProps<TData>) {
  const columnFilters = table.getState().columnFilters;
  const globalFilter = table.getState().globalFilter;

  // Create filter chips from active filters
  const filterChips: FilterChip[] = React.useMemo(() => {
    const chips: FilterChip[] = [];

    // Add global filter chip
    if (globalFilter) {
      chips.push({
        id: 'global',
        label: `Search: "${globalFilter}"`,
        value: globalFilter,
        onRemove: () => table.setGlobalFilter(''),
      });
    }

    // Add column filter chips
    columnFilters.forEach((filter) => {
      const column = table.getColumn(filter.id);
      if (!column) return;

      const columnDef = column.columnDef;
      const columnTitle = 
        (columnDef.meta as any)?.title ||
        (typeof columnDef.header === 'string' ? columnDef.header : filter.id);

      if (Array.isArray(filter.value)) {
        // Handle array filters (faceted filters)
        filter.value.forEach((value: string, index: number) => {
          chips.push({
            id: `${filter.id}-${index}`,
            label: `${columnTitle}: ${value}`,
            value: value,
            onRemove: () => {
              const newValues = filter.value.filter((_: any, i: number) => i !== index);
              column.setFilterValue(newValues.length > 0 ? newValues : undefined);
            },
          });
        });
      } else if (typeof filter.value === 'object' && filter.value !== null) {
        // Handle range/date filters
        if ('from' in filter.value || 'to' in filter.value) {
          const from = filter.value.from;
          const to = filter.value.to;
          let label = columnTitle;
          
          if (from && to) {
            if (from instanceof Date && to instanceof Date) {
              label += `: ${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
            } else {
              label += `: ${from} - ${to}`;
            }
          } else if (from) {
            if (from instanceof Date) {
              label += `: From ${from.toLocaleDateString()}`;
            } else {
              label += `: From ${from}`;
            }
          } else if (to) {
            if (to instanceof Date) {
              label += `: To ${to.toLocaleDateString()}`;
            } else {
              label += `: To ${to}`;
            }
          }

          chips.push({
            id: filter.id,
            label,
            value: filter.value,
            onRemove: () => column.setFilterValue(undefined),
          });
        } else if ('min' in filter.value || 'max' in filter.value) {
          // Handle numeric range filters
          const min = filter.value.min;
          const max = filter.value.max;
          let label = columnTitle;
          
          if (min !== undefined && max !== undefined) {
            label += `: ${min} - ${max}`;
          } else if (min !== undefined) {
            label += `: ≥ ${min}`;
          } else if (max !== undefined) {
            label += `: ≤ ${max}`;
          }

          chips.push({
            id: filter.id,
            label,
            value: filter.value,
            onRemove: () => column.setFilterValue(undefined),
          });
        }
      } else {
        // Handle simple string/number filters
        chips.push({
          id: filter.id,
          label: `${columnTitle}: ${filter.value}`,
          value: filter.value,
          onRemove: () => column.setFilterValue(undefined),
        });
      }
    });

    return chips;
  }, [columnFilters, globalFilter, table]);

  if (filterChips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center text-sm font-medium text-muted-foreground">
        <Filter className="mr-2 h-4 w-4" />
        Active filters:
      </div>

      {filterChips.map((chip) => (
        <Badge
          key={chip.id}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {chip.label}
          <Button
            variant="ghost"
            size="sm"
            onClick={chip.onRemove}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}

      {filterChips.length > 1 && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        </>
      )}
    </div>
  );
}

// Compact version for mobile
export function CompactDataTableFilterList<TData>({
  table,
  onReset,
}: DataTableFilterListProps<TData>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const columnFilters = table.getState().columnFilters;
  const globalFilter = table.getState().globalFilter;
  
  const totalFilters = columnFilters.length + (globalFilter ? 1 : 0);

  if (totalFilters === 0) {
    return null;
  }

  return (
    <div className="rounded-md border bg-muted/50 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium">
          <Filter className="mr-2 h-4 w-4" />
          {totalFilters} filter{totalFilters === 1 ? '' : 's'} active
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
          >
            Clear all
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2 border-t pt-2">
          <DataTableFilterList table={table} onReset={onReset} />
        </div>
      )}
    </div>
  );
}