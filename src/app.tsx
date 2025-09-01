import AdminOutlet from '@/components/layout/admin-outlet';
import Layout from '@/components/layout/layout';
import { CustomDynamicTabsExample } from '@/components/ui/dynamic-tab-example';
// import { DynamicTabsExample } from '@/components/ui/dynamic-tab-example';
import AdminPage from '@/pages/admin';
import CommunityPage from '@/pages/community';
import CreateCommunityPage from '@/pages/community/create';
import CommunityDetailsPage from '@/pages/community/details';
import EditCommunityPage from '@/pages/community/edit';
import UsersPage from '@/pages/community/users';
import UserCommunityTab from '@/pages/community/users/_components/community-tab';
import UserDescriptionTab from '@/pages/community/users/_components/description-tab';
import UserInvestmentHostTab from '@/pages/community/users/_components/investment-host-tab';
import UserInvestmentProjectTab from '@/pages/community/users/_components/investment-project-tab';
import UserInvestmentReclaimTab from '@/pages/community/users/_components/investment-reclaim-tab';
import UserInvestmentTab from '@/pages/community/users/_components/investment-tab';
import UserOverviewTab from '@/pages/community/users/_components/overview-tab';
import UserRecruitmentReclaimTab from '@/pages/community/users/_components/recruitment-reclaim-tab';
import UserRecruitmentRoleTab from '@/pages/community/users/_components/recruitment-role-tab';
import UserRecruitmentTab from '@/pages/community/users/_components/recruitment-tab';
import UserDetailsPage from '@/pages/community/users/details';
import EditProfilePage from '@/pages/community/users/details/edit-profile';
import MyProfilePage from '@/pages/community/users/details/my-profile';
import InvestmentsPage from '@/pages/investments';
import CreateInvestmentPage from '@/pages/investments/create';
import CreateProjectPage from '@/pages/investments/create-project';
import InvestmentDetailsPage from '@/pages/investments/details';
import ProjectDetailsPage from '@/pages/investments/details/project-details';
import EditInvestmentPage from '@/pages/investments/edit';
import MainPage from '@/pages/main';
// import ProfilePage from '@/pages/profile';
// import EditProfilePage from '@/pages/profile/edit';
import ProgramsPage from '@/pages/programs';
import CreateProgramPage from '@/pages/programs/create';
import ProgramDetailsPage from '@/pages/programs/details';
import ApplicationDetailsPage from '@/pages/programs/details/application-details';
import EditProgramPage from '@/pages/programs/edit';
import ScrollWrapper from '@/providers/scroll-wrapper';
import { Navigate, Route, Routes } from 'react-router';

function App() {
  return (
    <ScrollWrapper>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="test" element={<CustomDynamicTabsExample />} />
          <Route index element={<MainPage />} />
          {/* <Route path="profile">
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditProfilePage />} />
          </Route> */}

          <Route path="programs">
            <Route index element={<ProgramsPage />} />
            <Route path="create" element={<CreateProgramPage />} />
            <Route path=":id" element={<ProgramDetailsPage />} />
            <Route path=":id/edit" element={<EditProgramPage />} />
            <Route path=":id/application/:applicationId" element={<ApplicationDetailsPage />} />
          </Route>

          <Route path="investments">
            <Route index element={<InvestmentsPage />} />
            <Route path="create" element={<CreateInvestmentPage />} />
            <Route path=":id" element={<InvestmentDetailsPage />} />
            <Route path=":id/edit" element={<EditInvestmentPage />} />
            <Route path=":id/create-project" element={<CreateProjectPage />} />
            <Route path=":id/project/:projectId" element={<ProjectDetailsPage />} />
          </Route>

          <Route path="community">
            <Route index element={<CommunityPage />} />
            <Route path="create" element={<CreateCommunityPage />} />
            <Route path="posts/:id" element={<CommunityDetailsPage />} />
            <Route path="posts/:id/edit" element={<EditCommunityPage />} />
            {/* <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailsPage />} /> */}
          </Route>

          <Route path="users">
            <Route index element={<UsersPage />} />

            <Route path=":id" element={<UserDetailsPage />}>
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<UserOverviewTab />} />
              <Route path="description" element={<UserDescriptionTab />} />
              <Route path="program/recruitment" element={<UserRecruitmentTab />} />
              <Route path="program/recruitment/:role" element={<UserRecruitmentRoleTab />} />
              <Route path="program/investment" element={<UserInvestmentTab />} />
              <Route path="program/investment/host" element={<UserInvestmentHostTab />} />
              <Route path="program/investment/project" element={<UserInvestmentProjectTab />} />
              <Route path="program/investment/supporter" element={<UserInvestmentProjectTab />} />
              <Route path="program/investment/supporter" element={<UserInvestmentProjectTab />} />
              <Route path="community" element={<UserCommunityTab />} />
            </Route>
          </Route>
          <Route path="my-profile">
            {/* <Route index element={<MyProfilePage />} /> */}

            <Route path="edit" element={<EditProfilePage />} />
            <Route element={<MyProfilePage />}>
              <Route index element={<Navigate to="overview" />} />
            </Route>
            <Route element={<MyProfilePage />}>
              {/* <Route index element={<Navigate to="overview" />} /> */}

              <Route path="overview" element={<UserOverviewTab />} />
              <Route path="description" element={<UserDescriptionTab myProfile />} />
              <Route path="program/recruitment" element={<UserRecruitmentTab myProfile />} />
              <Route path="program/recruitment/:role" element={<UserRecruitmentRoleTab myProfile />} />
              <Route path="program/recruitment/reclaim" element={<UserRecruitmentReclaimTab myProfile />} />
              <Route path="program/investment" element={<UserInvestmentTab myProfile />} />
              <Route path="program/investment/host" element={<UserInvestmentHostTab />} />
              <Route path="program/investment/project" element={<UserInvestmentProjectTab />} />
              <Route path="program/investment/supporter" element={<UserInvestmentProjectTab />} />
              <Route path="program/investment/reclaim" element={<UserInvestmentReclaimTab />} />
              <Route path="community" element={<UserCommunityTab />} />
            </Route>
          </Route>

          <Route path="admin" element={<AdminOutlet />}>
            <Route index element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </ScrollWrapper>
  );
}

export default App;
