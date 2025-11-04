import { useApplicationsByProgramV2Query } from "@/apollo/queries/applications-by-program-v2.generated";
import RecruitmentMessage from "@/components/recruitment/message/recruitment-message";
import RecruitmentOverview from "@/components/recruitment/overview/recruitment-overview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ApplicationsByProgramV2QueryInput } from "@/types/types.generated";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";

const ProfileRecruitmentBuilderDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [selectedTab, setSelectedTab] = useState(tabParam || "overview");

  const queryInput: ApplicationsByProgramV2QueryInput = {
    programId: id || "",
  };

  const { data } = useApplicationsByProgramV2Query({
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
            <TabsTrigger value="message" className="rounded-sm px-10">
              Message
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>{selectedTab === "overview" && <RecruitmentOverview />}</div>
      <div>
        {selectedTab === "message" && (
          <RecruitmentMessage applications={applications} />
        )}
      </div>
    </div>
  );
};

export default ProfileRecruitmentBuilderDetail;
