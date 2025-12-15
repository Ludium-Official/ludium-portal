import { useProfileV2Query } from "@/apollo/queries/profile-v2.generated";
import { ProfileSection } from "./_components/profile-section";
import { AboutSection } from "./_components/about-section";
import { ExpertiseSection } from "./_components/expertise-section";
import { WorkExperienceSection } from "./_components/work-experience-section";
import { EducationSection } from "./_components/education-section";

const languages = [
  { name: "English", proficiency: "Native" },
  { name: "Korean", proficiency: "Native" },
  { name: "Spanish", proficiency: "Proficient" },
];

const ProfilePage: React.FC = () => {
  const { data: profileData } = useProfileV2Query({
    fetchPolicy: "network-only",
  });

  const user = profileData?.profileV2;

  return (
    <div className="mx-auto mt-10 space-y-5 max-w-[784px]">
      <div className="text-xl font-bold mb-6">Profile Information</div>

      <ProfileSection
        profileImage={user?.profileImage}
        email={user?.email}
        walletAddress={user?.walletAddress}
        nickname={user?.firstName}
        timezone="(GMT+09:00) Korea Standard Time - Seoul" // TODO: Add timezone field to user type
      />

      <AboutSection bio={user?.bio} />

      <ExpertiseSection
        role={user?.role}
        skills={user?.skills}
        languages={languages}
      />

      <WorkExperienceSection />

      <EducationSection />
    </div>
  );
};

export default ProfilePage;
