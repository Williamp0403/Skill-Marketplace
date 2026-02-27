import { useQuery } from "@tanstack/react-query";
import {
  getMyStatsService,
  getMyApplicationsService,
} from "@/services/applications";
import { getJobsService } from "@/services/jobs";
import { RecentApplications } from "@/components/professional/dashboard/RecentApplications";
import { LatestJobs } from "@/components/professional/dashboard/LatestJobs";
import { QuickActions } from "@/components/professional/dashboard/QuickActions";
import { StatsSection } from "@/components/professional/dashboard/StatsSection";

export function ProfessionalDashboard() {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery({
    queryKey: ["my-stats"],
    queryFn: getMyStatsService,
  });

  const {
    data: applications,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
  } = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplicationsService,
  });

  const {
    data: latestJobs,
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobsService(),
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Bienvenido de vuelta! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Aquí tienes un resumen de tu actividad en Skill Marketplace.
        </p>
      </div>

      <StatsSection
        stats={stats}
        isLoading={isLoadingStats}
        isError={isErrorStats}
      />

      <RecentApplications
        applications={applications}
        isLoading={isLoadingApplications}
        isError={isErrorApplications}
      />

      <QuickActions />

      <LatestJobs
        jobs={latestJobs}
        isLoading={isLoadingJobs}
        isError={isErrorJobs}
      />
    </div>
  );
}
