// type PaginationLinkProps = {
//     isActive?: boolean;
//   } & Pick<ButtonProps, 'size'> &
//     React.ComponentProps<'button'>

import { type ButtonProps } from '@/components/ui/button';

export interface PaginationLinkProps
  extends Pick<ButtonProps, 'size'>,
    React.ComponentProps<'button'> {
  isActive?: boolean;
}

export interface PaginationProps {
  totalCount: number;
  pageSize?: number;
}
