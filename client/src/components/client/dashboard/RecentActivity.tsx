import { Link } from "react-router-dom";
import { FolderOpen, Users, Loader2 } from "lucide-react";
import type { DashboardRecentActivity } from "@/types/job";

interface RecentActivityProps {
  activity: DashboardRecentActivity[] | undefined;
  isLoading: boolean;
  isError?: boolean;
}

export function RecentActivity({
  activity,
  isLoading,
  isError,
}: RecentActivityProps) {
  if (isError) {
    return (
      <div className="bg-destructive/10 text-destructive border border-destructive/20 p-6 rounded-xl text-center">
        <p className="font-medium text-sm">
          Error al cargar actividad reciente
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-center min-h-[250px]">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
        {!activity || activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FolderOpen className="size-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No hay propuestas recientes.</p>
            <p className="text-sm">
              Tus últimas postulaciones aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.map((app) => (
              <div
                key={app.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all hover:border-primary/20"
              >
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-primary/20 transition-colors">
                  {app.professional.avatarUrl ? (
                    <img
                      src={app.professional.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="size-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    <span className="font-bold">
                      {app.professional.name || "Profesional"}
                    </span>{" "}
                    envió una propuesta
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Para tu proyecto: "{app.job.title}"
                  </p>
                </div>
                <Link
                  to={`/client/proposals?job=${app.job.id}`}
                  className="text-xs font-semibold text-primary hover:underline whitespace-nowrap px-3 py-1 bg-primary/10 rounded-full hover:bg-primary/20"
                >
                  Revisar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
