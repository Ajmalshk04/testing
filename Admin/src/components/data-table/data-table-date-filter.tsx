"use client"

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { addDays, format, isAfter, isBefore, parseISO } from "date-fns";
import type { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { DateRange } from "react-day-picker";

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  placeholder?: string;
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
  placeholder = "Select date range",
}: DataTableDateFilterProps<TData, TValue>) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Apply filter when date range changes
  React.useEffect(() => {
    if (dateRange.from && dateRange.to) {
      column?.setFilterValue([dateRange.from, dateRange.to]);
    } else if (dateRange.from && !dateRange.to) {
      column?.setFilterValue([dateRange.from]);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [dateRange, column]);

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handlePresetSelect = (preset: string) => {
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (preset) {
      case "today":
        from = today;
        to = today;
        break;
      case "yesterday":
        from = addDays(today, -1);
        to = addDays(today, -1);
        break;
      case "last7days":
        from = addDays(today, -7);
        to = today;
        break;
      case "last30days":
        from = addDays(today, -30);
        to = today;
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    setDateRange({ from, to });
  };

  const formatDateRange = () => {
    if (!dateRange.from) return placeholder;
    if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy");
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              (dateRange.from || dateRange.to) && "border-solid"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {title}
            {(dateRange.from || dateRange.to) && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <span className="text-xs">{formatDateRange()}</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="flex flex-col space-y-2 p-4 border-r">
              <h4 className="text-sm font-medium">Presets</h4>
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Quick select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                </SelectContent>
              </Select>
              {(dateRange.from || dateRange.to) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full"
                >
                  Clear
                </Button>
              )}
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                if (range) {
                  setDateRange(range);
                } else {
                  setDateRange({ from: undefined, to: undefined });
                }
              }}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
      
      {(dateRange.from || dateRange.to) && (
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

// Single date picker
export function DataTableSingleDateFilter<TData, TValue>({
  column,
  title,
  placeholder = "Pick a date",
}: DataTableDateFilterProps<TData, TValue>) {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    column?.setFilterValue(date || undefined);
  }, [date, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed justify-start text-left font-normal",
            !date && "text-muted-foreground",
            date && "border-solid"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {title && (
            <>
              {title}
              {date && <Separator orientation="vertical" className="mx-2 h-4" />}
            </>
          )}
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        {date && (
          <div className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDate(undefined)}
              className="w-full"
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Month/Year picker
export function DataTableMonthFilter<TData, TValue>({
  column,
  title,
  placeholder = "Select month",
}: DataTableDateFilterProps<TData, TValue>) {
  const [month, setMonth] = React.useState<Date>();

  React.useEffect(() => {
    column?.setFilterValue(month || undefined);
  }, [month, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed justify-start text-left font-normal",
            !month && "text-muted-foreground",
            month && "border-solid"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {title && (
            <>
              {title}
              {month && <Separator orientation="vertical" className="mx-2 h-4" />}
            </>
          )}
          {month ? format(month, "MMMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={month}
          onSelect={setMonth}
          initialFocus
          captionLayout="dropdown"
          fromYear={2020}
          toYear={2030}
        />
        {month && (
          <div className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMonth(undefined)}
              className="w-full"
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}