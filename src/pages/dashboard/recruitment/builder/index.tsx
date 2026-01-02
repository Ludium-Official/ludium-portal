import {
  useJobActivityCardsQuery,
  useJobActivityProgramsQuery,
} from '@/apollo/queries/job-activity-v2.generated';
import { PageSize } from '@/components/ui/pagination';
import { useAuth } from '@/lib/hooks/use-auth';
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
    <div className="flex flex-col justify-between bg-white px-10 py-7 rounded-2xl">
      <div>
        <div className="flex items-center w-fit mb-10 text-sm text-muted-foreground">
          <Link to="/dashboard">Dashboard</Link>
          <ChevronRight className="w-4 mx-2" />
          <span className="text-foreground">Job Activity</span>
        </div>

        <div className="mb-6 font-bold text-xl text-gray-600">Job Activity</div>

        <div className="flex items-center gap-4 mb-8">
          {filterOptions.map((option) => (
            <div
              key={option.key}
              className={cn(
                'min-w-50 cursor-pointer border rounded-md',
                activityFilter.key === option.key ? 'border-slate-900' : 'border border-slate-200',
              )}
              onClick={() => setActivityFilter(option)}
            >
              <div className="p-4 pb-4">
                <div className="flex items-center gap-2 mb-6">
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

        <div className="mb-8 font-bold text-xl text-gray-600">My Job Posts</div>
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
    </div>
  );
};

export default RecruitmentDashboardBuilder;
