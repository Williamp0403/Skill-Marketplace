import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppAuth } from "@/store/Auth";

/**
 * AuthRedirectHandler - Componente invisible que maneja redirecciones automáticas.
 *
 * Colocado en RootLayout, observa el estado de autenticación y redirige:
 * - Autenticado + necesita onboarding → /select-role
 * - Autenticado + tiene rol + está en login/register → dashboard del rol
 */
const PUBLIC_AUTH_PAGES = ["/login", "/register"];

function getDashboardByRole(role: string): string {
  switch (role) {
    case "PROFESSIONAL":
      return "/professional/dashboard";
    case "CLIENT":
      return "/client/dashboard";
    default:
      return "/";
  }
}

export function AuthRedirectHandler() {
  const { loading, user, needsOnboarding, isAuthenticated } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;

    // 1. Si necesita onboarding y no está en select-role
    if (isAuthenticated && needsOnboarding) {
      if (currentPath !== "/select-role") {
        navigate("/select-role", { replace: true });
      }
      return;
    }

    // 2. Si ya tiene rol y está en login/register → ir a su dashboard
    if (isAuthenticated && user && !needsOnboarding) {
      if (PUBLIC_AUTH_PAGES.includes(currentPath)) {
        const dashboard = getDashboardByRole(user.role);
        navigate(dashboard, { replace: true });
      }
      return;
    }
  }, [
    loading,
    isAuthenticated,
    needsOnboarding,
    user,
    navigate,
    location.pathname,
  ]);

  return null;
}
