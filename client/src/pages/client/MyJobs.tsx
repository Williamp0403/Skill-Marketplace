import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Loader2,
  Clock,
  Users,
  PlusCircle,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import {
  getClientJobsService,
  completeJobService,
  cancelJobService,
} from "@/services/jobs";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { getWorkModelText } from "@/lib/job-formatters";
import { AxiosError } from "axios";

export function MyJobs() {
  const queryClient = useQueryClient();
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["client-jobs"],
    queryFn: getClientJobsService,
  });

  const completeMutation = useMutation({
    mutationFn: completeJobService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-jobs"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error(
        "Error completing job:",
        error.response?.data?.error || error.message,
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelJobService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-jobs"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error(
        "Error canceling job:",
        error.response?.data?.error || error.message,
      );
    },
  });

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona los proyectos que has publicado
          </p>
        </div>
        <Button asChild className="shrink-0 gap-2">
          <Link to="/client/jobs/new">
            <PlusCircle className="size-4" />
            Publicar Nuevo Proyecto
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mb-3 text-primary" />
          <p>Cargando tus proyectos...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 text-center">
          <p className="font-medium">Error al cargar los proyectos</p>
          <p className="text-sm mt-1">Intenta recargar la página</p>
        </div>
      ) : jobs && jobs.length === 0 ? (
        <div className="text-center py-24 px-6 border border-dashed border-border rounded-xl bg-card">
          <Briefcase className="size-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">
            No tienes proyectos publicados
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Publica tu primer proyecto para empezar a recibir propuestas de los
            mejores talentos.
          </p>
          <Button asChild>
            <Link to="/client/jobs/new">Publicar Primer Proyecto</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs?.map((job) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <JobStatusBadge status={job.status} />
                  {job.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs h-7 px-2.5 border-green-500/50 text-green-600 hover:bg-green-50 hover:border-green-500"
                      onClick={() => completeMutation.mutate(job.id)}
                      disabled={
                        completeMutation.isPending || cancelMutation.isPending
                      }
                    >
                      {completeMutation.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-3" />
                      )}
                      Completar
                    </Button>
                  )}
                  {(job.status === "OPEN" || job.status === "IN_PROGRESS") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs h-7 px-2.5 border-red-500/50 text-red-600 hover:bg-red-50 hover:border-red-500"
                      onClick={() => cancelMutation.mutate(job.id)}
                      disabled={
                        completeMutation.isPending || cancelMutation.isPending
                      }
                    >
                      {cancelMutation.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      Cancelar
                    </Button>
                  )}
                </div>
                <Link
                  to={`/client/jobs/${job.id}`}
                  className="shrink-0 text-right"
                >
                  <span className="text-lg font-bold text-primary">
                    ${job.budget?.toLocaleString("es-ES")}
                  </span>
                </Link>
              </div>

              <Link to={`/client/jobs/${job.id}`} className="group block">
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {job.title}
                </h2>
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  <span>
                    {job.workModel
                      ? getWorkModelText(job.workModel)
                      : "No especificado"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  <span>
                    <span className="font-medium text-foreground">
                      {job._count?.applications || 0}
                    </span>{" "}
                    propuesta{job._count?.applications !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>{formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
