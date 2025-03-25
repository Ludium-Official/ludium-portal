import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login";
import MainPage from "@/pages/main";
import ProfilePage from "@/pages/profile";
import ProgramsPage from "@/pages/programs";
import CreateProgram from "@/pages/programs/create";
import DetailsPage from "@/pages/programs/details";
import ProposalDetails from "@/pages/programs/details/application-details";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="programs">
            <Route index element={<ProgramsPage />} />
            <Route path="create" element={<CreateProgram />} />
            <Route path=":id/details" element={<DetailsPage />} />
          </Route>
          <Route path="application/:applicationId" element={<ProposalDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
