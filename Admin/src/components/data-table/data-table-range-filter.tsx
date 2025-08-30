"use client"

import * as React from "react";
import { Filter, X } from "lucide-react";
import type { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: { min: string; max: string };
}

export function DataTableRangeFilter<TData, TValue>({
  column,
  title,
  min,
  max,
  step = 1,
  unit = "",
  placeholder = { min: "Min", max: "Max" },
}: DataTableRangeFilterProps<TData, TValue>) {
  const [range, setRange] = React.useState<{ min?: number; max?: number }>({
    min: undefined,
    max: undefined,
  });

  const [inputValues, setInputValues] = React.useState<{
    min: string;
    max: string;
  }>({
    min: "",
    max: "",
  });

  // Apply filter when range changes
  React.useEffect(() => {
    if (range.min !== undefined || range.max !== undefined) {
      column?.setFilterValue([range.min, range.max]);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [range, column]);

  const handleMinChange = (value: string) => {
    setInputValues((prev) => ({ ...prev, min: value }));
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setRange((prev) => ({ ...prev, min: numValue }));
    } else if (value === "") {
      setRange((prev) => ({ ...prev, min: undefined }));
    }
  };

  const handleMaxChange = (value: string) => {
    setInputValues((prev) => ({ ...prev, max: value }));
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setRange((prev) => ({ ...prev, max: numValue }));
    } else if (value === "") {
      setRange((prev) => ({ ...prev, max: undefined }));
    }
  };

  const handleReset = () => {
    setRange({ min: undefined, max: undefined });
    setInputValues({ min: "", max: "" });
  };

  const formatRangeDisplay = () => {
    if (range.min === undefined && range.max === undefined) return null;
    
    const minDisplay = range.min !== undefined ? `${range.min}${unit}` : "";
    const maxDisplay = range.max !== undefined ? `${range.max}${unit}` : "";
    
    if (range.min !== undefined && range.max !== undefined) {
      return `${minDisplay} - ${maxDisplay}`;
    } else if (range.min !== undefined) {
      return `≥ ${minDisplay}`;
    } else {
      return `≤ ${maxDisplay}`;
    }
  };

  const hasFilter = range.min !== undefined || range.max !== undefined;

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              hasFilter && "border-solid"
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            {title}
            {hasFilter && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <span className="text-xs">{formatRangeDisplay()}</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{title}</h4>
              <p className="text-sm text-muted-foreground">
                Set minimum and maximum values for filtering.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-value">Minimum</Label>
                <Input
                  id="min-value"
                  type="number"
                  placeholder={placeholder.min}
                  value={inputValues.min}
                  onChange={(e) => handleMinChange(e.target.value)}
                  min={min}
                  max={max}
                  step={step}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-value">Maximum</Label>
                <Input
                  id="max-value"
                  type="number"
                  placeholder={placeholder.max}
                  value={inputValues.max}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  min={min}
                  max={max}
                  step={step}
                />
              </div>
            </div>

            {unit && (
              <p className="text-xs text-muted-foreground">
                Values are in {unit}
              </p>
            )}

            {hasFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full"
              >
                Clear filter
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Compact range filter
export function CompactRangeFilter<TData, TValue>({
  column,
  title,
  unit = "",
}: Omit<DataTableRangeFilterProps<TData, TValue>, 'min' | 'max' | 'step' | 'placeholder'>) {
  const [min, setMin] = React.useState("");
  const [max, setMax] = React.useState("");

  const applyFilter = () => {
    const minNum = min ? parseFloat(min) : undefined;
    const maxNum = max ? parseFloat(max) : undefined;
    
    if (minNum !== undefined || maxNum !== undefined) {
      column?.setFilterValue([minNum, maxNum]);
    } else {
      column?.setFilterValue(undefined);
    }
  };

  const clearFilter = () => {
    setMin("");
    setMax("");
    column?.setFilterValue(undefined);
  };

  const hasFilter = min !== "" || max !== "";

  return (
    <div className="flex items-center space-x-1">
      <Input
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        onBlur={applyFilter}
        className="h-8 w-16 text-xs"
        type="number"
      />
      <span className="text-muted-foreground">-</span>
      <Input
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        onBlur={applyFilter}
        className="h-8 w-16 text-xs"
        type="number"
      />
      {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="h-8 w-8 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}