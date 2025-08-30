"use client"

import * as React from "react";
import type { Column } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DataTableSliderFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

interface SliderFilterValue {
  min: number;
  max: number;
}

export function DataTableSliderFilter<TData, TValue>({
  column,
  title,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
}: DataTableSliderFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as SliderFilterValue | undefined;
  const [value, setValue] = React.useState<[number, number]>([
    filterValue?.min ?? min,
    filterValue?.max ?? max,
  ]);
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultFormatValue = React.useCallback(
    (val: number) => {
      if (formatValue) {
        return formatValue(val);
      }
      return unit ? `${val}${unit}` : val.toString();
    },
    [formatValue, unit]
  );

  const handleValueChange = (newValue: number[]) => {
    if (newValue.length === 2) {
      setValue([newValue[0], newValue[1]] as [number, number]);
    }
  };

  const handleValueCommit = (newValue: number[]) => {
    if (newValue.length === 2) {
      const [minVal, maxVal] = newValue;
      
      // Only set filter if values are different from defaults
      if (minVal !== min || maxVal !== max) {
        column?.setFilterValue({
          min: minVal,
          max: maxVal,
        });
      } else {
        column?.setFilterValue(undefined);
      }
    }
  };

  const handleReset = () => {
    setValue([min, max]);
    column?.setFilterValue(undefined);
  };

  const handleManualChange = (index: 0 | 1, val: string) => {
    const numVal = Math.max(min, Math.min(max, Number(val) || 0));
    const newValue: [number, number] = [...value];
    newValue[index] = numVal;
    
    // Ensure min <= max
    if (index === 0 && newValue[0] > newValue[1]) {
      newValue[1] = newValue[0];
    } else if (index === 1 && newValue[1] < newValue[0]) {
      newValue[0] = newValue[1];
    }
    
    setValue(newValue);
    handleValueCommit([newValue[0], newValue[1]]);
  };

  const hasActiveFilter = filterValue !== undefined;
  const displayValue = hasActiveFilter 
    ? `${defaultFormatValue(filterValue.min)} - ${defaultFormatValue(filterValue.max)}`
    : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            hasActiveFilter && "border-primary bg-primary/10"
          )}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          {title}
          {hasActiveFilter && (
            <>
              <span className="mx-2 h-4 w-px bg-border" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {displayValue}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">{title}</Label>
            <p className="text-xs text-muted-foreground">
              Adjust the range using the slider or input fields
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <Slider
              value={value}
              onValueChange={handleValueChange}
              onValueCommit={handleValueCommit}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
            
            {/* Value display */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{defaultFormatValue(min)}</span>
              <span className="font-medium">
                {defaultFormatValue(value[0])} - {defaultFormatValue(value[1])}
              </span>
              <span>{defaultFormatValue(max)}</span>
            </div>
          </div>

          {/* Manual input */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Min</Label>
              <Input
                type="number"
                value={value[0]}
                onChange={(e) => handleManualChange(0, e.target.value)}
                min={min}
                max={max}
                step={step}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Max</Label>
              <Input
                type="number"
                value={value[1]}
                onChange={(e) => handleManualChange(1, e.target.value)}
                min={min}
                max={max}
                step={step}
                className="h-8"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Inline slider filter (always visible)
export function InlineDataTableSliderFilter<TData, TValue>({
  column,
  title,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
}: DataTableSliderFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as SliderFilterValue | undefined;
  const [value, setValue] = React.useState<[number, number]>([
    filterValue?.min ?? min,
    filterValue?.max ?? max,
  ]);

  const defaultFormatValue = React.useCallback(
    (val: number) => {
      if (formatValue) {
        return formatValue(val);
      }
      return unit ? `${val}${unit}` : val.toString();
    },
    [formatValue, unit]
  );

  const handleValueCommit = (newValue: number[]) => {
    if (newValue.length === 2) {
      const [minVal, maxVal] = newValue;
      
      if (minVal !== min || maxVal !== max) {
        column?.setFilterValue({
          min: minVal,
          max: maxVal,
        });
      } else {
        column?.setFilterValue(undefined);
      }
    }
  };

  return (
    <div className="w-48 space-y-2 rounded-md border p-3">
      <Label className="text-sm font-medium">{title}</Label>
      
      <Slider
        value={value}
        onValueChange={(newValue) => {
          if (newValue.length === 2) {
            setValue([newValue[0], newValue[1]] as [number, number]);
          }
        }}
        onValueCommit={(newValue) => {
          if (newValue.length === 2) {
            handleValueCommit([newValue[0], newValue[1]] as [number, number]);
          }
        }}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{defaultFormatValue(min)}</span>
        <span className="font-medium">
          {defaultFormatValue(value[0])} - {defaultFormatValue(value[1])}
        </span>
        <span>{defaultFormatValue(max)}</span>
      </div>
    </div>
  );
}