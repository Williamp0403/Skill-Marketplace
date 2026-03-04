import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobById } from "@/services/jobs";
import {
  applyToJobService,
  getMyApplicationsService,
} from "@/services/applications";
import { formatDate } from "@/lib/date";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppAuth } from "@/store/Auth";

import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  User,
  Loader2,
  AlertCircle,
  Send,
  CheckCircle2,
  MonitorSmartphone,
  GraduationCap,
  MapPin,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  applyJobSchema,
  type ApplyJobFormValues,
} from "@/schemas/aplicationSchema";

export function JobDetails() {
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
        return "Por Proyecto";
      case "CONTRACT":
        return "Contrato";
      default:
        return "";
    }
  };

  const getExperienceLevelText = (level?: string) => {
    switch (level) {
      case "JUNIOR":
        return "Junior";
      case "MID_LEVEL":
        return "Semi-Senior";
      case "SENIOR":
        return "Senior";
      case "EXPERT":
        return "Experto";
      default:
        return "";
    }
  };

  const { id } = useParams();
  const location = useLocation();
  const { user } = useAppAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const backPath = location.pathname.startsWith("/professional")
    ? "/professional/jobs"
    : location.pathname.startsWith("/client")
      ? "/client/jobs"
      : "/jobs";

  const {
    data: job,
    isLoading: isLoadingJob,
    isError: isJobError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id!),
  });

  const { data: myApplications } = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplicationsService,
    enabled: user?.role === "PROFESSIONAL",
  });

  const alreadyApplied = myApplications?.find((app) => app.jobId === id);

  const form = useForm<ApplyJobFormValues>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      message: "",
      proposedRate: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: applyToJobService,
    onSuccess: () => {
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errorMessage =
        error.response?.data?.error || "Error al enviar la aplicación";
      form.setError("root", { message: errorMessage });
    },
  });

  const onSubmit = (values: ApplyJobFormValues) => {
    mutation.mutate({
      jobId: id!,
      message: values.message,
      proposedRate: values.proposedRate,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open && job) {
      if (form.getValues("proposedRate") === undefined) {
        form.setValue("proposedRate", job.budget);
      }
    } else {
      form.clearErrors();
    }
  };

  if (isLoadingJob) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
        <Loader2 className="size-8 animate-spin mb-3 text-primary" />
        <p>Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (isJobError || !job) {
    return (
      <div className="max-w-lg mx-auto mt-20">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-6 text-center">
          <AlertCircle className="size-10 mx-auto mb-3 opacity-70" />
          <p className="font-medium text-lg">Proyecto no encontrado</p>
          <p className="text-sm mt-1 opacity-80">
            Es posible que haya sido eliminado o que el enlace sea incorrecto.
          </p>
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Volver a ofertas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back Navigation */}
      <Link
        to={backPath}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        Volver a ofertas
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Briefcase className="size-4" />
          Detalle del proyecto
        </div>

        <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          {/* Budget */}
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-lg">
            <DollarSign className="size-5" />
            <span className="text-lg">
              {job.budget.toLocaleString("es-ES")}
            </span>
          </div>

          {/* New Badges */}
          {job.workModel && (
            <Badge
              variant="secondary"
              className="gap-1.5 text-sm font-normal py-1 px-3"
            >
              <MonitorSmartphone className="size-4 text-muted-foreground" />
              {getWorkModelText(job.workModel)}
            </Badge>
          )}

          {job.jobType && (
            <Badge
              variant="secondary"
              className="gap-1.5 text-sm font-normal py-1 px-3"
            >
              <ClipboardList className="size-4 text-muted-foreground" />
              {getJobTypeText(job.jobType)}
            </Badge>
          )}

          {job.experienceLevel && (
            <Badge
              variant="secondary"
              className="gap-1.5 text-sm font-normal py-1 px-3"
            >
              <GraduationCap className="size-4 text-muted-foreground" />
              {getExperienceLevelText(job.experienceLevel)}
            </Badge>
          )}

          {job.location && (
            <Badge
              variant="secondary"
              className="gap-1.5 text-sm font-normal py-1 px-3"
            >
              <MapPin className="size-4 text-muted-foreground" />
              {job.location}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 mt-6">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Publicado {formatDate(job.createdAt)}</span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-border" />

          {/* Applications count */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>
              {job._count.applications}{" "}
              {job._count.applications === 1 ? "aplicación" : "aplicaciones"}
            </span>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {job.skills && job.skills.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Habilidades requeridas
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <div
                key={i}
                className="bg-primary/5 border border-primary/20 text-foreground px-3 py-1 rounded-md text-sm font-medium"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Descripción del proyecto
        </h2>
        <p className="text-foreground leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Client Info */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Publicado por
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {job.client.avatarUrl ? (
              <img
                src={job.client.avatarUrl}
                alt="Avatar"
                className="size-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="size-6 text-primary" />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">
                {job.client.clientProfile?.companyName || job.client.name}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {job.client.clientProfile?.industry && (
                  <span className="text-sm text-muted-foreground">
                    {job.client.clientProfile.industry}
                  </span>
                )}
                {job.client.clientProfile?.location && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3" />
                    {job.client.clientProfile.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to={`${backPath.replace("/jobs", "")}/companies/${job.client.id}`}
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <Briefcase className="size-4" />
              Ver empresa
            </Button>
          </Link>
        </div>
      </div>

      {/* Apply Button & Modal */}
      {user?.role === "PROFESSIONAL" &&
        (alreadyApplied ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="size-6" />
              <div>
                <p className="font-semibold">Ya te has postulado</p>
                <p className="text-xs text-muted-foreground">
                  Enviamos tu propuesta el{" "}
                  {formatDate(alreadyApplied.createdAt)}
                </p>
              </div>
            </div>
            <Link to="/professional/proposals">
              <Button variant="outline">Ver mis propuestas</Button>
            </Link>
          </div>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button
                size="xl"
                className="w-full sm:w-auto shadow-lg shadow-primary/20"
              >
                Aplicar a este proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Enviar Propuesta</DialogTitle>
                <DialogDescription>
                  Cuéntale al cliente por qué eres el talento ideal para{" "}
                  {job.title}.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 mt-4"
                >
                  {/* Proposed Rate */}
                  <FormField
                    control={form.control}
                    name="proposedRate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="m-0">
                            Tarifa Propuesta (USD)
                          </FormLabel>
                          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full border border-border/50">
                            Presupuesto: ${job.budget.toLocaleString("es-ES")}
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              placeholder="Ej. 1500"
                              className="pl-9"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "") {
                                  field.onChange(undefined);
                                  return;
                                }
                                const num = Number(val);
                                if (num >= 0) {
                                  field.onChange(num);
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje de Presentación</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe tu experiencia relevante para este proyecto..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submission Error */}
                  {form.formState.errors.root && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="size-4 shrink-0" />
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsDialogOpen(false);
                        form.reset();
                        console.log(form.getValues());
                      }}
                      disabled={mutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 size-4" />
                          Enviar Propuesta
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        ))}
    </div>
  );
}
