import Layout from '@/components/layout/layout';
import CommunityPage from '@/pages/community';
import CreateCommunityPage from '@/pages/community/create';
import CommunityDetailsPage from '@/pages/community/details';
import EditCommunityPage from '@/pages/community/edit';
import UsersPage from '@/pages/community/users';
import UserDetailsPage from '@/pages/community/users/details';
import LoginPage from '@/pages/login';
import MainPage from '@/pages/main';
import ProfilePage from '@/pages/profile';
import EditProfilePage from '@/pages/profile/edit';
import ProgramsPage from '@/pages/programs';
import CreateProgramPage from '@/pages/programs/create';
import ProgramDetailsPage from '@/pages/programs/details';
import ApplicationDetailsPage from '@/pages/programs/details/application-details';
import EditProgramPage from '@/pages/programs/edit';
import ScrollWrapper from '@/providers/scroll-wrapper';
import { Route, Routes } from 'react-router';

function App() {
  return (
    // <BrowserRouter>
    <ScrollWrapper>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile">
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditProfilePage />} />
          </Route>
          <Route path="programs">
            <Route index element={<ProgramsPage />} />
            <Route path="create" element={<CreateProgramPage />} />
            <Route path=":id" element={<ProgramDetailsPage />} />
            <Route path=":id/edit" element={<EditProgramPage />} />
            <Route
              path=":id/application/:applicationId/details"
              element={<ApplicationDetailsPage />}
            />
          </Route>
          <Route path="community">
            <Route index element={<CommunityPage />} />
            <Route path="create" element={<CreateCommunityPage />} />
            <Route path="posts/:id" element={<CommunityDetailsPage />} />
            <Route path="posts/:id/edit" element={<EditCommunityPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </ScrollWrapper>
    // </BrowserRouter>
  );
}

export default App;
