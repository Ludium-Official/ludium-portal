import {
  useJobActivityCardsQuery,
  useJobActivityProgramsQuery,
} from '@/apollo/queries/job-activity-v2.generated';
import MobileBackHeader from '@/components/common/mobile-back-header';
import Container from '@/components/layout/container';
import { PageSize } from '@/components/ui/pagination';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn, commaNumber } from '@/lib/utils';
import type { HiringActivityFilterOption } from '@/types/dashboard';
import type {
  BuilderJobActivityCards,
  JobActivityProgramStatusFilter,
} from '@/types/types.generated';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { MyJobPostsTable } from '../_components/my-job-posts-table';

const RecruitmentDashboardBuilder: React.FC = () => {
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [activityFilter, setActivityFilter] = useState<HiringActivityFilterOption>({
    key: 'applied',
    label: 'Applied Program',
    dotColor: 'bg-slate-900',
  });

  const filterOptions: {
    key: HiringActivityFilterOption['key'];
    label: string;
    dotColor: string;
  }[] = [
    { key: 'applied', label: 'Applied Program', dotColor: 'bg-slate-900' },
    { key: 'ongoing', label: 'Ongoing Program', dotColor: 'bg-blue-500' },
    { key: 'completed', label: 'Completed Program', dotColor: 'bg-primary' },
  ];

  const { data: cardsData } = useJobActivityCardsQuery({
    skip: !userId,
  });

  const {
    data: programsData,
    loading,
    error,
    refetch,
  } = useJobActivityProgramsQuery({
    variables: {
      input: {
        status: activityFilter.key.toUpperCase() as JobActivityProgramStatusFilter,
        pagination: {
          limit: PageSize * 2,
          offset: (currentPage - 1) * PageSize * 2,
        },
      },
    },
    skip: !userId,
  });

  const cards = cardsData?.jobActivityCards;
  const programs = programsData?.jobActivityPrograms?.data || [];
  const totalCount = programsData?.jobActivityPrograms?.count || 0;

  return (
    <>
      <MobileBackHeader title="Job Activity" backLink="/dashboard" />
      <Container className="flex flex-col justify-between bg-white max-w-full px-10 py-7 rounded-2xl">
        <div>
          {!isMobile && (
            <div className="flex items-center w-fit mb-10 text-sm text-muted-foreground">
              <Link to="/dashboard">Dashboard</Link>
              <ChevronRight className="w-4 mx-2" />
              <span className="text-foreground">Job Activity</span>
            </div>
          )}

          <div className={cn('mb-6 font-bold text-xl text-gray-600', isMobile && 'text-lg mb-4')}>
            Job Activity
          </div>

          <div className={cn('flex items-center gap-4 mb-8', isMobile && 'grid grid-cols-2 gap-4')}>
            {filterOptions.map((option) => (
              <div
                key={option.key}
                className={cn(
                  'min-w-50 cursor-pointer border rounded-md',
                  activityFilter.key === option.key
                    ? 'border-slate-900'
                    : 'border border-slate-200',
                  isMobile && 'min-w-auto',
                )}
                onClick={() => setActivityFilter(option)}
              >
                <div className="p-4">
                  <div className={cn('flex items-center gap-2 mb-6', isMobile && 'mb-2')}>
                    <span className={cn('w-3 h-3 rounded-full', option.dotColor)} />
                    <span className="text-sm text-slate-600">{option.label}</span>
                  </div>
                  <p className="flex justify-end text-xl font-bold">
                    {commaNumber(cards?.[option.key as keyof BuilderJobActivityCards] ?? 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={cn('mb-8 font-bold text-xl text-gray-600', isMobile && 'text-lg mb-4')}>
            My Job Posts
          </div>
        </div>

        <MyJobPostsTable
          activityFilter={activityFilter}
          programs={programs}
          totalCount={totalCount}
          loading={loading}
          error={error}
          onRefetch={refetch}
          variant="builder"
        />
      </Container>
    </>
  );
};

export default RecruitmentDashboardBuilder;
