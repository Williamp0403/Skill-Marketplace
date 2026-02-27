import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit3,
  Loader2,
  Save,
  X,
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { useAppAuth } from "@/store/Auth";
import { Button } from "@/components/ui/button";
import {
  getMyProfessionalProfile,
  updateMyProfessionalProfile,
} from "@/services/professionalProfile";
import {
  professionalProfileSchema,
  type ProfessionalProfileFormValues,
} from "@/schemas/professionalProfile.schema";
import type { ProfessionalProfile } from "@/types/professionalProfile";

export function ProfessionalProfile() {
  const queryClient = useQueryClient();
  const { user } = useAppAuth();
  const [isEditing, setIsEditing] = useState(false);

  // 1. Fetch de los datos desde la BD (Le decimos explícitamente el tipo)
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<ProfessionalProfile>({
    queryKey: ["myProfessionalProfile"],
    queryFn: getMyProfessionalProfile,
  });

  // 2. React Hook Form config:
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalProfileFormValues>({
    resolver: zodResolver(professionalProfileSchema),
  });

  // 3. Mutación (guardar datos)
  const mutation = useMutation({
    mutationFn: updateMyProfessionalProfile,
    onSuccess: (updatedData) => {
      // Actualizamos la información visual automáticamente
      queryClient.setQueryData(["myProfessionalProfile"], updatedData);
      setIsEditing(false); // Salir del modo edición
    },
  });

  // 4. Handlers
  const handleEditClick = () => {
    if (profile) {
      // Si entramos a editar, rellenamos el form
      reset({
        title: profile.title ?? "",
        bio: profile.bio ?? "",
        hourlyRate: profile.hourlyRate ?? undefined,
        experienceYears: profile.experienceYears ?? undefined,
        location: profile.location ?? "",
        education: profile.education ?? "",
        availability: profile.availability ?? "",
        skills: profile.skills ? profile.skills.join(", ") : "",
        languages: profile.languages ? profile.languages.join(", ") : "",
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(); // Limpiar el formulario y tirar los cambios locales
  };

  // 5. Submit validado por Zod
  const onSubmit = (data: ProfessionalProfileFormValues) => {
    // Transformamos manualmente los strings separados por comas a Arrays
    // para cumplir con los Action Types del backend.
    const skillsArray = data.skills
      ? data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const languagesArray = data.languages
      ? data.languages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    mutation.mutate({
      ...data,
      skills: skillsArray,
      languages: languagesArray,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex h-64 items-center justify-center text-destructive">
        Error cargando el perfil. Por favor, recarga la página.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu información profesional y haz que los clientes te
            encuentren.
          </p>
        </div>
        {!isEditing ? (
          <Button className="gap-2" onClick={handleEditClick}>
            <Edit3 className="size-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              className="gap-2"
              onClick={handleCancel}
              disabled={isSubmitting || mutation.isPending}
            >
              <X className="size-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              form="profile-form"
              className="gap-2"
              disabled={isSubmitting || mutation.isPending}
            >
              {isSubmitting || mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      {!isEditing ? (
        // ********************
        // MODO LECTURA
        // ********************
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
              <div className="relative mx-auto size-32 mb-4 group">
                <img
                  src={
                    user?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=random`
                  }
                  alt={user?.name || "Avatar"}
                  className="size-full rounded-full object-cover border-4 border-background shadow-lg"
                />
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              {profile.title ? (
                <p className="text-primary font-medium text-sm mt-1">
                  {profile.title}
                </p>
              ) : (
                <p className="text-muted-foreground font-medium text-sm mt-1">
                  Sin título profesional
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-border space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Experiencia
                    </p>
                    <p className="font-medium">
                      {profile.experienceYears
                        ? `${profile.experienceYears} ${profile.experienceYears > 1 ? "años" : "año"}`
                        : "No definida"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Ubicación
                    </p>
                    <p className="font-medium">
                      {profile.location || "No definida"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Tarifa
                    </p>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400">
                      {profile.hourlyRate
                        ? `$${profile.hourlyRate}/h`
                        : "Negociable"}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/professional/settings"
                className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg py-2 hover:bg-accent"
              >
                <ExternalLink className="size-3" />
                Editar Datos Básicos
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {profile.bio && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Sobre mí</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-primary" /> Habilidades
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No has agregado habilidades aún.
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" /> Educación
              </h3>
              <p className="text-foreground">
                {profile.education || (
                  <span className="text-sm text-muted-foreground italic">
                    No has agregado información académica.
                  </span>
                )}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Idiomas</h3>
              {profile.languages && profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.languages.map((lang, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-foreground font-medium bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {lang}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No especificado.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // ********************
        // MODO EDICIÓN
        // ********************
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Título Profesional
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Ej: Desarrollador Frontend Senior"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Sobre mí (Resumen)
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full p-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  placeholder="Describe brevemente tu perfil, qué haces y cómo puedes ayudar..."
                />
              </div>

              {/* Tarifa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tarifa por hora (USD)
                </label>
                <input
                  type="number"
                  {...register("hourlyRate", { valueAsNumber: true })}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Ej: 25"
                />
                {errors.hourlyRate && (
                  <p className="text-red-500 text-xs">
                    {errors.hourlyRate.message?.toString()}
                  </p>
                )}
              </div>

              {/* Experiencia */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Años de experiencia
                </label>
                <input
                  type="number"
                  {...register("experienceYears", { valueAsNumber: true })}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Ej: 5"
                />
                {errors.experienceYears && (
                  <p className="text-red-500 text-xs">
                    {errors.experienceYears.message?.toString()}
                  </p>
                )}
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ubicación</label>
                <input
                  type="text"
                  {...register("location")}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Ej: Madrid, España / Remoto"
                />
              </div>

              {/* Educación */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Educación</label>
                <input
                  type="text"
                  {...register("education")}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Ej: Ing. Software, UPM"
                />
              </div>

              {/* Habilidades */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  Habilidades{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    Separadas por comas
                  </span>
                </label>
                <input
                  type="text"
                  {...register("skills")}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="React, TypeScript, Figma"
                />
              </div>

              {/* Idiomas */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  Idiomas{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    Separados por comas
                  </span>
                </label>
                <input
                  type="text"
                  {...register("languages")}
                  className="w-full h-10 px-3 border border-border rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Español Nativo, Inglés B2"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
