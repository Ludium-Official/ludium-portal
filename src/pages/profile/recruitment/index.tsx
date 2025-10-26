import StatusBadge from '@/components/recruitment/statusBadge/statusBadge';
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
import { formatDate, formatPrice, getCurrencyIcon } from '@/lib/utils';
import { mockRecruitmentPrograms } from '@/mock/recruitment-programs';
import type { RecruitmentProgram } from '@/types/recruitment';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const ProfileRecruitment: React.FC = () => {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<RecruitmentProgram>[] = [
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

        const handleStatusChange = (status: string, checked: boolean) => {
          const currentFilter = (column.getFilterValue() as string[]) || [];
          if (checked) {
            column.setFilterValue([...currentFilter, status]);
          } else {
            const newFilter = currentFilter.filter((s) => s !== status);
            column.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
          }
        };

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
                checked={filterValue.includes('open')}
                onCheckedChange={(checked) => handleStatusChange('open', checked)}
              >
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterValue.includes('closed')}
                onCheckedChange={(checked) => handleStatusChange('closed', checked)}
              >
                Closed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterValue.includes('draft')}
                onCheckedChange={(checked) => handleStatusChange('draft', checked)}
              >
                Draft
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterValue.includes('under_review')}
                onCheckedChange={(checked) => handleStatusChange('under_review', checked)}
              >
                Under Review
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterValue.includes('declined')}
                onCheckedChange={(checked) => handleStatusChange('declined', checked)}
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
            Price
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const budgetType = row.original.budgetType;
        const price = row.original.price;
        const currency = row.original.currency;

        if (budgetType === 'negotiable') {
          return <div className="font-bold">Negotiable</div>;
        }

        if (!price || !currency) {
          return <div className="font-bold">-</div>;
        }

        return (
          <div className="flex items-center gap-3 font-bold">
            {formatPrice(price)}{' '}
            <div className="flex items-center gap-2">
              {getCurrencyIcon(currency)}
              {currency}
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;

        if (a.budgetType === 'negotiable' && b.budgetType !== 'negotiable') return 1;
        if (a.budgetType !== 'negotiable' && b.budgetType === 'negotiable') return -1;

        const priceA = Number.parseFloat(a.price || '0');
        const priceB = Number.parseFloat(b.price || '0');

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
    {
      accessorKey: 'applicantCount',
      header: 'Applicants',
      cell: ({ row }) => {
        return <div className="font-bold">{row.getValue('applicantCount')}</div>;
      },
      size: 100,
    },
  ];

  const table = useReactTable({
    data: mockRecruitmentPrograms,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col justify-between bg-white px-10 py-7 rounded-2xl">
      <div>
        <Link
          to={`/my-profile`}
          className="flex items-center mb-3 text-xs font-semibold text-gray-text"
        >
          <ChevronLeft className="w-4" />
          Dashboard
        </Link>
        <div className="mb-6 font-bold text-2xl text-gray-mid-dark">My Job Posts</div>
      </div>
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
                  onClick={() => navigate(`/profile/recruitment/sponser/${row.original.id}`)}
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
    </div>
  );
};

export default ProfileRecruitment;
