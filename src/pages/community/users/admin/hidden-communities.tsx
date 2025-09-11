import { PostVisibility } from '@/types/types.generated';
import { PostsTable } from './components/posts-table';
import { PostsTableActions } from './components/posts-table-actions';
import { ShowPostsTableActions } from './components/show-posts-table-actions';
import { usePostsTable } from './hooks/use-posts-table';

function HiddenCommunitiesAdminPage() {
  // Table with public posts (that can be hidden)
  const publicPostsTable = usePostsTable({
    visibility: PostVisibility.Public,
    pageSize: 10,
  });

  // Table with hidden posts (that can be shown)
  const hiddenPostsTable = usePostsTable({
    visibility: PostVisibility.Private,
    pageSize: 10,
  });

  return (
    <div className="p-6 space-y-24">
      {/* Public Posts Table */}
      <div>
        <PostsTable
          posts={publicPostsTable.posts}
          totalCount={publicPostsTable.totalCount}
          error={publicPostsTable.error}
          rowSelection={publicPostsTable.rowSelection}
          pagination={publicPostsTable.pagination}
          sorting={publicPostsTable.sorting}
          columnFilters={publicPostsTable.columnFilters}
          onRowSelectionChange={publicPostsTable.handleRowSelectionChange}
          onPaginationChange={publicPostsTable.handlePaginationChange}
          onSortingChange={publicPostsTable.handleSortingChange}
          onColumnFiltersChange={publicPostsTable.handleColumnFiltersChange}
          title="Public Posts"
          description="Please select what to show."
          searchValue={publicPostsTable.searchValue}
          onSearchChange={publicPostsTable.handleSearchChange}
        />

        <PostsTableActions
          selectedPosts={publicPostsTable.selectedPosts}
          onReset={publicPostsTable.resetSelection}
          onSelectionCleared={publicPostsTable.resetSelection}
        />
      </div>

      {/* Hidden Posts Table */}
      <div>
        <PostsTable
          posts={hiddenPostsTable.posts}
          totalCount={hiddenPostsTable.totalCount}
          error={hiddenPostsTable.error}
          rowSelection={hiddenPostsTable.rowSelection}
          pagination={hiddenPostsTable.pagination}
          sorting={hiddenPostsTable.sorting}
          columnFilters={hiddenPostsTable.columnFilters}
          onRowSelectionChange={hiddenPostsTable.handleRowSelectionChange}
          onPaginationChange={hiddenPostsTable.handlePaginationChange}
          onSortingChange={hiddenPostsTable.handleSortingChange}
          onColumnFiltersChange={hiddenPostsTable.handleColumnFiltersChange}
          title="Hidden Posts"
          description="Please select what to hide."
          searchValue={hiddenPostsTable.searchValue}
          onSearchChange={hiddenPostsTable.handleSearchChange}
        />

        <ShowPostsTableActions
          selectedPosts={hiddenPostsTable.selectedPosts}
          onReset={hiddenPostsTable.resetSelection}
          onSelectionCleared={hiddenPostsTable.resetSelection}
        />
      </div>
    </div>
  );
}

export default HiddenCommunitiesAdminPage;
