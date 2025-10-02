import { BrowserRouter, Route, Routes } from "react-router";
import { AuthLayout } from "./layouts/AuthLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import { Signin } from "./pages/Auth/Signin";
import { Signup } from "./pages/Auth/Signup";
import { Home } from "./pages/Home";
import { About } from "./pages/Home/About";
import { NotFound } from "./pages/NotFound";
import { ResetPassword } from "@/pages/Auth/ResetPassword";
import Docs from "@/pages/Home/Docs";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import DocsDetail from "./pages/Home/Doc/DocsDetail";
import { Download } from "./pages/Home/Download";
import Room from "./pages/Room";
import HomePage from "./pages/Workspace/HomePage";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import ProfilePage from "./pages/Workspace/ProfilePage";
import SettingPage from "./pages/Workspace/SettingPage";
import ManagerPage from "./pages/Workspace/ManagerPage";
import ContactPage from "./pages/Workspace/ContactPage";
import RecordPage from "./pages/Workspace/RecordPage";
import FriendRequestPage from "./pages/Workspace/FriendRequestPage";


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
          <Route path="docs/:slug" element={<DocsDetail />} />
        </Route>

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Workspace Pages */}
        <Route path="workspace" element={<WorkspaceLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element= { <HomePage /> } />
          <Route path="profile" element={ <ProfilePage /> } />
          <Route path="setting" element={ <SettingPage /> } />
          <Route path="manager" element={ <ManagerPage /> } />
          <Route path="contact" element={ <ContactPage /> } />
          <Route path="record" element={ <RecordPage /> } />
          <Route path="friend" element={ <FriendRequestPage /> } />
        </Route>

        {/* LiveKit Pages */}
        <Route path="room" element={<Room />} />
        <Route path="room/:roomId" element={<Room />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
