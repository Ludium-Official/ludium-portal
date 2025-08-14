import client from '@/apollo/client';
import { useDeleteCarouselItemMutation } from '@/apollo/mutation/delete-carousel-item.generated';
import { CarouselItemsDocument } from '@/apollo/queries/carousel-items.generated';
import { Button } from '@/components/ui/button';
import type { CarouselItemData, CarouselItemType } from '@/types/types.generated';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

export type CarouselItem = {
  id: string;
  itemId: string;
  itemType: CarouselItemType;
  data: CarouselItemData;
};

export const carouselItemsColumns: ColumnDef<CarouselItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'itemId',
    header: 'Item ID',
  },
  {
    accessorKey: 'itemType',
    header: 'Item Type',
  },
  {
    accessorKey: 'data',
    header: 'Title',
    cell: ({ row }) => {
      const data = row.original.data;

      if (data.__typename === 'Post') {
        return <div>{data.title}</div>;
      }
      if (data.__typename === 'Program') {
        return <div>{data.name}</div>;
      }

      return data.id;
    },
  },

  {
    accessorKey: '',
    header: 'Link',
    cell: ({ row }) => {
      const data = row.original.data;

      if (data.__typename === 'Post') {
        return (
          <Link
            target="_blank"
            to={`/community/posts/${row.original.itemId}`}
            className="underline"
          >
            Click
          </Link>
        );
      }
      if (data.__typename === 'Program') {
        return (
          <Link target="_blank" to={`/programs/${row.original.itemId}`} className="underline">
            Click
          </Link>
        );
      }
    },
  },

  {
    accessorKey: '',
    header: 'delete',
    cell: ({ row }) => {
      return <DeleteItemButton id={row.original.id} />;
    },
  },
];

const DeleteItemButton = ({ id }: { id: string }) => {
  const [deleteCarouselItem] = useDeleteCarouselItemMutation();

  return (
    <Button
      variant="destructive"
      onClick={() =>
        deleteCarouselItem({ variables: { id: id } }).then(() =>
          client.refetchQueries({ include: [CarouselItemsDocument] }),
        )
      }
    >
      Delete
    </Button>
  );
};
