import { Navigate } from "react-router-dom";
import { useAppAuth } from "../store/Auth";

/**
 * ProtectedRoute - Only accessible to fully authenticated users with a role.
 * If not authenticated → redirect to login
 * If authenticated but no role → redirect to onboarding
 * If authenticated with role → show content
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, user, needsOnboarding, isAuthenticated } = useAppAuth();

  if (loading) return <div>Cargando...</div>;

  // Not authenticated at all → go to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Authenticated but no role selected → go to onboarding
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;

  // Authenticated but user data somehow missing
  if (!user) return <Navigate to="/" replace />;

  return children;
};
