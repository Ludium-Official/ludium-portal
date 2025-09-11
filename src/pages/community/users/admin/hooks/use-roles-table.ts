import { useAdminUsersQuery } from '@/apollo/queries/admin-users.generated';
import type { UserRole } from '@/types/types.generated';
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseRolesTableOptions {
  role: UserRole;
  pageSize?: number;
}

export const useRolesTable = (options: UseRolesTableOptions) => {
  const { role, pageSize = 10 } = options;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState('');

  // Create filters array
  const filters = [];

  if (searchValue.trim()) {
    filters.push({
      field: 'firstName',
      value: searchValue.trim(),
    });
  }

  const { data, loading, error } = useAdminUsersQuery({
    variables: {
      role,
      pagination: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        ...(filters.length > 0 && { filter: filters }),
      },
    },
  });

  const users = data?.adminUsers?.data || [];
  const totalCount = data?.adminUsers?.count || 0;

  const selectedUsers = users.filter((_, index) => rowSelection[index]);

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

  return {
    // Data
    users,
    totalCount,
    selectedUsers,
    loading,
    error,

    // State
    rowSelection,
    pagination,
    sorting,
    columnFilters,
    searchValue,

    // Handlers
    handleRowSelectionChange,
    handlePaginationChange,
    handleSortingChange,
    handleColumnFiltersChange,
    handleSearchChange,
    resetSelection,
  };
};
