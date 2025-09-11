import { ProgramVisibility } from "@/types/types.generated";
import { ProgramsTable } from "./components/programs-table";
import { ProgramsTableActions } from "./components/programs-table-actions";
import { ShowProgramsTableActions } from "./components/show-programs-table-actions";
import { useProgramsTable } from "./hooks/use-programs-table";

function HiddenProgramsAdminPage() {
  // Table with public programs (that can be hidden)
  const publicProgramsTable = useProgramsTable({
    visibility: ProgramVisibility.Public,
    pageSize: 10,
  });

  // Table with hidden programs (that can be shown)
  const hiddenProgramsTable = useProgramsTable({
    visibility: ProgramVisibility.Private,
    pageSize: 10,
  });

  return (
    <div className="p-6 space-y-24">
      {/* Public Programs Table */}
      <div>
        <ProgramsTable
          programs={publicProgramsTable.programs}
          totalCount={publicProgramsTable.totalCount}
          error={publicProgramsTable.error}
          rowSelection={publicProgramsTable.rowSelection}
          pagination={publicProgramsTable.pagination}
          sorting={publicProgramsTable.sorting}
          columnFilters={publicProgramsTable.columnFilters}
          onRowSelectionChange={publicProgramsTable.handleRowSelectionChange}
          onPaginationChange={publicProgramsTable.handlePaginationChange}
          onSortingChange={publicProgramsTable.handleSortingChange}
          onColumnFiltersChange={publicProgramsTable.handleColumnFiltersChange}
          selectedPrograms={publicProgramsTable.selectedPrograms}
          title="Public Programs"
          description="Please select what to show."
          searchValue={publicProgramsTable.searchValue}
          onSearchChange={publicProgramsTable.handleSearchChange}
          selectedType={publicProgramsTable.selectedType}
          onTypeChange={publicProgramsTable.handleTypeChange}
        />

        <ProgramsTableActions
          selectedPrograms={publicProgramsTable.selectedPrograms}
          onReset={publicProgramsTable.resetSelection}
          onSelectionCleared={publicProgramsTable.resetSelection}
        />
      </div>

      {/* Hidden Programs Table */}
      <div>
        <ProgramsTable
          programs={hiddenProgramsTable.programs}
          totalCount={hiddenProgramsTable.totalCount}
          error={hiddenProgramsTable.error}
          rowSelection={hiddenProgramsTable.rowSelection}
          pagination={hiddenProgramsTable.pagination}
          sorting={hiddenProgramsTable.sorting}
          columnFilters={hiddenProgramsTable.columnFilters}
          onRowSelectionChange={hiddenProgramsTable.handleRowSelectionChange}
          onPaginationChange={hiddenProgramsTable.handlePaginationChange}
          onSortingChange={hiddenProgramsTable.handleSortingChange}
          onColumnFiltersChange={hiddenProgramsTable.handleColumnFiltersChange}
          selectedPrograms={hiddenProgramsTable.selectedPrograms}
          title="Hidden Programs"
          description="Please select what to hide."
          searchValue={hiddenProgramsTable.searchValue}
          onSearchChange={hiddenProgramsTable.handleSearchChange}
          selectedType={hiddenProgramsTable.selectedType}
          onTypeChange={hiddenProgramsTable.handleTypeChange}
        />

        <ShowProgramsTableActions
          selectedPrograms={hiddenProgramsTable.selectedPrograms}
          onReset={hiddenProgramsTable.resetSelection}
          onSelectionCleared={hiddenProgramsTable.resetSelection}
        />
      </div>
    </div>
  );
}

export default HiddenProgramsAdminPage;
