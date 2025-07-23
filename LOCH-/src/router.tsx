import { BrowserRouter, Route, Routes } from "react-router";
import { AuthLayout } from "./layouts/AuthLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import { MeetingLayout } from "./layouts/MeetingLayout"
import { Signin } from "./pages/Auth/Signin";
import { Signup } from "./pages/Auth/Signup";
import { Home } from "./pages/Home";
import { About } from "./pages/Home/About";
import { NotFound } from "./pages/NotFound";

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
