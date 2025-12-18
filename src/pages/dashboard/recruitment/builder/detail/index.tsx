import RecruitmentMessage from "@/components/recruitment/message/recruitment-message";
import RecruitmentOverview from "@/components/recruitment/overview/recruitment-overview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import BuilderMilestonesTable from "@/pages/dashboard/recruitment/_components/builder-milestones-table";
import MilestoneProgress from "@/pages/dashboard/recruitment/_components/milestone-progress";
import UpcomingPayments from "@/pages/dashboard/recruitment/_components/upcoming-payments";
import { useProgramOverviewV2Query } from "@/apollo/queries/program-overview-v2.generated";
import { PageSize } from "@/components/ui/pagination";

const RecruitmentDashboardBuilderDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const currentPage = Number(searchParams.get("page")) || 1;

  const [selectedTab, setSelectedTab] = useState(tabParam || "overview");

  const { data: programOverviewData } = useProgramOverviewV2Query({
    variables: {
      input: {
        programId: id || "",
        pagination: {
          limit: PageSize,
          offset: (currentPage - 1) * PageSize,
        },
      },
    },
    skip: !id,
  });

  const programOverview = programOverviewData?.programOverviewV2;

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
        <div className="flex items-center w-fit mb-6 text-sm text-muted-foreground">
          <Link to="/dashboard">Dashboard</Link>
          <ChevronRight className="w-4 mx-2" />
          <Link to="/dashboard/recruitment/builder">Job Activity</Link>
          <ChevronRight className="w-4 mx-2" />
          <span className="text-foreground">Program Overview</span>
        </div>
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
      <div>
        {selectedTab === "overview" && (
          <>
            <div className="border border-gray-200 rounded-lg">
              <RecruitmentOverview className="px-4 py-5" isFoldable={true} />
            </div>
            <div
              className="grid gap-4 mt-7 items-start"
              style={{ gridTemplateColumns: "2.2fr 1fr" }}
            >
              <BuilderMilestonesTable
                milestones={programOverview?.milestones?.data || []}
                totalCount={programOverview?.milestones?.count || 0}
              />
              <div className="space-y-6">
                <MilestoneProgress
                  milestoneProgress={programOverview?.milestoneProgress}
                />
                <UpcomingPayments
                  upcomingPayments={programOverview?.upcomingPayments || []}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div>{selectedTab === "message" && <RecruitmentMessage />}</div>
    </div>
  );
};

export default RecruitmentDashboardBuilderDetail;
