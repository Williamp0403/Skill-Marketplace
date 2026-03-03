import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientJobsService } from "@/services/jobs";
import {
  getApplicationsForJobService,
  updateApplicationStatusService,
} from "@/services/applications";
import { formatDate } from "@/lib/date";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  DollarSign,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ClientProposals() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Obtener los proyectos del cliente para el selector
  const { data: jobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ["client-jobs"],
    queryFn: getClientJobsService,
  });

  // Leer el jobId de la URL, o usar el primer job disponible, o "all"
  const selectedJobId =
    searchParams.get("job") || (jobs && jobs.length > 0 ? jobs[0].id : "all");

  const handleJobChange = (jobId: string) => {
    setSearchParams({ job: jobId }, { replace: true });
  };

  // Obtener las propuestas del proyecto seleccionado
  const { data: applications, isLoading: isApplicationsLoading } = useQuery({
    queryKey: ["client-job-applications", selectedJobId],
    queryFn: () => getApplicationsForJobService(selectedJobId),
    enabled: selectedJobId !== "all",
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "REJECTED";
    }) => updateApplicationStatusService(id, status),
    onSuccess: () => {
      // Invalida la query para forzar el refetch y actualizar la vista
      queryClient.invalidateQueries({
        queryKey: ["client-job-applications", selectedJobId],
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            Pendiente
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          >
            Aceptado
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/20"
          >
            Rechazado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propuestas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Revisa y gestiona las aplicaciones de los profesionales
          </p>
        </div>

        {/* Job Selector */}
        {!isJobsLoading && jobs && jobs.length > 0 && (
          <div className="w-full md:w-72 mt-4 md:mt-0">
            <Select value={selectedJobId} onValueChange={handleJobChange}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* States */}
      {isJobsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mb-3 text-primary" />
          <p>Cargando información...</p>
        </div>
      ) : jobs && jobs.length === 0 ? (
        <div className="text-center py-24 px-6 border border-dashed border-border rounded-xl bg-card">
          <Briefcase className="size-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">
            Aún no has publicado proyectos
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Publica un proyecto para empezar a recibir propuestas.
          </p>
          <Button asChild>
            <Link to="/client/jobs/new">Publicar Proyecto</Link>
          </Button>
        </div>
      ) : selectedJobId === "all" ? (
        <div className="text-center py-24 px-6 border border-border rounded-xl bg-card shadow-sm">
          <p className="text-muted-foreground">
            Selecciona un proyecto para ver sus propuestas
          </p>
        </div>
      ) : isApplicationsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mb-3 text-primary" />
          <p>Cargando propuestas...</p>
        </div>
      ) : applications && applications.length === 0 ? (
        <div className="text-center py-24 px-6 border border-border rounded-xl bg-card shadow-sm">
          <FileText className="size-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mb-1">Sin propuestas todavía</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Este proyecto aún no tiene postulaciones. Los profesionales pronto
            descubrirán tu oferta.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b pb-4">
            <h2 className="text-xl font-semibold">
              {applications?.length} Propuesta
              {applications?.length !== 1 ? "s" : ""}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {applications?.map((app) => (
              <div
                key={app.id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden relative"
              >
                {/* Visual state indicator line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    app.status === "ACCEPTED"
                      ? "bg-emerald-500"
                      : app.status === "REJECTED"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                />

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Pro Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {app.professional.avatarUrl ? (
                      <img
                        src={app.professional.avatarUrl}
                        alt="Avatar"
                        className="size-14 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="size-14 flex items-center justify-center bg-primary/10 rounded-full text-primary shrink-0">
                        <User className="size-6" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/client/profiles/${app.professional.id}?from=proposals`}
                          className="font-bold text-lg hover:text-primary transition-colors"
                        >
                          {app.professional.name || "Profesional"}
                        </Link>
                        {getStatusBadge(app.status)}
                      </div>

                      <p className="text-sm font-medium text-foreground">
                        {app.professional.professionalProfile?.title ||
                          "Sin título especificado"}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {app.professional.professionalProfile?.skills
                          .slice(0, 4)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="bg-accent/50 text-accent-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        {(app.professional.professionalProfile?.skills.length ||
                          0) > 4 && (
                          <span className="text-xs text-muted-foreground ml-1 flex items-center">
                            +
                            {(app.professional.professionalProfile?.skills
                              .length || 0) - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Meta & Actions */}
                  <div className="flex flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <div className="flex gap-6 lg:gap-8">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Tu Presupuesto
                        </p>
                        <div className="flex items-center gap-1 font-bold text-lg text-muted-foreground">
                          <DollarSign className="size-4" />
                          {app.job.budget.toLocaleString("es-ES")}
                        </div>
                      </div>
                      {app.proposedRate !== null && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            Tarifa Propuesta
                          </p>
                          <div
                            className={`flex items-center gap-1 font-bold text-lg ${
                              app.proposedRate <= app.job.budget
                                ? "text-emerald-500"
                                : "text-amber-500"
                            }`}
                          >
                            <DollarSign className="size-4" />
                            {app.proposedRate.toLocaleString("es-ES")}
                          </div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Fecha
                        </p>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <Clock className="size-4 text-muted-foreground/50" />
                          {formatDate(app.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 lg:flex-none"
                          >
                            Ver mensaje de la propuesta
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              Propuesta de {app.professional.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                            {app.message}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {app.status === "PENDING" && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-10 px-0"
                                disabled={updateStatusMutation.isPending}
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: app.id,
                                    status: "ACCEPTED",
                                  })
                                }
                              >
                                <CheckCircle2 className="size-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Aceptar propuesta</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                className="w-10 px-0"
                                disabled={updateStatusMutation.isPending}
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: app.id,
                                    status: "REJECTED",
                                  })
                                }
                              >
                                <XCircle className="size-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Rechazar propuesta</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
