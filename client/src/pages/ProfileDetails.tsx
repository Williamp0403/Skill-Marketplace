import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "@/services/profiles";
import { formatDate } from "@/lib/date";
import {
  ArrowLeft,
  UserRound,
  Calendar,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function ProfileDetails() {
  const { id } = useParams();
  const location = useLocation();
  const backPath = location.pathname.startsWith("/professional")
    ? "/professional/profiles"
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
            Volver a talentos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver a talentos
        </Link>
      </div>

      {/* Badge */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <UserRound className="size-4" />
          Perfil profesional
        </div>
      </div>

      {/* Hero: Avatar + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
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

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-foreground">
            {data.name || "Sin nombre"}
          </h1>

          {data.title && (
            <p className="text-lg text-primary/80 font-medium mt-1">
              {data.title}
            </p>
          )}

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-muted-foreground mt-3">
            <Calendar className="size-4" />
            <span>Miembro desde {formatDate(data.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {data.bio && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Sobre mí
          </h2>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {data.bio}
          </p>
        </div>
      )}

      {/* Contact Button */}
      <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
        <Mail className="size-5" />
        Contactar
      </button>
    </div>
  );
}
