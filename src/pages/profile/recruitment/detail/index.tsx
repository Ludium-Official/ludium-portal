import RecruitmentOverview from "@/components/recruitment/overview/recruitment-overview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

// TODO: program sponser만 볼 수 있어야 함
const ProfileRecuitmentDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

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
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
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
            <TabsTrigger value="hired" className="rounded-sm px-10">
              Hired
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>{selectedTab === "overview" && <RecruitmentOverview />}</div>
    </div>
  );
};

export default ProfileRecuitmentDetail;
