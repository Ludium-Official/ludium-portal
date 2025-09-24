import type { AdminUsersQuery } from '@/apollo/queries/admin-users.generated';
import { Checkbox } from '@/components/ui/checkbox';
import { getUserName } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

type User = NonNullable<NonNullable<AdminUsersQuery['adminUsers']>['data']>[0];

export const hiddenUsersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original;
      return <div className="max-w-[200px] truncate font-medium">{getUserName(user)}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return <div className="text-sm">{email || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'organizationName',
    header: 'Organization',
    cell: ({ row }) => {
      const organization = row.getValue('organizationName') as string;
      return <div className="text-sm">{organization || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'banned',
    header: 'Status',
    cell: ({ row }) => {
      const banned = row.getValue('banned') as boolean;
      return (
        <div className="text-sm">
          {banned ? (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              Banned
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              Active
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'bannedAt',
    header: 'Banned Date',
    cell: ({ row }) => {
      const bannedAt = row.getValue('bannedAt') as string;
      return (
        <div className="text-sm">{bannedAt ? format(new Date(bannedAt), 'yyyy-MM-dd') : 'N/A'}</div>
      );
    },
  },
];
