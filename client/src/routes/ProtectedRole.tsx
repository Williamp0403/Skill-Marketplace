import { useAppAuth } from "@/store/Auth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRole() {
  const { needsOnboarding, loading } = useAppAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!needsOnboarding) {
    return <Navigate to="/" replace />;
  }

  console.log("needsOnboarding", needsOnboarding);

  return <Outlet />;
}
