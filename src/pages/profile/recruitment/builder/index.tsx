import { useGetProgramsByBuilderV2Query } from '@/apollo/queries/get-programs-by-builder.generated';
import type { GetProgramsV2Query } from '@/apollo/queries/programs-v2.generated';
import StatusBadge from '@/components/recruitment/statusBadge/statusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/lib/hooks/use-auth';
import { formatDate, formatPrice, getCurrencyIcon } from '@/lib/utils';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

const PageSize = 10;

type ProgramData = NonNullable<NonNullable<GetProgramsV2Query['programsV2']>['data']>[number];

const ProfileRecruitmentBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { userId } = useAuth();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, loading, error } = useGetProgramsByBuilderV2Query({
    variables: {
      builderId: userId,
      pagination: {
        limit: PageSize,
        offset: (currentPage - 1) * PageSize,
      },
    },
    skip: !userId,
  });

  const programs = data?.programsByBuilderIdV2?.data || [];
  const totalCount = data?.programsByBuilderIdV2?.count || 0;
  const totalPages = Math.ceil(totalCount / PageSize);

  const columns: ColumnDef<ProgramData>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue('title')}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'status',
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
              <DropdownMenuCheckboxItem checked={isAllSelected} onCheckedChange={handleAllChange}>
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={currentStatus === 'open'}
                onCheckedChange={() => handleStatusChange('open')}
              >
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={currentStatus === 'closed'}
                onCheckedChange={() => handleStatusChange('closed')}
              >
                Closed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={currentStatus === 'draft'}
                onCheckedChange={() => handleStatusChange('draft')}
              >
                Draft
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={currentStatus === 'under_review'}
                onCheckedChange={() => handleStatusChange('under_review')}
              >
                Under Review
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={currentStatus === 'declined'}
                onCheckedChange={() => handleStatusChange('declined')}
              >
                Declined
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue('status')} />;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 100,
    },
    {
      accessorKey: 'deadline',
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Deadline
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className="font-bold">{formatDate(row.getValue('deadline'))}</div>;
      },
      sortingFn: 'datetime',
      size: 100,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Budget
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
            {formatPrice(price)}{' '}
            <div className="flex items-center gap-2">
              {token && getCurrencyIcon(token.tokenName || '')}
              {token?.tokenName}
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const priceA = Number.parseFloat(rowA.original.price || '0');
        const priceB = Number.parseFloat(rowB.original.price || '0');
        return priceA - priceB;
      },
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Post Date
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className="font-bold">{formatDate(row.getValue('createdAt'))}</div>;
      },
      sortingFn: 'datetime',
      size: 100,
    },
  ];

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

  return (
    <div className="flex flex-col justify-between bg-white px-10 py-7 rounded-2xl">
      <div>
        <Link
          to={`/profile`}
          className="flex items-center w-fit mb-5 text-sm font-semibold text-gray-text"
        >
          <ChevronLeft className="w-4" />
          Dashboard
        </Link>
        <div className="mb-6 font-bold text-2xl text-gray-mid-dark">My Applied Jobs</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-500">Loading programs...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-red-500">Error loading programs. Please try again.</div>
        </div>
      ) : (
        <>
          <div className="border border-[#E4E4E7] rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-[#E4E4E7]">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{ width: `${header.getSize()}px` }}
                          className="p-4 text-[#4B5563]"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                      data-state={row.getIsSelected() && 'selected'}
                      className="cursor-pointer hover:bg-gray-50 border-b border-[#E4E4E7] last:border-b-0 text-[#4B5563]"
                      onClick={() => navigate(`/profile/recruitment/builder/${row.original.id}`)}
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center px-4 py-[30px]">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchParams({ page: String(currentPage - 1) })}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchParams({ page: String(page) })}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchParams({ page: String(currentPage + 1) })}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileRecruitmentBuilder;
