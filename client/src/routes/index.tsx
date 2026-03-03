import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { LandingPage } from "@/pages/LandingPage";
import { RootLayout } from "@/layouts/RootLayout";
import { ProfessionalLayout } from "@/layouts/ProfessionalLayout";
import { SelectRolePage } from "@/pages/SelectRole";
import { ProtectedRole } from "./ProtectedRole";
import { Jobs } from "@/pages/Jobs";
import { Profiles } from "@/pages/Profiles";
import { JobDetails } from "@/pages/JobDetails";
import { NotFound } from "@/pages/NotFound";
import { ProfileDetails } from "@/pages/ProfileDetails";
import { ProfessionalDashboard } from "@/pages/professional/Dashboard";
import { ProfessionalProfile } from "@/pages/professional/Profile";
import { ProfessionalProposals } from "@/pages/professional/Proposals";
import { ProfessionalSettings } from "@/pages/professional/Settings";
import { ClientLayout } from "@/layouts/ClientLayout";
import { ClientDashboard } from "@/pages/client/Dashboard";
import { CreateJob } from "@/pages/client/CreateJob";
import { MyJobs } from "@/pages/client/MyJobs";
import { ClientProposals } from "@/pages/client/ClientProposals";
import { ClientSettings } from "@/pages/client/Settings";
import { ClientProfile } from "@/pages/client/Profile";

export function IndexRoute() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Rutas Públicas (PublicHeader + Footer) ─── */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profiles/:id" element={<ProfileDetails />} />
          <Route element={<ProtectedRole />}>
            <Route path="/select-role" element={<SelectRolePage />} />
          </Route>
        </Route>

        {/* ─── Rutas de Profesional (ProfessionalHeader, sin Footer público) ─── */}
        <Route path="/professional" element={<ProfessionalLayout />}>
          <Route path="dashboard" element={<ProfessionalDashboard />} />
          <Route path="profile" element={<ProfessionalProfile />} />
          <Route path="proposals" element={<ProfessionalProposals />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="profiles/:id" element={<ProfileDetails />} />
          <Route path="settings" element={<ProfessionalSettings />} />
        </Route>

        {/* ─── Rutas de Cliente (ClientHeader, sin Footer público) ─── */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="jobs/new" element={<CreateJob />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="proposals" element={<ClientProposals />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="profiles/:id" element={<ProfileDetails />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="settings" element={<ClientSettings />} />
        </Route>

        {/* ─── 404 ─── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
