import { useQuery } from "@tanstack/react-query";
import { UserRound, Loader2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/date";
import { getProfilesService } from "@/services/profiles";
import { Link, useLocation } from "react-router-dom";

export function Profiles() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfilesService,
  });

  const location = useLocation();
  const basePath = location.pathname.startsWith("/professional")
    ? "/professional/profiles"
    : "/profiles";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <UserRound className="size-4" />
          Talentos disponibles
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Profesionales Destacados
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Explora perfiles de profesionales verificados y encuentra al talento
          ideal para tu proyecto
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mb-3 text-primary" />
          <p>Cargando perfiles...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 text-center">
          <p className="font-medium">Error al cargar los perfiles</p>
          <p className="text-sm mt-1">Intenta recargar la página</p>
        </div>
      ) : data && data.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 text-muted-foreground">
          <UserRound className="size-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">
            Aún no hay profesionales registrados
          </p>
          <p className="text-sm mt-1">
            Vuelve más tarde para ver nuevos talentos
          </p>
        </div>
      ) : (
        /* Profiles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((profile) => (
            <Link
              to={`${basePath}/${profile.id}`}
              key={profile.id}
              className="group bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1 cursor-pointer"
            >
              {/* Avatar + Name */}
              <div className="flex flex-col items-center text-center mb-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name || "Avatar"}
                    className="size-20 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/40 transition-all duration-300 mb-3"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-muted flex items-center justify-center ring-2 ring-border group-hover:ring-primary/40 transition-all duration-300 mb-3">
                    <UserRound className="size-8 text-muted-foreground" />
                  </div>
                )}

                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {profile.name || "Sin nombre"}
                </h2>

                {profile.title && (
                  <span className="inline-flex items-center gap-1 text-sm text-primary/80 font-medium mt-1">
                    {profile.title}
                  </span>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 text-center mb-4">
                  {profile.bio}
                </p>
              )}

              {/* Footer info */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-3 border-t border-border">
                <Calendar className="size-3.5" />
                <span>Miembro desde {formatDate(profile.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
