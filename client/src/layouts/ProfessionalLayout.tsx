import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { ProfessionalSidebar } from "@/components/ProfessionalSidebar";
import { useAppAuth } from "@/store/Auth";
import { Loader2 } from "lucide-react";

/**
 * ProfessionalLayout - Layout con Sidebar + Top Header para profesionales.
 */
export function ProfessionalLayout() {
  const { loading, isAuthenticated, needsOnboarding, user } = useAppAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding) {
    return <Navigate to="/select-role" replace />;
  }

  if (user?.role !== "PROFESSIONAL") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Sidebar con control de estado */}
      <ProfessionalSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <ProfessionalHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
