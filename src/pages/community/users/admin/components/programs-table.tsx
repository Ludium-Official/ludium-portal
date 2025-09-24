import type { ProgramsQuery } from '@/apollo/queries/programs.generated';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ProgramType } from '@/types/types.generated';
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { ListFilter, Search } from 'lucide-react';
import { hiddenProgramsColumns } from '../lib/hidden-programs-columns';

type Program = NonNullable<NonNullable<ProgramsQuery['programs']>['data']>[0];

interface ProgramsTableProps {
  programs: Program[];
  totalCount: number;
  error?: Error;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  onRowSelectionChange: (
    updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
  ) => void;
  onPaginationChange: (
    updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState),
  ) => void;
  onSortingChange: (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => void;
  onColumnFiltersChange: (
    updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState),
  ) => void;
  selectedPrograms: Program[];
  title: string;
  description?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  selectedType?: ProgramType | null;
  onTypeChange?: (type: ProgramType | null) => void;
}

export const ProgramsTable = ({
  programs,
  totalCount,
  error,
  rowSelection,
  pagination,
  sorting,
  columnFilters,
  onRowSelectionChange,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  // selectedPrograms,
  title,
  description,
  searchValue = '',
  onSearchChange,
  selectedType = null,
  onTypeChange,
}: ProgramsTableProps) => {
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Error loading programs: {error?.message || 'Unknown error'}
        </p>
      </div>
    );
  }

  const getTypeLabel = (type: ProgramType | null) => {
    switch (type) {
      case ProgramType.Regular:
        return 'Recruitment (regular)';
      case ProgramType.Funding:
        return 'Funding';
      default:
        return 'All Types';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-muted-foreground">{title}</h2>
          <p className="text-muted-foreground text-xs">
            {description || 'Please select what to show.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 w-64 h-10"
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ListFilter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTypeChange?.(null)}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTypeChange?.(ProgramType.Regular)}>
                Recruitment (regular)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTypeChange?.(ProgramType.Funding)}>
                Funding
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selected Filter Display */}
      {selectedType && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <span className="text-sm font-medium">{getTypeLabel(selectedType)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTypeChange?.(null)}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Selection Info */}
      {/* {selectedPrograms.length > 0 && (
        <div className="text-sm text-amber-600">
          {selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''} selected
          <span className="ml-2">(Selection will be cleared when changing pages)</span>
        </div>
      )} */}

      <DataTable
        columns={hiddenProgramsColumns}
        data={programs}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalCount={totalCount}
        sorting={sorting}
        onSortingChange={onSortingChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
      />
    </div>
  );
};
