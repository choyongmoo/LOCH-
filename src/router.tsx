import { BrowserRouter, Route, Routes } from "react-router";
import { AuthLayout } from "./layouts/AuthLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import { MeetingLayout } from "./layouts/MeetingLayout"
import { Signin } from "./pages/Auth/Signin";
import { Signup } from "./pages/Auth/Signup";
import { Home } from "./pages/Home";
import { About } from "./pages/Home/About";
import { NotFound } from "./pages/NotFound";
import ProfilePage from "./pages/Workspace/ProfilePage";
import HomePage from "./pages/Workspace/HomePage";
import MunPage from "./pages/Workspace/MunPage";
import ContactPage from "./pages/Workspace/ContactPage";
import WorkspaceLayout from "./layouts/WorkspaceLayout";

import { Download } from "./pages/Home/Download"; 
import { Docs } from "@/pages/Home/Docs"; 
import { ForgotPassword } from "./pages/Auth/ForgotPassword";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="download" element={<Download />} /> 
           <Route path="docs" element={<Docs />} /> 
        </Route>

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
           <Route path="forgot-password" element={<ForgotPassword />} /> 
        </Route>

        {/* Workspace Pages */}
        <Route path="workspace" element={<WorkspaceLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="mun" element={<MunPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        {/* Meeting Pages */}
        <Route path="meeting" element={<MeetingLayout />}>
          <Route index element={<MeetingLayout />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
