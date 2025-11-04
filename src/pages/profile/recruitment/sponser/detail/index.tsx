import { useApplicationsByProgramV2Query } from "@/apollo/queries/applications-by-program-v2.generated";
import RecruitmentApplicants from "@/components/recruitment/applicants/recruitment-applicants";
import RecruitmentMessage from "@/components/recruitment/message/recruitment-message";
import RecruitmentOverview from "@/components/recruitment/overview/recruitment-overview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApplicationsByProgramV2QueryInput } from "@/types/types.generated";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";

const ProfileRecuitmentDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [selectedTab, setSelectedTab] = useState(tabParam || "overview");

  const queryInput: ApplicationsByProgramV2QueryInput = {
    programId: id || "",
  };

  const { data, refetch, loading, error } = useApplicationsByProgramV2Query({
    variables: {
      query: queryInput,
    },
    skip: !id,
  });

  const applications = data?.applicationsByProgramV2?.data || [];

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
          to={`/profile/recruitment/sponser`}
          className="flex items-center mb-3 text-xs font-semibold text-gray-text"
        >
          <ChevronLeft className="w-4" />
          My Job Posts
        </Link>
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="rounded-md p-2">
            <TabsTrigger value="overview" className="rounded-sm px-10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="applicants" className="rounded-sm px-10">
              Applicants
            </TabsTrigger>
            <TabsTrigger value="message" className="rounded-sm px-10">
              Message
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>{selectedTab === "overview" && <RecruitmentOverview />}</div>
      <div>
        {selectedTab === "applicants" && (
          <RecruitmentApplicants
            applications={applications}
            refetch={refetch}
            loading={loading}
            error={error}
          />
        )}
      </div>
      <div>
        {selectedTab === "message" && (
          <RecruitmentMessage applications={applications} />
        )}
      </div>
    </div>
  );
};

export default ProfileRecuitmentDetail;
