import { Route, Routes } from "react-router";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/Error/NotFound";
import Home from "../pages/Home";
import Room from "../pages/Room";
import { ProtectedRoute } from "./ProtectedRoute";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:shareCode" element={<Room />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
