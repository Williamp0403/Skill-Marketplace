import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Loader2, Send, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/date";
import { StatusBadge } from "@/components/StatusBadge";
import type { Application } from "@/types/application";

interface RecentApplicationsProps {
  applications: Application[] | undefined;
  isLoading: boolean;
  isError?: boolean;
}

export function RecentApplications({
  applications,
  isLoading,
  isError,
}: RecentApplicationsProps) {
  const recentApplications = applications?.slice(0, 5);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Postulaciones Recientes</h2>
        <Link
          to="/professional/proposals"
          className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
        >
          Ver todas <ArrowRight className="size-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-8 flex justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-8 text-center flex flex-col items-center">
          <AlertCircle className="size-8 mb-3 opacity-80" />
          <p className="font-medium">Error al cargar las postulaciones</p>
        </div>
      ) : !recentApplications || recentApplications.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Send className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground">Aún no tienes postulaciones.</p>
          <NavLink
            to="/professional/jobs"
            className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline"
          >
            Explorar trabajos <ArrowRight className="size-4" />
          </NavLink>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {recentApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between px-5 py-4 gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">
                  {app.job.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {app.job.client?.name ?? "Cliente"} ·{" "}
                  {formatDate(app.createdAt)}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
