import { useApplicationsByProgramV2Query } from "@/apollo/queries/applications-by-program-v2.generated";
import RecruitmentApplicants from "@/components/recruitment/applicants/recruitment-applicants";
import RecruitmentMessage from "@/components/recruitment/message/recruitment-message";
import RecruitmentOverview from "@/components/recruitment/overview/recruitment-overview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ApplicationsByProgramV2QueryInput,
  ApplicationStatusV2,
  ApplicationV2,
} from "@/types/types.generated";
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

  // TODO: builder용으로 만들어야 함
  //   const { data } = useApplicationsByProgramV2Query({
  //     variables: {
  //       query: queryInput,
  //     },
  //     skip: !id,
  //   });

  const applications: ApplicationV2[] = [
    {
      applicant: {
        bio: "about\n\nJuniahn in **Ludium**\n\nsummary\n\nJuniahn in Ludium",
        email: "juniahn@ludium.world",
        firstName: "Juniahn",
        id: "151",
        lastName: "Lee",
        organizationName: "Ludium",
        profileImage: "",
        skills: ["React", "NextJS"],
      },
      content:
        "name\n\nApplication for backend side\n\nsummary\n\nRefactoring plans\n\ncontent\n\n* Resouce: [https://github.com/Ludium-Official/ludium-portal-backend](https://github.com/Ludium-Official/ludium-portal-backend)\n\n1. Code Review(코드리뷰)\n2. Feature description clean up(기능 구현 정리)\n3. Make milestones (short planning, 플래닝)\n4. Refactoring(리팩토링)\n5. Make a standard  and doc for open source contribution (오픈소스 컨트리뷰션 스탠다드 정리)",
      createdAt: "2025-10-31T07:28:52.723Z",
      id: "54",
      picked: true,
      program: {
        description: "# 1030 Test Program\n\n## 1030 Test Program",
        id: "45",
        title: "1030 Test Program Edit 2",
      },
      rejectedReason: "",
      status: ApplicationStatusV2.Applied,
      updatedAt: "2025-10-31T08:54:32.642Z",
    },
  ];

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
