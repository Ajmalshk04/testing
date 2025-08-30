import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  RowSelectionState
} from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";

// Base data table configuration
export interface DataTableConfig<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  onRowSelect?: (selectedRows: TData[]) => void;
  enableRowSelection?: boolean;
  enableMultiSelect?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

// Filter types
export interface FilterOption {
  label: string;
  value: string;
  icon?: LucideIcon;
  count?: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface RangeFilter {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface FacetedFilterConfig {
  column: string;
  title: string;
  options: FilterOption[];
  variant?: "default" | "outline";
}

export interface DateFilterConfig {
  column: string;
  title: string;
  placeholder?: string;
}

export interface RangeFilterConfig {
  column: string;
  title: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface SliderFilterConfig {
  column: string;
  title: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

// Action types
export interface DataTableAction<TData> {
  label: string;
  icon?: LucideIcon;
  onClick: (selectedRows: TData[]) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

// Column header configuration
export interface ColumnHeaderProps {
  title: string;
  canSort?: boolean;
  canFilter?: boolean;
  className?: string;
}

// Toolbar configuration
export interface DataTableToolbarConfig<TData> {
  searchColumn?: string;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilterConfig[];
  dateFilters?: DateFilterConfig[];
  rangeFilters?: RangeFilterConfig[];
  sliderFilters?: SliderFilterConfig[];
  actions?: DataTableAction<TData>[];
}

// State management
export interface DataTableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  globalFilter: string;
}

// View options
export interface ViewOption {
  id: string;
  label: string;
  visible: boolean;
}

// Preset configurations
export interface DataTablePreset<TData> {
  name: string;
  description?: string;
  config: Partial<DataTableConfig<TData>>;
  toolbarConfig?: Partial<DataTableToolbarConfig<TData>>;
}

// Export all TanStack Table types that we might need
export type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  RowSelectionState,
  Table as TableInstance,
  Row,
  Cell,
  Header,
  Column
} from "@tanstack/react-table";