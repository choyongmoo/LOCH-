import { Navigate, Outlet } from "react-router";
import { useSession } from "../contexts/SessionContext";

export function ProtectedRoute() {
  const { session, initialized } = useSession();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}
