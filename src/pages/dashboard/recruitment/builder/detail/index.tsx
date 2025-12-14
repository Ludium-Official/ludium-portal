import RecruitmentMessage from '@/components/recruitment/message/recruitment-message';
import RecruitmentOverview from '@/components/recruitment/overview/recruitment-overview';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

const RecruitmentDashboardBuilderDetail: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [selectedTab, setSelectedTab] = useState(tabParam || 'overview');

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
    <div className="flex flex-col justify-between bg-white px-10 py-7 rounded-2xl">
      <div className="mb-3">
        <Link
          to={`/dashboard/recruitment/builder`}
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
            <TabsTrigger value="message" className="rounded-sm px-10">
              Message
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>{selectedTab === 'overview' && <RecruitmentOverview />}</div>
      <div>{selectedTab === 'message' && <RecruitmentMessage />}</div>
    </div>
  );
};

export default RecruitmentDashboardBuilderDetail;
