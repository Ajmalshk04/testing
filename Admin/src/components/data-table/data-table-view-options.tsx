"use client"

import * as React from "react";
import type { Table as TableInstance } from "@tanstack/react-table";
import { Settings2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DataTableViewOptionsProps<TData> {
  table: TableInstance<TData>;
  columnLabels?: Record<string, string>;
}

export function DataTableViewOptions<TData>({
  table,
  columnLabels = {},
}: DataTableViewOptionsProps<TData>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());
  const hiddenColumnCount = columns.filter((column) => !column.getIsVisible()).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
          {hiddenColumnCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {hiddenColumnCount} hidden
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          const columnId = column.id;
          const label = columnLabels[columnId] || 
            (typeof column.columnDef.header === "string" 
              ? column.columnDef.header 
              : columnId);

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              <span className="truncate">{label}</span>
            </DropdownMenuCheckboxItem>
          );
        })}
        {columns.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columns.every((column) => column.getIsVisible())}
              onCheckedChange={(value) => {
                columns.forEach((column) => column.toggleVisibility(!!value));
              }}
              className="font-medium"
            >
              <Eye className="mr-2 h-4 w-4" />
              Show all
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={!columns.some((column) => column.getIsVisible())}
              onCheckedChange={(value) => {
                if (value) {
                  columns.forEach((column) => column.toggleVisibility(false));
                }
              }}
              className="font-medium"
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Hide all
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact view options for mobile
export function CompactDataTableViewOptions<TData>({
  table,
  columnLabels = {},
}: DataTableViewOptionsProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const columns = table.getAllColumns().filter((column) => column.getCanHide());
  const visibleColumnCount = columns.filter((column) => column.getIsVisible()).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8"
      >
        <Settings2 className="h-4 w-4" />
        <span className="ml-1 text-xs">
          {visibleColumnCount}/{columns.length}
        </span>
      </Button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-popover p-2 shadow-md">
            <div className="mb-2 text-sm font-medium">Toggle columns</div>
            <div className="space-y-1">
              {columns.map((column) => {
                const columnId = column.id;
                const label = columnLabels[columnId] || 
                  (typeof column.columnDef.header === "string" 
                    ? column.columnDef.header 
                    : columnId);

                return (
                  <label
                    key={column.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={(e) => column.toggleVisibility(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="truncate">{label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-2 flex space-x-1 border-t pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  columns.forEach((column) => column.toggleVisibility(true));
                }}
                className="h-6 flex-1 text-xs"
              >
                Show all
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  columns.forEach((column) => column.toggleVisibility(false));
                }}
                className="h-6 flex-1 text-xs"
              >
                Hide all
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Advanced view options with presets
export function AdvancedDataTableViewOptions<TData>({
  table,
  columnLabels = {},
  presets = [],
}: DataTableViewOptionsProps<TData> & {
  presets?: Array<{
    name: string;
    columns: string[];
  }>;
}) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  const applyPreset = (preset: { name: string; columns: string[] }) => {
    columns.forEach((column) => {
      column.toggleVisibility(preset.columns.includes(column.id));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Settings2 className="mr-2 h-4 w-4" />
          View Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        {presets.length > 0 && (
          <>
            <DropdownMenuLabel>View Presets</DropdownMenuLabel>
            {presets.map((preset) => (
              <DropdownMenuCheckboxItem
                key={preset.name}
                onSelect={() => applyPreset(preset)}
                className="cursor-pointer"
              >
                {preset.name}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        {columns.map((column) => {
          const columnId = column.id;
          const label = columnLabels[columnId] || 
            (typeof column.columnDef.header === "string" 
              ? column.columnDef.header 
              : columnId);

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              <span className="truncate">{label}</span>
            </DropdownMenuCheckboxItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={columns.every((column) => column.getIsVisible())}
          onCheckedChange={(value) => {
            columns.forEach((column) => column.toggleVisibility(!!value));
          }}
        >
          Show All Columns
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}