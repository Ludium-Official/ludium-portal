import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import RecruitmentApplicants from '@/components/recruitment/applicants/recruitment-applicants';
import RecruitmentMessage from '@/components/recruitment/message/recruitment-message';
import RecruitmentOverview from '@/components/recruitment/overview/recruitment-overview';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

const ProfileRecuitmentDetail: React.FC = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [selectedTab, setSelectedTab] = useState(tabParam || 'overview');

  const { data: programData, loading } = useGetProgramV2Query({
    variables: { id: id || '' },
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
        <Link
          to={`/profile/recruitment/sponsor`}
          className="flex items-center w-fit mb-5 text-sm font-semibold text-gray-text"
        >
          <ChevronLeft className="w-4" />
          My Job Posts
        </Link>
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
      <div>{selectedTab === 'overview' && <RecruitmentOverview />}</div>
      <div>{selectedTab === 'applicants' && <RecruitmentApplicants />}</div>
      <div>{selectedTab === 'message' && <RecruitmentMessage />}</div>
    </div>
  );
};

export default ProfileRecuitmentDetail;
