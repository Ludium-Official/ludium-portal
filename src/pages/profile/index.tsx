import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import { AboutSection } from './_components/about-section';
import { EducationSection } from './_components/education-section';
import { ExpertiseSection } from './_components/expertise-section';
import { ProfileSection } from './_components/profile-section';
import { WorkExperienceSection } from './_components/work-experience-section';

const ProfilePage: React.FC = () => {
  const { data: profileData } = useProfileV2Query({
    fetchPolicy: 'network-only',
  });

  const user = profileData?.profileV2;

  return (
    <div className="mx-auto my-10 space-y-5 max-w-[820px]">
      <div className="text-xl font-bold mb-6">Profile Information</div>

      <ProfileSection
        profileImage={user?.profileImage}
        email={user?.email}
        walletAddress={user?.walletAddress}
        nickname={user?.nickname}
        timezone={user?.location}
      />

      <AboutSection bio={user?.about} />

      <ExpertiseSection
        role={user?.userRole}
        skills={user?.skills}
        languages={user?.languages || []}
      />

      <WorkExperienceSection experiences={user?.workExperiences || []} />

      <EducationSection educations={user?.educations || []} />
    </div>
  );
};

export default ProfilePage;
