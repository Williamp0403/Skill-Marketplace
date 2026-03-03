import { FolderOpen, Users, Clock, UserCheck } from "lucide-react";
import { StatCard } from "../../StatCard";
import type { ClientDashboardStats } from "@/types/job";

interface StatsSectionProps {
  stats: ClientDashboardStats | undefined;
  isLoading: boolean;
  isError?: boolean;
}

export function StatsSection({ stats, isLoading, isError }: StatsSectionProps) {
  if (isError) {
    return (
      <div className="bg-destructive/10 text-destructive border border-destructive/20 p-6 rounded-xl text-center">
        <p className="font-medium">Error al cargar estadísticas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<FolderOpen className="size-5" />}
        label="Proyectos Publicados"
        value={isLoading ? null : (stats?.totalJobs ?? 0)}
        color="green"
      />
      <StatCard
        icon={<Users className="size-5" />}
        label="Propuestas Recibidas"
        value={isLoading ? null : (stats?.totalApplications ?? 0)}
        color="blue"
      />
      <StatCard
        icon={<Clock className="size-5" />}
        label="Pendientes"
        value={isLoading ? null : (stats?.pending ?? 0)}
        color="yellow"
      />
      <StatCard
        icon={<UserCheck className="size-5" />}
        label="Talentos Contratados"
        value={isLoading ? null : (stats?.accepted ?? 0)}
        color="green"
      />
    </div>
  );
}
