"use client"

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DataTableAction } from "./types";

interface DataTableActionBarProps<TData> {
  selectedCount: number;
  actions: DataTableAction<TData>[];
  selectedRows: TData[];
  onClearSelection: () => void;
}

export function DataTableActionBar<TData>({
  selectedCount,
  actions,
  selectedRows,
  onClearSelection,
}: DataTableActionBarProps<TData>) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium">
          {selectedCount} row{selectedCount === 1 ? "" : "s"} selected
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>
      
      {actions.length > 0 && (
        <>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  disabled={action.disabled}
                  className="h-8"
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Compact action bar for mobile layouts
export function CompactDataTableActionBar<TData>({
  selectedCount,
  actions,
  selectedRows,
  onClearSelection,
}: DataTableActionBarProps<TData>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="rounded-md border bg-muted/50 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {selectedCount} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {actions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Actions ({actions.length})
          </Button>
        )}
      </div>
      
      {isExpanded && actions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 border-t pt-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => action.onClick(selectedRows)}
                disabled={action.disabled}
                className="h-8"
              >
                {Icon && <Icon className="mr-1 h-3 w-3" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}