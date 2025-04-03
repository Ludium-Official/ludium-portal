import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login";
import MainPage from "@/pages/main";
import ProfilePage from "@/pages/profile";
import EditProfilePage from "@/pages/profile/edit";
import ProgramsPage from "@/pages/programs";
import CreateProgram from "@/pages/programs/create";
import DetailsPage from "@/pages/programs/details";
import ApplicationDetails from "@/pages/programs/details/application-details";
import ApplicationSelected from "@/pages/programs/details/application-selected";
import EditProgram from "@/pages/programs/edit";
import ScrollWrapper from "@/providers/scroll-wrapper";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
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
              <Route path="create" element={<CreateProgram />} />
              <Route path=":id" element={<DetailsPage />} />
              <Route path=":id/edit" element={<EditProgram />} />
              <Route path=":id/application/:applicationId" element={<ApplicationSelected />} />
              <Route path=":id/application/:applicationId/details" element={<ApplicationDetails />} />
            </Route>
          </Route>
        </Routes>
      </ScrollWrapper>
    </BrowserRouter>
  );
}

export default App;
