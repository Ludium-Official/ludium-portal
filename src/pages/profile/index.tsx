import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import { ProfileSection } from './_components/profile-section';
import { AboutSection } from './_components/about-section';
import { ExpertiseSection } from './_components/expertise-section';
import { WorkExperienceSection } from './_components/work-experience-section';
import { EducationSection } from './_components/education-section';

const languages = [
  { name: 'English', proficiency: 'Native' },
  { name: 'Korean', proficiency: 'Native' },
  { name: 'Spanish', proficiency: 'Fluent' },
];

const workExperiences = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer',
    employmentType: 'Full-time',
    isCurrentlyWorking: false,
    startMonth: 'January',
    startYear: '2020',
    endMonth: 'December',
    endYear: '2023',
  },
  {
    id: '2',
    company: 'Apple',
    role: 'Software Engineer',
    employmentType: 'Full-time',
    isCurrentlyWorking: true,
    startMonth: 'January',
    startYear: '2020',
    endMonth: '',
    endYear: '',
  },
];

const educations = [
  {
    id: '1',
    school: 'University of California, Los Angeles',
    degree: "Bachelor's",
  },
  {
    id: '2',
    school: 'University of California, Los Angeles',
    degree: 'High School Diploma',
    fieldOfStudy: 'Computer Science',
    startYear: '2020',
    endYear: '2024',
  },
];

const ProfilePage: React.FC = () => {
  const { data: profileData } = useProfileV2Query({
    fetchPolicy: 'network-only',
  });

  const user = profileData?.profileV2;

  return (
    <div className="mx-auto my-10 space-y-5 max-w-[784px]">
      <div className="text-xl font-bold mb-6">Profile Information</div>

      <ProfileSection
        profileImage={user?.profileImage}
        email={user?.email}
        walletAddress={user?.walletAddress}
        nickname={user?.firstName}
        timezone="(GMT+09:00) Korea Standard Time - Seoul" // TODO: Add timezone field to user type
      />

      <AboutSection bio={user?.bio} />

      <ExpertiseSection role={user?.role} skills={user?.skills} languages={languages} />

      <WorkExperienceSection experiences={workExperiences} />

      <EducationSection educations={educations} />
    </div>
  );
};

export default ProfilePage;
