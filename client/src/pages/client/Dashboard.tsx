import { useAppAuth } from "@/store/Auth";
import { useQuery } from "@tanstack/react-query";
import {
  getClientDashboardStatsService,
  getClientRecentActivityService,
} from "@/services/jobs";
import { StatsSection } from "@/components/client/dashboard/StatsSection";
import { RecentActivity } from "@/components/client/dashboard/RecentActivity";
import { QuickActions } from "@/components/client/dashboard/QuickActions";

export function ClientDashboard() {
  const { user } = useAppAuth();

  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery({
    queryKey: ["client-dashboard-stats"],
    queryFn: getClientDashboardStatsService,
  });

  const {
    data: recentActivity,
    isLoading: isLoadingActivity,
    isError: isErrorActivity,
  } = useQuery({
    queryKey: ["client-recent-activity"],
    queryFn: getClientRecentActivityService,
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola de nuevo, {user?.name?.split(" ")[0] || "Cliente"}! 👋
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Este es el resumen de tu actividad y tus proyectos.
        </p>
      </div>

      {/* KPI Cards */}
      <StatsSection
        stats={stats}
        isLoading={isLoadingStats}
        isError={isErrorStats}
      />

      {/* Content Area */}
      <QuickActions />

      <RecentActivity
        activity={recentActivity}
        isLoading={isLoadingActivity}
        isError={isErrorActivity}
      />
    </div>
  );
}
