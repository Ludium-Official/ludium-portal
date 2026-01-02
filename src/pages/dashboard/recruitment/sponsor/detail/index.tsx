import {
  useHiredBuildersQuery,
  useMilestoneProgressQuery,
  useUpcomingPaymentsQuery,
} from '@/apollo/queries/program-overview-v2.generated';
import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import RecruitmentApplicants from '@/components/recruitment/applicants/recruitment-applicants';
import RecruitmentMessage from '@/components/recruitment/message/recruitment-message';
import RecruitmentOverview from '@/components/recruitment/overview/recruitment-overview';
import { PageSize } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { HiredBuildersTable } from '@/pages/dashboard/recruitment/_components/hired-builders-table';
import MilestoneProgress from '@/pages/dashboard/recruitment/_components/milestone-progress';
import UpcomingPayments from '@/pages/dashboard/recruitment/_components/upcoming-payments';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

const RecruitmentDashboardSponsorDetail: React.FC = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const currentPage = Number(searchParams.get('page')) || 1;

  const [selectedTab, setSelectedTab] = useState(tabParam || 'overview');

  const { data: programData, loading } = useGetProgramV2Query({
    variables: { id: id || '' },
    skip: !id,
  });

  const { data: hiredBuildersData } = useHiredBuildersQuery({
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

  const program = programData?.programV2;
  const isSponsor = program?.sponsor?.id === userId;

  useEffect(() => {
    if (tabParam) {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setSearchParams({ tab: value });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!loading && !isSponsor) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <p className="text-xl font-semibold text-gray-dark">Access Denied</p>
        <p className="text-gray-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between bg-white px-10 py-7 rounded-2xl">
      <div className="mb-3">
        <div className="flex items-center w-fit mb-6 text-sm text-muted-foreground">
          <Link to="/dashboard">Dashboard</Link>
          <ChevronRight className="w-4 mx-2" />
          <Link to="/dashboard/recruitment/sponsor">Hiring Activity</Link>
          <ChevronRight className="w-4 mx-2" />
          <span className="text-foreground">Program Overview</span>
        </div>
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="rounded-md">
            <TabsTrigger value="overview" className="rounded-sm px-10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="applicants" className="rounded-sm px-10">
              Applicants
              <span className="text-primary font-bold">{program?.applicationCount}</span>
            </TabsTrigger>
            <TabsTrigger value="message" className="rounded-sm px-10">
              Message
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        {selectedTab === 'overview' && (
          <>
            <div className="border border-gray-200 rounded-lg">
              <RecruitmentOverview className="px-4 py-5" isFoldable={true} />
            </div>
            <div
              className="grid gap-4 mt-7 items-start"
              style={{ gridTemplateColumns: '2.2fr 1fr' }}
            >
              <HiredBuildersTable
                hiredBuilders={hiredBuildersData?.hiredBuilders?.data || []}
                totalCount={hiredBuildersData?.hiredBuilders?.count || 0}
              />
              <div className="space-y-6">
                <MilestoneProgress milestoneProgress={milestoneProgressData?.milestoneProgress} />
                <UpcomingPayments upcomingPayments={upcomingPaymentsData?.upcomingPayments || []} />
              </div>
            </div>
          </>
        )}
      </div>
      <div>{selectedTab === 'applicants' && <RecruitmentApplicants />}</div>
      <div>{selectedTab === 'message' && <RecruitmentMessage />}</div>
    </div>
  );
};

export default RecruitmentDashboardSponsorDetail;
