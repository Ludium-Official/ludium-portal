import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginationLinkProps, PaginationProps } from '@/types/pagination';
import { useSearchParams } from 'react-router';

export const PageSize = 5;
const maxVisible = 4;

const PaginationRoot = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
PaginationRoot.displayName = 'PaginationRoot';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />,
);
PaginationItem.displayName = 'PaginationItem';

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <button
    type="button"
    aria-current={isActive ? 'page' : undefined}
    aria-label={isActive ? `Current page, page ${props.children}` : `Go to page ${props.children}`}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      'cursor-pointer',
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

const Pagination = ({ totalCount, pageSize }: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = totalCount ? Math.floor((totalCount - 1) / (pageSize ?? PageSize) + 1) : 0;

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    const newSP = new URLSearchParams(searchParams);
    newSP.set('page', page.toString());
    setSearchParams(newSP);
  };

  const visiblePages = (() => {
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn('max-h-9', currentPage === 1 && 'pointer-events-none opacity-50')}
            onClick={() => goToPage(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>

        {visiblePages[0] > 1 && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === 1}
              className="aria-[current]:bg-[var(--primary-light)] border-none aria-[current]:text-primary"
              onClick={() => goToPage(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {showStartEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {visiblePages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              isActive={currentPage === pageNum}
              className="aria-[current]:bg-[var(--primary-light)] border-none aria-[current]:text-primary"
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === totalPages}
              className="aria-[current]:bg-[var(--primary-light)] border-none aria-[current]:text-primary"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={cn(
              'max-h-9',
              currentPage === totalPages && 'pointer-events-none opacity-50',
            )}
            onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};
Pagination.displayName = 'Pagination';

export {
  Pagination,
  PaginationRoot,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
