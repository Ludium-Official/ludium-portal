import type { PostsQuery } from '@/apollo/queries/posts.generated';
import { DataTable } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { hiddenPostsColumns } from '../lib/hidden-posts-columns';

type Post = NonNullable<NonNullable<PostsQuery['posts']>['data']>[0];

interface PostsTableProps {
  posts: Post[];
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
  title: string;
  description?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const PostsTable = ({
  posts,
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
  title,
  description,
  searchValue = '',
  onSearchChange,
}: PostsTableProps) => {
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Error loading posts: {error?.message || 'Unknown error'}
        </p>
      </div>
    );
  }

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
        </div>
      </div>

      {/* Selection Info */}
      {/* {selectedPosts.length > 0 && (
        <div className="text-sm text-amber-600">
          {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
          <span className="ml-2">(Selection will be cleared when changing pages)</span>
        </div>
      )} */}

      <DataTable
        columns={hiddenPostsColumns}
        data={posts}
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
