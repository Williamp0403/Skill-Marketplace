import { formatDate } from "@/lib/date";
import { getJobsService } from "@/services/jobs";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Clock, Briefcase, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Jobs() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobsService,
  });

  const location = useLocation();
  const basePath = location.pathname.startsWith("/professional")
    ? "/professional/jobs"
    : "/jobs";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Ofertas de trabajo
        </h1>
        <p className="text-muted-foreground mt-2">
          Encuentra el proyecto perfecto para tus habilidades
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mb-3 text-primary" />
          <p>Cargando ofertas...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 text-center">
          <p className="font-medium">Error al cargar las ofertas</p>
          <p className="text-sm mt-1">Intenta recargar la página</p>
        </div>
      ) : data && data.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="size-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No hay ofertas disponibles</p>
          <p className="text-sm mt-1">
            Vuelve más tarde para ver nuevas oportunidades
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.map((job) => (
            <Link
              to={`${basePath}/${job.id}`}
              key={job.id}
              className="group bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Clock className="size-3.5" />
                    <span>Publicado el {formatDate(job.createdAt)}</span>
                  </div>
                </div>

                {/* Budget */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-lg text-sm">
                    <DollarSign className="size-4" />
                    {job.budget.toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
