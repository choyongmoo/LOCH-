import { BrowserRouter, Route, Routes } from "react-router";
import { AuthLayout } from "./layouts/AuthLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import { Signin } from "./pages/Auth/Signin";
import { Signup } from "./pages/Auth/Signup";
import { Home } from "./pages/Home";
import { About } from "./pages/Home/About";
import { NotFound } from "./pages/NotFound";
import  WorkspaceLayout from "./layouts/WorkspaceLayout";
import HomePage from "@/pages/Workspace/HomePage"
import ProfilePage from "./pages/Workspace/ProfilePage";



export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Workspace Pages */}
        <Route path="workspace" element={<WorkspaceLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />         
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
