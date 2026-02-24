import { PublicHeader } from "../components/PublicHeader";
import { Footer } from "../components/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppAuth } from "@/store/Auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * RootLayout - Layout para las páginas públicas (landing, profiles, jobs, login, register).
 *
 * Si el usuario ya está autenticado y tiene rol, se le redirige a su dashboard
 * correspondiente cuando intenta acceder a páginas de auth o la landing.
 */

/**
 * Dado el rol del usuario y la ruta pública actual, retorna la ruta
 * equivalente dentro del layout del rol. Si no hay equivalente, retorna null.
 */
function getRedirectForRole(role: string, pathname: string): string | null {
  const rolePrefix = role === "PROFESSIONAL" ? "/professional" : "/client";
  const dashboard = `${rolePrefix}/dashboard`;

  // Landing, login, register → dashboard
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return dashboard;
  }

  // /jobs, /jobs/:id → /professional/jobs, /professional/jobs/:id
  if (pathname.startsWith("/jobs")) {
    return `${rolePrefix}${pathname}`;
  }

  // /profiles, /profiles/:id → /professional/profiles, /professional/profiles/:id
  if (pathname.startsWith("/profiles")) {
    return `${rolePrefix}${pathname}`;
  }

  return null;
}

export function RootLayout() {
  const { loading, isAuthenticated, needsOnboarding, user } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget =
    !loading && isAuthenticated && user && !needsOnboarding
      ? getRedirectForRole(user.role, location.pathname)
      : null;

  useEffect(() => {
    if (loading) return;

    // Si necesita onboarding, redirigir a seleccionar rol
    if (
      isAuthenticated &&
      needsOnboarding &&
      location.pathname !== "/select-role"
    ) {
      navigate("/select-role", { replace: true });
      return;
    }

    // Si ya tiene rol y hay una ruta equivalente → redirigir
    if (redirectTarget) {
      navigate(redirectTarget, { replace: true });
    }
  }, [
    loading,
    isAuthenticated,
    needsOnboarding,
    redirectTarget,
    navigate,
    location.pathname,
  ]);

  // Pantalla de carga mientras se verifica el usuario
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Evitar flash: si va a ser redirigido, no mostrar nada
  if (
    isAuthenticated &&
    needsOnboarding &&
    location.pathname !== "/select-role"
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Evitar flash: si tiene rol y va a ser redirigido
  if (redirectTarget) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
