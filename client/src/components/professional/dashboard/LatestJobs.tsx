import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/date";
import type { Job } from "@/types/job";

interface LatestJobsProps {
  jobs: Job[] | undefined;
  isLoading: boolean;
  isError?: boolean;
}

export function LatestJobs({ jobs, isLoading, isError }: LatestJobsProps) {
  const recentJobs = jobs?.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Últimas Ofertas</h2>
        <Link
          to="/professional/jobs"
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
          <p className="font-medium">Error al cargar las ofertas</p>
        </div>
      ) : !recentJobs || recentJobs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Briefcase className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground">
            No hay ofertas disponibles por el momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentJobs.map((job) => (
            <Link
              key={job.id}
              to={`/professional/jobs/${job.id}`}
              className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {job.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-semibold text-primary">
                  ${job.budget.toLocaleString("es-ES")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(job.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
