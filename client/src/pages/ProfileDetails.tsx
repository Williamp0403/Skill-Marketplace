import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "@/services/profiles";
import { formatDate } from "@/lib/date";
import {
  ArrowLeft,
  UserRound,
  Calendar,
  Loader2,
  AlertCircle,
  MapPin,
  DollarSign,
  Briefcase,
  Globe,
  GraduationCap,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProfileDetails() {
  const { id } = useParams();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const fromProposals = searchParams.get("from") === "proposals";

  const backPath = location.pathname.startsWith("/professional")
    ? "/professional/profiles"
    : location.pathname.startsWith("/client")
      ? fromProposals
        ? "/client/proposals"
        : "/client/profiles"
      : "/profiles";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfileById(id!),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
        <Loader2 className="size-8 animate-spin mb-3 text-primary" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-lg mx-auto mt-20">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-6 text-center">
          <AlertCircle className="size-10 mx-auto mb-3 opacity-70" />
          <p className="font-medium text-lg">Perfil no encontrado</p>
          <p className="text-sm mt-1 opacity-80">
            Es posible que haya sido eliminado o que el enlace sea incorrecto.
          </p>
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in duration-500">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      </div>

      {/* Hero: Avatar + Name + Quick Stats */}
      <div className="bg-card border border-border rounded-xl p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.name || "Avatar"}
              className="size-28 rounded-full object-cover ring-4 ring-primary/20 shrink-0"
            />
          ) : (
            <div className="size-28 rounded-full bg-muted flex items-center justify-center ring-4 ring-primary/20 shrink-0">
              <UserRound className="size-12 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-foreground">
              {data.name || "Sin nombre"}
            </h1>

            {data.title && (
              <p className="text-lg text-primary/80 font-medium mt-1">
                {data.title}
              </p>
            )}

            {/* Quick Info Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              {data.location && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {data.location}
                </div>
              )}
              {data.hourlyRate !== null && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <DollarSign className="size-4" />${data.hourlyRate}/hr
                </div>
              )}
              {data.experienceYears !== null && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Briefcase className="size-4" />
                  {data.experienceYears}{" "}
                  {data.experienceYears === 1 ? "año" : "años"} exp.
                </div>
              )}
              {data.availability && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {data.availability}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                Miembro desde {formatDate(data.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {data.bio && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Sobre mí
              </h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {data.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {data.portfolio.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Portafolio
              </h2>
              <div className="space-y-2">
                {data.portfolio.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <ExternalLink className="size-4 shrink-0" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Globe className="size-4" />
                Idiomas
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <GraduationCap className="size-4" />
                Educación
              </h2>
              <p className="text-foreground text-sm whitespace-pre-line">
                {data.education}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
