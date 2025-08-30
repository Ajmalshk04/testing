"use client"

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, X, Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableDateFilter } from "./data-table-date-filter";
import { DataTableRangeFilter } from "./data-table-range-filter";
import { DataTableSliderFilter } from "./data-table-slider-filter";
import { DataTableFilterMenu } from "./data-table-filter-menu";
import { DataTableSortList } from "./data-table-sort-list";
import { DataTableFilterList } from "./data-table-filter-list";
import {
  DataTableToolbarConfig,
  FacetedFilterConfig,
  DateFilterConfig,
  RangeFilterConfig,
  SliderFilterConfig,
} from "./types";

interface DataTableAdvancedToolbarProps<TData> {
  table: Table<TData>;
  config: DataTableToolbarConfig<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  config,
  globalFilter,
  setGlobalFilter,
}: DataTableAdvancedToolbarProps<TData>) {
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState(false);
  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter;
  const hasActiveFilters = table.getState().columnFilters.length > 0;

  const resetFilters = () => {
    table.resetColumnFilters();
    setGlobalFilter("");
  };

  const resetSorting = () => {
    table.resetSorting();
  };

  const resetAll = () => {
    resetFilters();
    resetSorting();
    table.resetRowSelection();
  };

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
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

          {/* Quick filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className={hasActiveFilters ? "border-primary" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-sm bg-primary px-1 py-0.5 text-xs text-primary-foreground">
                {table.getState().columnFilters.length}
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Reset controls */}
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={resetAll}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset All
            </Button>
          )}

          {/* View options */}
          <DataTableViewOptions table={table} />

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
        </div>
      </div>

      {/* Expanded filters section */}
      {isFiltersExpanded && (
        <div className="rounded-md border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center gap-2">
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

            {/* Filter menu for additional options */}
            <DataTableFilterMenu table={table} />

            {/* Sort options */}
            <DataTableSortList table={table} />
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="mt-3">
              <DataTableFilterList
                table={table}
                onReset={resetFilters}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact version for mobile
export function CompactDataTableToolbar<TData>({
  table,
  config,
  globalFilter,
  setGlobalFilter,
}: DataTableAdvancedToolbarProps<TData>) {
  const [activeTab, setActiveTab] = React.useState<'search' | 'filters' | 'sort'>('search');
  const hasActiveFilters = table.getState().columnFilters.length > 0;

  return (
    <div className="space-y-3">
      {/* Tab navigation */}
      <div className="flex rounded-lg border bg-muted p-1">
        <Button
          variant={activeTab === 'search' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('search')}
          className="flex-1"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button
          variant={activeTab === 'filters' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('filters')}
          className="flex-1"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 rounded-sm bg-primary px-1 py-0.5 text-xs text-primary-foreground">
              {table.getState().columnFilters.length}
            </span>
          )}
        </Button>
        <Button
          variant={activeTab === 'sort' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('sort')}
          className="flex-1"
        >
          Sort
        </Button>
      </div>

      {/* Tab content */}
      {activeTab === 'search' && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={config.searchPlaceholder || "Search..."}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8"
          />
        </div>
      )}

      {activeTab === 'filters' && (
        <div className="grid gap-2">
          {config.facetedFilters?.map((filterConfig: FacetedFilterConfig) => (
            <DataTableFacetedFilter
              key={filterConfig.column}
              column={table.getColumn(filterConfig.column)}
              title={filterConfig.title}
              options={filterConfig.options}
              variant="default"
            />
          ))}
        </div>
      )}

      {activeTab === 'sort' && (
        <DataTableSortList table={table} />
      )}
    </div>
  );
}