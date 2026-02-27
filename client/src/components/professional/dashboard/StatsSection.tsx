import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsSectionProps {
  stats:
    | {
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
      }
    | undefined;
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<FileText className="size-5" />}
        label="Total Propuestas"
        value={isLoading ? null : (stats?.total ?? 0)}
        color="primary"
      />
      <StatCard
        icon={<Clock className="size-5" />}
        label="Pendientes"
        value={isLoading ? null : (stats?.pending ?? 0)}
        color="yellow"
      />
      <StatCard
        icon={<CheckCircle2 className="size-5" />}
        label="Aceptadas"
        value={isLoading ? null : (stats?.accepted ?? 0)}
        color="green"
      />
      <StatCard
        icon={<XCircle className="size-5" />}
        label="Rechazadas"
        value={isLoading ? null : (stats?.rejected ?? 0)}
        color="red"
      />
    </div>
  );
}
