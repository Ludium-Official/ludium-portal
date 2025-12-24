import ProtectedRoute from '@/components/auth/protected-route';
import AdminOutlet from '@/components/layout/admin-outlet';
import Layout from '@/components/layout/layout';
import AdminPage from '@/pages/admin';
import CommunityPage from '@/pages/community';
import CreateCommunityPage from '@/pages/community/create';
import CommunityDetailsPage from '@/pages/community/details';
import EditCommunityPage from '@/pages/community/edit';
import DashboardPage from '@/pages/dashboard';
import MainPage from '@/pages/main';
import ProgramsPage from '@/pages/programs';
import CreateProgram from '@/pages/programs/create';
import ProgramDetailsPage from '@/pages/programs/details';
import EditProgramPage from '@/pages/programs/edit';
import ScrollWrapper from '@/providers/scroll-wrapper';
import { Route, Routes } from 'react-router';
import RecruitmentDashboardBuilder from './pages/dashboard/recruitment/builder';
import RecruitmentDashboardBuilderDetail from './pages/dashboard/recruitment/builder/detail';
import RecruitmentDashboardSponsor from './pages/dashboard/recruitment/sponsor';
import RecruitmentDashboardSponsorDetail from './pages/dashboard/recruitment/sponsor/detail';
import ProfilePage from './pages/profile';
import PortfolioPage from './pages/portfolio';

function App() {
  return (
    <ScrollWrapper>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard">
              <Route index element={<DashboardPage />} />
              <Route path="recruitment">
                <Route path="sponsor">
                  <Route index element={<RecruitmentDashboardSponsor />} />
                  <Route path=":id" element={<RecruitmentDashboardSponsorDetail />} />
                </Route>
                <Route path="builder">
                  <Route index element={<RecruitmentDashboardBuilder />} />
                  <Route path=":id" element={<RecruitmentDashboardBuilderDetail />} />
                </Route>
              </Route>
            </Route>

            <Route path="profile">
              <Route index element={<ProfilePage />} />
            </Route>

            <Route path="portfolio">
              <Route index element={<PortfolioPage />} />
            </Route>

            <Route path="programs">
              <Route path="recruitment">
                <Route path="create" element={<CreateProgram />} />
                <Route path=":id/edit" element={<EditProgramPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="programs">
            <Route path="recruitment">
              <Route index element={<ProgramsPage />} />
              <Route path=":id" element={<ProgramDetailsPage />} />
            </Route>
          </Route>

          <Route path="community">
            <Route index element={<CommunityPage />} />
            <Route path="create" element={<CreateCommunityPage />} />
            <Route path="posts/:id" element={<CommunityDetailsPage />} />
            <Route path="posts/:id/edit" element={<EditCommunityPage />} />
          </Route>

          {/* <Route path="users">
            <Route index element={<UsersPage />} />
            <Route path=":id" element={<UserDetailsPage />}>
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<UserOverviewTab />} />
              <Route path="description" element={<UserDescriptionTab />} />
              <Route path="program/recruitment/builder" element={<UserRecruitmentBuilderTab />} />
              <Route path="program/investment" element={<UserInvestmentTab />} />
              <Route path="program/investment/host" element={<UserInvestmentHostTab />} />
              <Route path="program/investment/project" element={<UserInvestmentProjectTab />} />
              <Route path="program/investment/supporter" element={<UserInvestmentProjectTab />} />
              <Route path="program/investment/supporter" element={<UserInvestmentProjectTab />} />
              <Route path="community" element={<UserCommunityTab />} />
            </Route>
          </Route> */}

          <Route path="admin" element={<AdminOutlet />}>
            <Route index element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </ScrollWrapper>
  );
}

export default App;
