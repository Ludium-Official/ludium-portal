import { UserRole } from '@/types/types.generated';
import { DemoteUsersTableActions } from './components/demote-users-table-actions';
import { PromoteUsersTableActions } from './components/promote-users-table-actions';
import { UsersTable } from './components/users-table';
import { useRolesTable } from './hooks/use-roles-table';

function MasterAdminPage() {
  // Table with regular users (that can be promoted to admin)
  const regularUsersTable = useRolesTable({
    role: UserRole.User,
    pageSize: 10,
  });

  // Table with admin users (that can be demoted to regular users)
  const adminUsersTable = useRolesTable({
    role: UserRole.Admin,
    pageSize: 10,
  });

  return (
    <div className="p-6 space-y-24">
      {/* Regular Users Table */}
      <div>
        <UsersTable
          users={regularUsersTable.users}
          totalCount={regularUsersTable.totalCount}
          error={regularUsersTable.error}
          rowSelection={regularUsersTable.rowSelection}
          pagination={regularUsersTable.pagination}
          sorting={regularUsersTable.sorting}
          columnFilters={regularUsersTable.columnFilters}
          onRowSelectionChange={regularUsersTable.handleRowSelectionChange}
          onPaginationChange={regularUsersTable.handlePaginationChange}
          onSortingChange={regularUsersTable.handleSortingChange}
          onColumnFiltersChange={regularUsersTable.handleColumnFiltersChange}
          title="Regular Users"
          description="Please select what to show."
          searchValue={regularUsersTable.searchValue}
          onSearchChange={regularUsersTable.handleSearchChange}
        />

        <PromoteUsersTableActions
          selectedUsers={regularUsersTable.selectedUsers}
          onReset={regularUsersTable.resetSelection}
          onSelectionCleared={regularUsersTable.resetSelection}
        />
      </div>

      {/* Admin Users Table */}
      <div>
        <UsersTable
          users={adminUsersTable.users}
          totalCount={adminUsersTable.totalCount}
          error={adminUsersTable.error}
          rowSelection={adminUsersTable.rowSelection}
          pagination={adminUsersTable.pagination}
          sorting={adminUsersTable.sorting}
          columnFilters={adminUsersTable.columnFilters}
          onRowSelectionChange={adminUsersTable.handleRowSelectionChange}
          onPaginationChange={adminUsersTable.handlePaginationChange}
          onSortingChange={adminUsersTable.handleSortingChange}
          onColumnFiltersChange={adminUsersTable.handleColumnFiltersChange}
          title="Admin Users"
          description="Please select what to hide."
          searchValue={adminUsersTable.searchValue}
          onSearchChange={adminUsersTable.handleSearchChange}
        />

        <DemoteUsersTableActions
          selectedUsers={adminUsersTable.selectedUsers}
          onReset={adminUsersTable.resetSelection}
          onSelectionCleared={adminUsersTable.resetSelection}
        />
      </div>
    </div>
  );
}

export default MasterAdminPage;
