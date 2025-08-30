"use client"

import * as React from "react";
import type { Table as TableInstance } from "@tanstack/react-table";
import { Search, X, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableDateFilter } from "./data-table-date-filter";
import { DataTableRangeFilter } from "./data-table-range-filter";
import { DataTableSliderFilter } from "./data-table-slider-filter";
import type {
  DataTableToolbarConfig,
  FacetedFilterConfig,
  DateFilterConfig,
  RangeFilterConfig,
  SliderFilterConfig,
} from "./types";

interface DataTableToolbarProps<TData> {
  table: TableInstance<TData>;
  config: DataTableToolbarConfig<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  config,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Global search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={config.searchPlaceholder || "Search..."}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8 pr-8"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalFilter("")}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Faceted filters */}
        {config.facetedFilters?.map((filterConfig: FacetedFilterConfig) => (
          <DataTableFacetedFilter
            key={filterConfig.column}
            column={table.getColumn(filterConfig.column)}
            title={filterConfig.title}
            options={filterConfig.options}
            variant={filterConfig.variant}
          />
        ))}

        {/* Date filters */}
        {config.dateFilters?.map((filterConfig: DateFilterConfig) => (
          <DataTableDateFilter
            key={filterConfig.column}
            column={table.getColumn(filterConfig.column)}
            title={filterConfig.title}
            placeholder={filterConfig.placeholder}
          />
        ))}

        {/* Range filters */}
        {config.rangeFilters?.map((filterConfig: RangeFilterConfig) => (
          <DataTableRangeFilter
            key={filterConfig.column}
            column={table.getColumn(filterConfig.column)}
            title={filterConfig.title}
            min={filterConfig.min}
            max={filterConfig.max}
            step={filterConfig.step}
            unit={filterConfig.unit}
          />
        ))}

        {/* Slider filters */}
        {config.sliderFilters?.map((filterConfig: SliderFilterConfig) => (
          <DataTableSliderFilter
            key={filterConfig.column}
            column={table.getColumn(filterConfig.column)}
            title={filterConfig.title}
            min={filterConfig.min}
            max={filterConfig.max}
            step={filterConfig.step}
            unit={filterConfig.unit}
            formatValue={filterConfig.formatValue}
          />
        ))}

        {/* Reset filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-2">
        {/* Custom actions */}
        {config.actions?.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={() => action.onClick([])}
              disabled={action.disabled}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          );
        })}

        {/* View options */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

// Simple toolbar with minimal features
export function SimpleDataTableToolbar<TData>({
  table,
  config,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={config.searchPlaceholder || "Search..."}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8"
          />
        </div>
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setGlobalFilter("")}
            className="h-8 px-2"
          >
            Clear
          </Button>
        )}
      </div>
      
      <DataTableViewOptions table={table} />
    </div>
  );
}

// Compact toolbar for mobile
export function CompactDataTableToolbar<TData>({
  table,
  config,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const [showFilters, setShowFilters] = React.useState(false);
  const hasFilters = (config.facetedFilters?.length || 0) + 
                    (config.dateFilters?.length || 0) + 
                    (config.rangeFilters?.length || 0) > 0;

  return (
    <div className="space-y-2">
      {/* Main row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Expandable filters */}
      {showFilters && hasFilters && (
        <div className="flex flex-wrap gap-2 rounded-md border bg-muted/20 p-2">
          {config.facetedFilters?.map((filterConfig: FacetedFilterConfig) => (
            <DataTableFacetedFilter
              key={filterConfig.column}
              column={table.getColumn(filterConfig.column)}
              title={filterConfig.title}
              options={filterConfig.options}
              variant="default"
            />
          ))}
          
          {config.dateFilters?.map((filterConfig: DateFilterConfig) => (
            <DataTableDateFilter
              key={filterConfig.column}
              column={table.getColumn(filterConfig.column)}
              title={filterConfig.title}
              placeholder={filterConfig.placeholder}
            />
          ))}
        </div>
      )}
    </div>
  );
}