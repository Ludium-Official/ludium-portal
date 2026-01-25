import {
  useBuilderMilestonesQuery,
  useMilestoneProgressQuery,
  useUpcomingPaymentsQuery,
} from '@/apollo/queries/program-overview-v2.generated';
import MobileBackHeader from '@/components/common/mobile-back-header';
import Container from '@/components/layout/container';
import RecruitmentMessage from '@/components/recruitment/message/recruitment-message';
import RecruitmentOverview from '@/components/recruitment/overview/recruitment-overview';
import { PageSize } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import BuilderMilestonesTable from '@/pages/dashboard/recruitment/_components/builder-milestones-table';
import MilestoneProgress from '@/pages/dashboard/recruitment/_components/milestone-progress';
import UpcomingPayments from '@/pages/dashboard/recruitment/_components/upcoming-payments';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

const RecruitmentDashboardBuilderDetail: React.FC = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const currentPage = Number(searchParams.get('page')) || 1;

  const [selectedTab, setSelectedTab] = useState(tabParam || 'overview');

  const { data: builderMilestonesData } = useBuilderMilestonesQuery({
    variables: {
      input: {
        programId: id || '',
        pagination: {
          limit: PageSize,
          offset: (currentPage - 1) * PageSize,
        },
      },
    },
    skip: !id,
  });

  const { data: milestoneProgressData } = useMilestoneProgressQuery({
    variables: {
      input: {
        programId: id || '',
      },
    },
    skip: !id,
  });

  const { data: upcomingPaymentsData } = useUpcomingPaymentsQuery({
    variables: {
      input: {
        programId: id || '',
      },
    },
    skip: !id,
  });

  useEffect(() => {
    if (tabParam) {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <>
      <MobileBackHeader title="Program Overview" backLink="/dashboard/recruitment/builder" />
      <Container className="flex flex-col justify-between bg-white max-w-full px-10 py-7 rounded-2xl">
        <div className="mb-3">
          {!isMobile && (
            <div className="flex items-center w-fit mb-6 text-sm text-muted-foreground">
              <Link to="/dashboard">Dashboard</Link>
              <ChevronRight className="w-4 mx-2" />
              <Link to="/dashboard/recruitment/builder">Job Activity</Link>
              <ChevronRight className="w-4 mx-2" />
              <span className="text-foreground">Program Overview</span>
            </div>
          )}
          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <TabsList className={cn('rounded-md', isMobile && 'w-full')}>
              <TabsTrigger
                value="overview"
                className={cn('rounded-sm px-10', isMobile && 'px-4 flex-1')}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="message"
                className={cn('rounded-sm px-10', isMobile && 'px-4 flex-1')}
              >
                Message
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div>
          {selectedTab === 'overview' && (
            <>
              <div className="border border-gray-200 rounded-lg">
                <RecruitmentOverview
                  className={cn('px-4 py-5', isMobile && 'py-3')}
                  isFoldable={true}
                />
              </div>
              <div
                className={cn(
                  'grid gap-4 mt-7 items-start',
                  isMobile ? 'grid-cols-1 mt-4' : 'grid-cols-[2.2fr_1fr]',
                )}
              >
                <BuilderMilestonesTable
                  milestones={builderMilestonesData?.builderMilestones?.data || []}
                  totalCount={builderMilestonesData?.builderMilestones?.count || 0}
                />
                <div className="space-y-6">
                  <MilestoneProgress milestoneProgress={milestoneProgressData?.milestoneProgress} />
                  <UpcomingPayments
                    upcomingPayments={upcomingPaymentsData?.upcomingPayments || []}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div>{selectedTab === 'message' && <RecruitmentMessage />}</div>
      </Container>
    </>
  );
};

export default RecruitmentDashboardBuilderDetail;
