import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import type { ProgramType, ProgramVisibility } from '@/types/types.generated';
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseProgramsTableOptions {
  visibility?: ProgramVisibility;
  pageSize?: number;
}

export const useProgramsTable = (options: UseProgramsTableOptions = {}) => {
  const { visibility, pageSize = 10 } = options;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedType, setSelectedType] = useState<ProgramType | null>(null);

  // Create filters array
  const filters = [];

  if (visibility) {
    filters.push({
      field: 'visibility',
      value: visibility,
    });
  }

  if (selectedType) {
    filters.push({
      field: 'type',
      value: selectedType,
    });
  }

  if (searchValue.trim()) {
    filters.push({
      field: 'name',
      value: searchValue.trim(),
    });
  }

  const { data, loading, error } = useProgramsQuery({
    variables: {
      pagination: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        ...(filters.length > 0 && { filter: filters }),
      },
    },
  });

  const programs = data?.programs?.data || [];
  const totalCount = data?.programs?.count || 0;

  const selectedPrograms = programs.filter((_, index) => rowSelection[index]);

  const handleRowSelectionChange = (
    updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
  ) => {
    if (typeof updaterOrValue === 'function') {
      setRowSelection(updaterOrValue);
    } else {
      setRowSelection(updaterOrValue);
    }
  };

  const handlePaginationChange = (
    updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    if (typeof updaterOrValue === 'function') {
      setPagination(updaterOrValue);
    } else {
      setPagination(updaterOrValue);
    }
    // Reset selection when pagination changes
    setRowSelection({});
  };

  const handleSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState),
  ) => {
    if (typeof updaterOrValue === 'function') {
      setSorting(updaterOrValue);
    } else {
      setSorting(updaterOrValue);
    }
    // Reset selection when sorting changes
    setRowSelection({});
  };

  const handleColumnFiltersChange = (
    updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState),
  ) => {
    if (typeof updaterOrValue === 'function') {
      setColumnFilters(updaterOrValue);
    } else {
      setColumnFilters(updaterOrValue);
    }
    // Reset selection when filters change
    setRowSelection({});
  };

  const resetSelection = () => {
    setRowSelection({});
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Reset pagination when searching
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // Reset selection when searching
    setRowSelection({});
  };

  const handleTypeChange = (type: ProgramType | null) => {
    setSelectedType(type);
    // Reset pagination when filter changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // Reset selection when filter changes
    setRowSelection({});
  };

  return {
    // Data
    programs,
    totalCount,
    selectedPrograms,
    loading,
    error,

    // State
    rowSelection,
    pagination,
    sorting,
    columnFilters,
    searchValue,
    selectedType,

    // Handlers
    handleRowSelectionChange,
    handlePaginationChange,
    handleSortingChange,
    handleColumnFiltersChange,
    handleSearchChange,
    handleTypeChange,
    resetSelection,
  };
};
