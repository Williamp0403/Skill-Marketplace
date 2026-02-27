import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FileText,
  Inbox,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
  Building2,
} from "lucide-react";
import { getMyApplicationsService } from "@/services/applications";
import type { Application, ApplicationStatus } from "@/types/application";

function getStatusInfo(status: ApplicationStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "En revisión",
        icon: Clock,
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
      };
    case "ACCEPTED":
      return {
        label: "Aceptada",
        icon: CheckCircle2,
        className:
          "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20",
      };
    case "REJECTED":
      return {
        label: "Rechazada",
        icon: XCircle,
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
      };
    default:
      return {
        label: "Desconocido",
        icon: AlertCircle,
        className: "bg-gray-100 text-gray-700 border-gray-200",
      };
  }
}

export function ProfessionalProposals() {
  const {
    data: applications,
    isLoading,
    isError,
  } = useQuery<Application[]>({
    queryKey: ["my-applications"],
    queryFn: getMyApplicationsService,
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Propuestas</h1>
        <p className="text-muted-foreground mt-1">
          Revisa y gestiona todas las propuestas que has enviado a proyectos.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">
            Cargando tus postulaciones...
          </p>
        </div>
      ) : isError ? (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-6 rounded-xl flex items-center gap-3">
          <AlertCircle className="size-6 shrink-0" />
          <p className="font-medium">
            Ocurrió un error al cargar tus propuestas. Inténtalo de nuevo más
            tarde.
          </p>
        </div>
      ) : applications?.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4 shadow-sm">
          <div className="bg-primary/10 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="size-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">No tienes propuestas aún</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Explora los trabajos disponibles y envía tu primera propuesta para
              empezar a conseguir proyectos emocionantes.
            </p>
          </div>
          <Link
            to="/professional/jobs"
            className="inline-flex items-center gap-2 mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            <FileText className="size-5" />
            Explorar Trabajos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications?.map((app) => {
            const statusInfo = getStatusInfo(app.status);
            const StatusIcon = statusInfo.icon;

            const dateStr = new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(app.createdAt));

            return (
              <div
                key={app.id}
                className="bg-card border border-border rounded-xl p-6 lg:p-8 hover:shadow-md hover:border-border/80 transition-all group"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  {/* Job Header */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {app.job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-4" />
                        {app.job.client.name || "Cliente verificado"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-4" />
                        Postulaste el {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${statusInfo.className}`}
                  >
                    <StatusIcon className="size-4" />
                    {statusInfo.label}
                  </div>
                </div>

                {/* Financials Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 bg-muted/40 p-5 rounded-xl border border-border/50">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Presupuesto Original
                    </p>
                    <p className="text-lg font-semibold flex items-center text-foreground">
                      <DollarSign className="size-5 text-muted-foreground" />
                      {app.job.budget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Tu Tarifa Propuesta
                    </p>
                    <p className="text-lg font-semibold flex items-center text-primary">
                      <DollarSign className="size-5" />
                      {app.proposedRate ? (
                        app.proposedRate.toLocaleString()
                      ) : (
                        <span className="text-foreground">
                          {app.job.budget.toLocaleString()}{" "}
                          <span className="text-xs text-muted-foreground font-normal ml-1">
                            (No modificada)
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Message Snippet */}
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2 text-foreground">
                    Tu mensaje de presentación:
                  </p>
                  <div className="bg-background rounded-lg p-4 text-muted-foreground text-sm italic border-l-4 border-l-primary/30">
                    "{app.message}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
