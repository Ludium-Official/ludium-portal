import { type MobileCardField, MobileCardList } from '@/components/data-table';
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
import { cn, commaNumber, formatDate, getCurrencyIcon } from '@/lib/utils';
import type { BuilderMilestoneV2 } from '@/types/types.generated';
import { useMemo } from 'react';

const getMilestoneStyle = (status: BuilderMilestoneV2['status']): string => {
  switch (status) {
    case 'draft':
      return 'bg-[#F5F5F5] border-l-[#9CA3AF]';
    case 'under_review':
    case 'update':
      return 'bg-[#F0FFF5] border-l-[#4ADE80]';
    case 'completed':
      return 'bg-[#F0EDFF] border-l-[#9E71C9]';
    case 'urgent':
      return 'bg-[#FFF9FC] border-l-[#EC4899]';
    case 'in_progress':
    default:
      return 'bg-[#F5F8FF] border-l-[#60A5FA]';
  }
};

export const BuilderMilestonesTable: React.FC<{
  milestones: BuilderMilestoneV2[];
  totalCount: number;
}> = ({ milestones, totalCount }) => {
  const isMobile = useIsMobile();
  const { getTokenById } = useNetworks();

  const mobileFields: MobileCardField<BuilderMilestoneV2>[] = useMemo(
    () => [
      {
        key: 'dueDate',
        label: 'Due Date',
        render: (milestone) => (
          <span className="font-medium text-gray-600">{formatDate(milestone.deadline)}</span>
        ),
      },
      {
        key: 'budget',
        label: 'Budget',
        render: (milestone) => {
          const token = getTokenById(Number(milestone.tokenId));
          return (
            <div className="flex items-center gap-2 font-medium">
              <span>
                {commaNumber(
                  Number(milestone.paidAmount || 0) + Number(milestone.unpaidAmount || 0),
                )}
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

  const renderMobileHeader = (milestone: BuilderMilestoneV2) => (
    <div
      className={cn(
        'rounded border-l-4 p-3 flex items-center',
        getMilestoneStyle(milestone.status),
      )}
    >
      <p className="text-sm font-bold text-gray-900 line-clamp-2 break-words">{milestone.title}</p>
    </div>
  );

  return (
    <div className={cn('border border-gray-200 rounded-lg p-4', isMobile && 'p-0')}>
      <h2 className={cn('text-base font-semibold mb-6', isMobile && 'text-sm m-4')}>
        Milestones ({totalCount})
      </h2>

      {milestones.length === 0 && (
        <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-20">
          <p className={cn('text-gray-500', isMobile && 'text-sm')}>No milestones yet</p>
          <p className={cn('text-sm text-gray-500', isMobile && 'text-xs')}>
            Once the sponsor adds milestones, they'll show up here.
          </p>
        </div>
      )}

      {milestones.length > 0 && (
        <>
          {isMobile ? (
            <MobileCardList
              data={milestones}
              keyExtractor={(milestone) => String(milestone.id || '')}
              renderHeader={renderMobileHeader}
              fields={mobileFields}
              isInBoardCard={true}
            />
          ) : (
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-muted-foreground font-medium w-[50%]">
                    Milestone
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium w-[25%]">
                    Due Date
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium w-[25%]">
                    Budget
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map((milestone) => {
                  const token = getTokenById(Number(milestone.tokenId));

                  return (
                    <TableRow
                      key={milestone.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <TableCell className="py-3 whitespace-normal">
                        <div
                          className={cn(
                            'rounded border-l-5 p-3 min-h-[64px] flex items-center',
                            getMilestoneStyle(milestone.status),
                          )}
                        >
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 break-words">
                            {milestone.title}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(milestone.deadline)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {commaNumber(
                              Number(milestone.paidAmount || 0) +
                                Number(milestone.unpaidAmount || 0),
                            )}
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

export default BuilderMilestonesTable;
