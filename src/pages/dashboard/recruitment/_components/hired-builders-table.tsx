import { MobileCardList, type MobileCardField } from '@/components/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageSize, Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNetworks } from '@/contexts/networks-context';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn, commaNumber, getCurrencyIcon, getInitials } from '@/lib/utils';
import type { HiredBuilderV2 } from '@/types/types.generated';
import { useMemo } from 'react';

export const HiredBuildersTable: React.FC<{
  hiredBuilders: HiredBuilderV2[];
  totalCount: number;
}> = ({ hiredBuilders, totalCount }) => {
  const isMobile = useIsMobile();
  const { getTokenById } = useNetworks();

  const mobileFields: MobileCardField<HiredBuilderV2>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        render: (builder) => (
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                builder.status === 'in_progress' ? 'bg-blue-500' : 'bg-purple-500',
              )}
            />
            <span className="font-medium">
              {builder.status === 'in_progress' ? 'In Progress' : 'Completed'}
            </span>
          </div>
        ),
      },
      {
        key: 'milestones',
        label: 'Milestones',
        render: (builder) => <span className="font-medium">{builder.milestoneCount}</span>,
      },
      {
        key: 'paid',
        label: 'Paid',
        render: (builder) => {
          const token = getTokenById(Number(builder.tokenId));
          return (
            <div className="flex items-center gap-2 font-medium">
              <span>
                {commaNumber(builder.paidAmount || 0)} / {commaNumber(builder.totalAmount || 0)}
              </span>
              <span className="flex items-center gap-1 text-gray-500 [&_svg]:w-3 [&_svg]:h-3">
                {getCurrencyIcon(token?.tokenName)}
                {token?.tokenName}
              </span>
            </div>
          );
        },
      },
    ],
    [getTokenById],
  );

  const renderMobileHeader = (builder: HiredBuilderV2) => (
    <div className="flex items-center gap-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={builder.profileImage || undefined} />
        <AvatarFallback className="text-xs bg-gray-100">
          {getInitials(builder.nickname || '')}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-bold text-sm text-slate-800">{builder.nickname}</div>
        <div className="text-xs text-gray-500">{builder.role}</div>
      </div>
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className={cn('text-base font-semibold mb-6', isMobile && 'text-sm mb-4')}>
        Hired Builders ({totalCount})
      </h2>

      {hiredBuilders.length === 0 && (
        <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-20">
          <p className={cn('text-gray-500', isMobile && 'text-sm')}>No builder hired yet</p>
          <p className={cn('text-sm text-gray-500', isMobile && 'text-xs')}>
            Once you hire builders, they'll show up here.
          </p>
        </div>
      )}

      {hiredBuilders.length > 0 && (
        <>
          {isMobile ? (
            <MobileCardList
              data={hiredBuilders}
              keyExtractor={(builder) => String(builder.id || '')}
              renderHeader={renderMobileHeader}
              fields={mobileFields}
              isInBoardCard={true}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Milestones</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hiredBuilders.map((builder) => {
                  const token = getTokenById(Number(builder.tokenId));

                  return (
                    <TableRow key={builder.id} className="border-b border-gray-100 last:border-b-0">
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={builder.profileImage || undefined} />
                            <AvatarFallback className="text-xs bg-gray-100">
                              {getInitials(builder.nickname || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{builder.nickname}</div>
                            <div className="text-sm text-gray-500">{builder.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-fit bg-gray-100 rounded-full px-3 py-1">
                          <span
                            className={cn(
                              'w-3 h-3 rounded-full',
                              builder.status === 'in_progress' ? 'bg-blue-500' : 'bg-purple-500',
                            )}
                          />
                          <span className="text-sm font-medium">
                            {builder.status === 'in_progress' ? 'In Progress' : 'Completed'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{builder.milestoneCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {commaNumber(builder.paidAmount || 0)} /{' '}
                            {commaNumber(builder.totalAmount || 0)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold [&_svg]:w-4 [&_svg]:h-4">
                            {getCurrencyIcon(token?.tokenName)}
                            {token?.tokenName}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          <Pagination totalCount={totalCount} pageSize={PageSize} />
        </>
      )}
    </div>
  );
};
