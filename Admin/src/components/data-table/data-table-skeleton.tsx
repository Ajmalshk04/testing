"use client"

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  cellWidths?: string[];
  withPagination?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton({
  columnCount = 4,
  rowCount = 10,
  searchableColumnCount = 1,
  filterableColumnCount = 0,
  cellWidths = ["auto"],
  withPagination = true,
  shrinkZero = false,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full space-y-3 overflow-auto">
      {/* Toolbar skeleton */}
      <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumnCount > 0 ? (
            <Skeleton className="h-8 w-40 lg:w-64" />
          ) : null}
          {filterableColumnCount > 0 ? (
            <div className="flex space-x-2">
              {Array.from({ length: filterableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead
                  key={i}
                  style={{
                    width: cellWidths[i % cellWidths.length],
                    minWidth: shrinkZero ? "auto" : 0,
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cellWidths[j % cellWidths.length],
                      minWidth: shrinkZero ? "auto" : 0,
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      {withPagination ? (
        <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
          <Skeleton className="h-8 w-40 shrink-0" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Preset skeleton configurations
export function DataTableSkeletonCard({
  className,
  ...props
}: DataTableSkeletonProps & { className?: string }) {
  return (
    <div className={className}>
      <DataTableSkeleton {...props} />
    </div>
  );
}

export function CompactDataTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={3}
      rowCount={5}
      cellWidths={["100px", "200px", "100px"]}
      withPagination={false}
      shrinkZero
    />
  );
}

export function WideDataTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={8}
      rowCount={15}
      searchableColumnCount={2}
      filterableColumnCount={3}
      cellWidths={["80px", "120px", "150px", "100px", "80px", "120px", "100px", "80px"]}
    />
  );
}