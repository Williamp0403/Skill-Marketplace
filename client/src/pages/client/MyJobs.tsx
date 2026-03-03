import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Loader2,
  DollarSign,
  Clock,
  Users,
  PlusCircle,
  MonitorSmartphone,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { getClientJobsService } from "@/services/jobs";

export function MyJobs() {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["client-jobs"],
    queryFn: getClientJobsService,
  });

  const getWorkModelText = (model?: string) => {
    switch (model) {
      case "REMOTE":
        return "Remoto";
      case "HYBRID":
        return "Híbrido";
      case "ONSITE":
        return "Presencial";
      default:
        return "";
    }
  };

  const getJobTypeText = (type?: string) => {
    switch (type) {
      case "FULL_TIME":
        return "Tiempo Completo";
      case "PART_TIME":
        return "Medio Tiempo";
      case "FREELANCE":
        return "Proyectos / Gigs";
      case "CONTRACT":
        return "Contrato Fijo";
      default:
        return "";
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
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

      {/* States */}
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
            <Link
              to={`/client/jobs/${job.id}`}
              key={job.id}
              className="group bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 flex flex-col md:flex-row gap-6 md:items-center justify-between"
            >
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h2>
                  <div className="inline-flex shrink-0 items-center justify-center gap-1.5 bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-lg text-sm md:hidden">
                    <DollarSign className="size-4" />
                    {job.budget?.toLocaleString("es-ES")}
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Badges Modalidad y Tipo */}
                  <div className="flex gap-2">
                    {job.workModel && (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 font-normal text-xs"
                      >
                        <MonitorSmartphone className="size-3" />
                        {getWorkModelText(job.workModel)}
                      </Badge>
                    )}
                    {job.jobType && (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 font-normal text-xs"
                      >
                        <ClipboardList className="size-3" />
                        {getJobTypeText(job.jobType)}
                      </Badge>
                    )}
                  </div>

                  {/* Metadatos */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div
                      className="flex items-center gap-1.5"
                      title="Propuestas recibidas"
                    >
                      <Users className="size-3.5" />
                      <span className="font-medium text-foreground">
                        {job._count?.applications || 0}
                      </span>{" "}
                      propuestas
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Desktop */}
              <div className="hidden md:flex flex-col items-end shrink-0 pl-6 border-l border-border/50">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  Presupuesto
                </span>
                <div className="inline-flex items-center gap-1 text-primary font-bold text-lg">
                  <DollarSign className="size-5" />
                  {job.budget?.toLocaleString("es-ES")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
