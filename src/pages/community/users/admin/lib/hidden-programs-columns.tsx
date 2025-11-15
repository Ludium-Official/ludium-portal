import type { ProgramsQuery } from '@/apollo/queries/programs.generated';
import { ProgramStatusBadge } from '@/components/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';

type Program = NonNullable<NonNullable<ProgramsQuery['programs']>['data']>[0];

export const hiddenProgramsColumns: ColumnDef<Program>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Program',
    cell: ({ row }) => {
      const name = row.original.name;
      return <div className="font-medium">{name || 'Untitled Program'}</div>;
    },
  },
  {
    accessorKey: 'creator',
    header: 'Sponsor',
    cell: ({ row }) => {
      const creator = row.original.creator;
      if (!creator) return <div className="text-muted-foreground">No creator</div>;

      const displayName =
        creator.organizationName ||
        `${creator.firstName || ''} ${creator.lastName || ''}`.trim() ||
        creator.email ||
        'Unknown';

      return <div>{displayName}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const program = row.original;
      return <ProgramStatusBadge program={program} className="w-fit" />;
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.original.price;
      const currency = row.original.currency;

      if (!price) return <div className="text-muted-foreground">No price set</div>;

      return (
        <div className="font-medium">
          {price} {currency || 'USD'}
        </div>
      );
    },
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ row }) => {
      const deadline = row.original.deadline;

      if (!deadline) return <div className="text-muted-foreground">No deadline</div>;

      const deadlineDate = new Date(deadline);
      const now = new Date();
      const isOverdue = deadlineDate < now;

      return (
        <div className={cn('font-medium', isOverdue && 'text-red-600')}>
          {deadlineDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          {isOverdue && <div className="text-xs text-red-500 mt-1">Overdue</div>}
        </div>
      );
    },
  },
];
