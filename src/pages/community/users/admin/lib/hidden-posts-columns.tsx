import type { PostsQuery } from '@/apollo/queries/posts.generated';
import { Checkbox } from '@/components/ui/checkbox';
import { getUserName } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

type Post = NonNullable<NonNullable<PostsQuery['posts']>['data']>[0];

export const hiddenPostsColumns: ColumnDef<Post>[] = [
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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      return <div className="max-w-[200px] truncate font-medium">{title || 'Untitled'}</div>;
    },
  },
  {
    accessorKey: 'author',
    header: 'Writer',
    cell: ({ row }) => {
      const author = row.getValue('author') as Post['author'];
      return (
        <div className="flex items-center gap-2">
          <div className="text-sm">{author ? getUserName(author) : 'Unknown'}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'viewCount',
    header: 'Views',
    cell: ({ row }) => {
      const viewCount = row.getValue('viewCount') as number;
      return <div className="text-sm">{viewCount || 0}</div>;
    },
  },
  {
    accessorKey: 'comments',
    header: 'Comments',
    cell: ({ row }) => {
      const comments = row.original.comments;
      const commentCount = comments?.length || 0;
      return <div className="text-sm">{commentCount}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Deadline',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return (
        <div className="text-sm">
          {createdAt ? format(new Date(createdAt), 'yyyy-MM-dd') : 'N/A'}
        </div>
      );
    },
  },
];
