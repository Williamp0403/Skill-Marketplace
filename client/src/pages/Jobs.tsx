import { useState, useEffect } from "react";
import { formatDate } from "@/lib/date";
import { getJobsService } from "@/services/jobs";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Clock,
  Briefcase,
  Loader2,
  MonitorSmartphone,
  ClipboardList,
  Search,
  FilterX,
  GraduationCap,
  Building2,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { getWorkModelText, getJobTypeText, getExperienceLevelText } from "@/lib/job-formatters";

export function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [workModel, setWorkModel] = useState<string>("all");
  const [experienceLevel, setExperienceLevel] = useState<string>("all");
  const [jobType, setJobType] = useState<string>("all");

  // Debounce for text search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", debouncedSearch, workModel, experienceLevel, jobType],
    queryFn: () =>
      getJobsService({
        search: debouncedSearch || undefined,
        workModel: workModel !== "all" ? workModel : undefined,
        experienceLevel:
          experienceLevel !== "all" ? experienceLevel : undefined,
        jobType: jobType !== "all" ? jobType : undefined,
      }),
  });

  const location = useLocation();
  const basePath = location.pathname.startsWith("/professional")
    ? "/professional/jobs"
    : location.pathname.startsWith("/client")
      ? "/client/jobs"
      : "/jobs";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Ofertas de trabajo
        </h1>
        <p className="text-muted-foreground mt-2">
          Encuentra el proyecto perfecto para tus habilidades
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 flex flex-col lg:flex-row gap-6 items-end shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex-1 w-full space-y-2">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Search className="size-3" />
            Palabras clave
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Ej: React, Figma, Frontend..."
              className="pl-9 w-full bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full lg:w-auto gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MonitorSmartphone className="size-3" />
              Modalidad
            </Label>
            <Select value={workModel} onValueChange={setWorkModel}>
              <SelectTrigger className="w-full lg:w-[150px] bg-background">
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="REMOTE">Remoto</SelectItem>
                <SelectItem value="HYBRID">Híbrido</SelectItem>
                <SelectItem value="ONSITE">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="size-3" />
              Tipo de trabajo
            </Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full lg:w-[155px] bg-background">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="FULL_TIME">Tiempo Completo</SelectItem>
                <SelectItem value="PART_TIME">Medio Tiempo</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
                <SelectItem value="CONTRACT">Contrato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="size-3" />
              Nivel de experiencia
            </Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="w-full lg:w-[150px] bg-background">
                <SelectValue placeholder="Experiencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquiera</SelectItem>
                <SelectItem value="JUNIOR">Junior</SelectItem>
                <SelectItem value="MID_LEVEL">Semi-Senior</SelectItem>
                <SelectItem value="SENIOR">Senior</SelectItem>
                <SelectItem value="EXPERT">Experto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(searchTerm ||
          workModel !== "all" ||
          jobType !== "all" ||
          experienceLevel !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-destructive h-9 lg:mb-0"
            onClick={() => {
              setSearchTerm("");
              setWorkModel("all");
              setJobType("all");
              setExperienceLevel("all");
            }}
          >
            <FilterX className="size-4 mr-2" />
            Limpia Filtros
          </Button>
        )}
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
              className="group bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 flex flex-col md:flex-row gap-6 md:items-center justify-between"
            >
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h2>
                  {/* Budget Mobile */}
                  <div className="inline-flex shrink-0 items-center justify-center gap-1 bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-lg text-sm md:hidden">
                    <DollarSign className="size-4" />
                    {job.budget.toLocaleString("es-ES")}
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-2">
                  {/* Badges Principales */}
                  <div className="flex flex-wrap items-center gap-2">
                    <JobStatusBadge status={job.status} />
                    <Badge variant="secondary" className="gap-1.5 font-normal text-xs">
                      <Building2 className="size-3" />
                      {job.client.clientProfile?.companyName || job.client.name}
                    </Badge>
                    {job.workModel && (
                      <Badge variant="secondary" className="gap-1.5 font-normal text-xs">
                        <MonitorSmartphone className="size-3" />
                        {getWorkModelText(job.workModel)}
                      </Badge>
                    )}
                    {job.jobType && (
                      <Badge variant="secondary" className="gap-1.5 font-normal text-xs">
                        <ClipboardList className="size-3" />
                        {getJobTypeText(job.jobType)}
                      </Badge>
                    )}
                    {job.experienceLevel && (
                      <Badge variant="secondary" className="gap-1.5 font-normal text-xs">
                        <GraduationCap className="size-3" />
                        {getExperienceLevelText(job.experienceLevel)}
                      </Badge>
                    )}
                  </div>

                  {/* Metadatos */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0 border-t xl:border-none pt-3 xl:pt-0">
                    <div className="flex items-center gap-1.5" title="Propuestas enviadas">
                      <Users className="size-3.5" />
                      <span className="font-medium text-foreground">{job._count?.applications || 0}</span>
                      <span className="hidden sm:inline">propuestas</span>
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
                <div className="inline-flex items-center gap-1 text-primary font-bold text-xl">
                  <DollarSign className="size-5" />
                  {job.budget.toLocaleString("es-ES")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
