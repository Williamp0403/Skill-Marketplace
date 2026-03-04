import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicClientProfileService } from "@/services/clientProfile";
import { formatDate } from "@/lib/date";
import {
  Building2,
  MapPin,
  Globe,
  Calendar,
  Briefcase,
  AlertCircle,
  Loader2,
  User,
  ExternalLink,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CompanyProfile() {
  const { id } = useParams<{ id: string }>();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getPublicClientProfileService(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
        <Loader2 className="size-8 animate-spin mb-3 text-primary" />
        <p>Cargando perfil de la empresa...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-lg mx-auto mt-20">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-6 text-center">
          <AlertCircle className="size-10 mx-auto mb-3 opacity-70" />
          <p className="font-medium text-lg">Perfil no encontrado</p>
          <p className="text-sm mt-1 opacity-80">
            Es posible que este cliente no exista o haya sido eliminado.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:underline"
          >
            Volver a ofertas
          </Link>
        </div>
      </div>
    );
  }

  const cp = profile.clientProfile;
  const displayName = cp?.companyName || profile.name;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Profile */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="size-24 rounded-2xl object-cover border border-border shadow-sm"
            />
          ) : (
            <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Building2 className="size-10 text-primary" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {displayName}
              </h1>
              {!cp?.companyName && (
                <Badge variant="secondary" className="mt-2 font-normal">
                  <User className="size-3 mr-1" /> Cliente Particular
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {cp?.industry && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="size-4" />
                  {cp.industry}
                </div>
              )}
              {cp?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {cp.location}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                Miembro desde {formatDate(profile.createdAt)}
              </div>
            </div>

            {cp?.website && (
              <a
                href={
                  cp.website.startsWith("http")
                    ? cp.website
                    : `https://${cp.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-2"
              >
                <Globe className="size-4" />
                {cp.website}
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      {cp?.about && (
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Acerca de la empresa
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {cp.about}
          </p>
        </div>
      )}

      {/* Published Jobs Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Proyectos Publicados
            <Badge variant="secondary" className="ml-2 font-normal">
              {profile.jobs.length}
            </Badge>
          </h2>
        </div>

        {profile.jobs.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
            <Briefcase className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground">
              Aún no hay proyectos
            </h3>
            <p className="text-muted-foreground mt-1">
              Este cliente no ha publicado ningún proyecto todavía.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {profile.jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-md cursor-pointer flex flex-col sm:flex-row gap-6 justify-between items-start"
              >
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    {job.skills &&
                      job.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    {job.skills && job.skills.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{job.skills.length - 3} más
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      {formatDate(job.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="size-4" />
                      {job._count.applications} propuestas
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-lg text-sm">
                    <DollarSign className="size-4" />
                    {job.budget.toLocaleString("es-ES")}
                  </div>
                  <div className="text-primary hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium -translate-x-2 group-hover:translate-x-0 duration-300">
                    Ver proyecto <ChevronRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
