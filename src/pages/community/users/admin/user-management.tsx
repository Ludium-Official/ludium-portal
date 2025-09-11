import { UnbanUsersTableActions } from "./components/unban-users-table-actions";
import { UsersTable } from "./components/users-table";
import { UsersTableActions } from "./components/users-table-actions";
import { useUsersTable } from "./hooks/use-users-table";

function UserManagementAdminPage() {
  // Table with active users (that can be banned)
  const activeUsersTable = useUsersTable({
    onlyBanned: false,
    pageSize: 10,
  });

  // Table with banned users (that can be unbanned)
  const bannedUsersTable = useUsersTable({
    onlyBanned: true,
    pageSize: 10,
  });

  return (
    <div className="p-6 space-y-24">
      {/* Active Users Table */}
      <div>
        <UsersTable
          users={activeUsersTable.users}
          totalCount={activeUsersTable.totalCount}
          error={activeUsersTable.error}
          rowSelection={activeUsersTable.rowSelection}
          pagination={activeUsersTable.pagination}
          sorting={activeUsersTable.sorting}
          columnFilters={activeUsersTable.columnFilters}
          onRowSelectionChange={activeUsersTable.handleRowSelectionChange}
          onPaginationChange={activeUsersTable.handlePaginationChange}
          onSortingChange={activeUsersTable.handleSortingChange}
          onColumnFiltersChange={activeUsersTable.handleColumnFiltersChange}
          title="Active Users"
          description="Please select what to show."
          searchValue={activeUsersTable.searchValue}
          onSearchChange={activeUsersTable.handleSearchChange}
        />

        <UsersTableActions
          selectedUsers={activeUsersTable.selectedUsers}
          onReset={activeUsersTable.resetSelection}
          onSelectionCleared={activeUsersTable.resetSelection}
        />
      </div>

      {/* Banned Users Table */}
      <div>
        <UsersTable
          users={bannedUsersTable.users}
          totalCount={bannedUsersTable.totalCount}
          error={bannedUsersTable.error}
          rowSelection={bannedUsersTable.rowSelection}
          pagination={bannedUsersTable.pagination}
          sorting={bannedUsersTable.sorting}
          columnFilters={bannedUsersTable.columnFilters}
          onRowSelectionChange={bannedUsersTable.handleRowSelectionChange}
          onPaginationChange={bannedUsersTable.handlePaginationChange}
          onSortingChange={bannedUsersTable.handleSortingChange}
          onColumnFiltersChange={bannedUsersTable.handleColumnFiltersChange}
          title="Banned Users"
          description="Please select what to hide."
          searchValue={bannedUsersTable.searchValue}
          onSearchChange={bannedUsersTable.handleSearchChange}
        />

        <UnbanUsersTableActions
          selectedUsers={bannedUsersTable.selectedUsers}
          onReset={bannedUsersTable.resetSelection}
          onSelectionCleared={bannedUsersTable.resetSelection}
        />
      </div>
    </div>
  );
}

export default UserManagementAdminPage;
