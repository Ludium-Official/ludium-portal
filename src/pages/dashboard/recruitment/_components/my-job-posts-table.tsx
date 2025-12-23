import { useDeleteProgramV2Mutation } from "@/apollo/mutation/delete-program-v2.generated";
import StatusBadge from "@/components/recruitment/statusBadge/statusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  commaNumber,
  formatDate,
  formatPrice,
  getCurrencyIcon,
} from "@/lib/utils";
import { ProgramStatusV2 } from "@/types/types.generated";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pagination, PageSize } from "@/components/ui/pagination";
import { ChevronDown, ChevronsUpDown, Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BuilderProgramData,
  MyJobPostsTableProps,
  ProgramData,
  SponsorProgramData,
} from "@/types/dashboard";

export const MyJobPostsTable: React.FC<MyJobPostsTableProps> = ({
  activityFilter,
  programs,
  totalCount,
  loading,
  error,
  onRefetch,
  variant,
}) => {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const [deleteProgram] = useDeleteProgramV2Mutation();

  const totalPages = Math.ceil(totalCount / (PageSize * 2));

  const handleDeleteProgram = async () => {
    if (!programToDelete) return;
    try {
      await deleteProgram({
        variables: {
          id: programToDelete,
        },
      });
      toast.success("Program deleted successfully");
      onRefetch?.();
    } catch (err) {
      console.error("Failed to delete program:", err);
      toast.error("Failed to delete program");
    } finally {
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
    }
  };

  const openDeleteDialog = (programId: string) => {
    setProgramToDelete(programId);
    setDeleteDialogOpen(true);
  };

  const baseColumns: ColumnDef<ProgramData>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {row.getValue("title")}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "price",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {variant === "sponsor" ? "Price" : "Budget"}
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const price = row.original.price;
          const token = row.original.token;

          if (!price) {
            return <div className="font-bold">Negotiable</div>;
          }

          return (
            <div className="flex items-center gap-3 font-bold">
              {formatPrice(price)}{" "}
              <div className="flex items-center gap-2">
                {token && getCurrencyIcon(token.tokenName || "")}
                {token?.tokenName}
              </div>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const priceA = Number.parseFloat(rowA.original.price || "0");
          const priceB = Number.parseFloat(rowB.original.price || "0");
          return priceA - priceB;
        },
        size: 130,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Post date
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-bold">
              {formatDate(row.getValue("createdAt"))}
            </div>
          );
        },
        sortingFn: "datetime",
        size: 130,
      },
    ],
    [variant]
  );

  const sponsorColumns: ColumnDef<ProgramData>[] = useMemo(
    () => [
      {
        accessorKey: "status",
        header: ({ column }) => {
          const filterValue = (column.getFilterValue() as string[]) || [];
          const isAllSelected = filterValue.length === 0;

          const handleAllChange = (checked: boolean) => {
            if (checked) {
              column.setFilterValue(undefined);
            }
          };

          const handleStatusChange = (status: string) => {
            column.setFilterValue([status]);
          };

          const currentStatus = filterValue.length > 0 ? filterValue[0] : null;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem
                  checked={isAllSelected}
                  onCheckedChange={handleAllChange}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={currentStatus === "open"}
                  onCheckedChange={() => handleStatusChange("open")}
                >
                  Open
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={currentStatus === "closed"}
                  onCheckedChange={() => handleStatusChange("closed")}
                >
                  Closed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={currentStatus === "draft"}
                  onCheckedChange={() => handleStatusChange("draft")}
                >
                  Draft
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={currentStatus === "under_review"}
                  onCheckedChange={() => handleStatusChange("under_review")}
                >
                  Under Review
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={currentStatus === "declined"}
                  onCheckedChange={() => handleStatusChange("declined")}
                >
                  Declined
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        cell: ({ row }) => {
          return <StatusBadge status={row.getValue("status")} />;
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        size: 110,
      },
      {
        accessorKey: "deadline",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Deadline
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-bold">
              {formatDate(row.getValue("deadline"))}
            </div>
          );
        },
        sortingFn: "datetime",
        size: 130,
      },
      {
        accessorKey: "applicationCount",
        header: "Applicants",
        cell: ({ row }) => (
          <div className="font-bold">{row.getValue("applicationCount")}</div>
        ),
        size: 100,
      },
      {
        accessorKey: "actions",
        header: "",
        cell: ({ row }) => {
          const program = row.original as SponsorProgramData;
          const programId = program.id;
          const programStatus = program.status;
          const isClosed = programStatus === ProgramStatusV2.Closed;

          const handleEdit = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (programId) {
              navigate(`/programs/recruitment/${programId}/edit`);
            }
          };

          const handleDelete = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!programId) return;
            openDeleteDialog(programId);
          };

          const handleDropdownClick = (e: React.MouseEvent) => {
            e.stopPropagation();
          };

          return (
            <div onClick={handleDropdownClick}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={handleDropdownClick}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={handleDropdownClick}>
                  <DropdownMenuItem onClick={handleEdit} disabled={isClosed}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 50,
      },
    ],
    [navigate]
  );

  const builderColumns: ColumnDef<ProgramData>[] = useMemo(
    () => [
      {
        id: "appliedDate",
        accessorFn: (row) =>
          (row as BuilderProgramData).myApplication?.createdAt,
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Applied Date
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const appliedDate = (row.original as BuilderProgramData).myApplication
            ?.createdAt;
          return (
            <div className="font-bold">
              {appliedDate ? formatDate(appliedDate) : "-"}
            </div>
          );
        },
        sortingFn: "datetime",
        size: 130,
      },
    ],
    []
  );

  const columns = useMemo(() => {
    if (variant === "sponsor") {
      return [...baseColumns, ...sponsorColumns];
    }
    return [...baseColumns, ...builderColumns];
  }, [baseColumns, sponsorColumns, builderColumns, variant]);

  const table = useReactTable({
    data: programs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  const handleRowClick = (programId: string) => {
    if (variant === "sponsor") {
      navigate(`/dashboard/recruitment/sponsor/${programId}`);
    } else {
      navigate(`/dashboard/recruitment/builder/${programId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-gray-500">Loading programs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-red-500">
          Error loading programs. Please try again.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-[#E4E4E7] rounded-2xl overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span
              className={cn("w-3 h-3 rounded-full", activityFilter.dotColor)}
            />
            <span className="text-lg font-semibold text-slate-800">
              {activityFilter.label}
            </span>
          </div>
          ({commaNumber(totalCount)})
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-[#E4E4E7]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="p-4 text-[#4B5563]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-50 border-b border-[#E4E4E7] last:border-b-0 text-[#4B5563]"
                  onClick={() => handleRowClick(row.original.id || "")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                      className="px-4 py-[30px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center px-4 py-[30px]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <Pagination totalCount={totalCount} pageSize={PageSize * 2} />
      </div>

      {variant === "sponsor" && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Program</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this program? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProgram}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default MyJobPostsTable;
