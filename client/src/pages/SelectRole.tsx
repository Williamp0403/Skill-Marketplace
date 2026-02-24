import { useAuth, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppAuth } from "@/store/Auth";
import { Briefcase, Search, CheckCircle2, Loader2 } from "lucide-react";

export function SelectRolePage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { refreshUser } = useAppAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<
    "CLIENT" | "PROFESSIONAL" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: selectedRole,
          name: user?.fullName || user?.firstName || "",
          avatarUrl: user?.imageUrl || "",
        }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar tu rol. Inténtalo de nuevo.");
      }

      // Actualizamos el estado global para que la app sepa que ya tienes rol
      await refreshUser();

      // Redirigimos al dashboard según el rol seleccionado
      const dashboard =
        selectedRole === "PROFESSIONAL"
          ? "/professional/dashboard"
          : "/client/dashboard";
      navigate(dashboard, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error inesperado al configurar tu cuenta.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-10 animate-in fade-in duration-700">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Header Section */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            ¡Bienvenido, <span className="text-primary">{user?.firstName}</span>
            !
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Para personalizar tu experiencia, cuéntanos cómo planeas usar{" "}
            <span className="font-semibold text-foreground">
              Skill Marketplace
            </span>
            .
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Roles Selection Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
          {/* Client Option */}
          <button
            onClick={() => setSelectedRole("CLIENT")}
            disabled={isSubmitting}
            className={`
              relative group flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-300
              hover:shadow-2xl hover:-translate-y-1
              ${
                selectedRole === "CLIENT"
                  ? "border-primary bg-primary/5 shadow-xl ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/50"
              }
            `}
          >
            {selectedRole === "CLIENT" && (
              <div className="absolute top-4 right-4 text-primary animate-in zoom-in spin-in-90 duration-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}

            <div
              className={`
              p-4 rounded-full mb-6 transition-colors duration-300
              ${
                selectedRole === "CLIENT"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
              }
            `}
            >
              <Search className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold mb-3">Quiero Contratar</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Busco talento profesional para mis proyectos. Quiero explorar
              perfiles y publicar ofertas.
            </p>
          </button>

          {/* Professional Option */}
          <button
            onClick={() => setSelectedRole("PROFESSIONAL")}
            disabled={isSubmitting}
            className={`
              relative group flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-300
              hover:shadow-2xl hover:-translate-y-1
              ${
                selectedRole === "PROFESSIONAL"
                  ? "border-primary bg-primary/5 shadow-xl ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/50"
              }
            `}
          >
            {selectedRole === "PROFESSIONAL" && (
              <div className="absolute top-4 right-4 text-primary animate-in zoom-in spin-in-90 duration-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}

            <div
              className={`
              p-4 rounded-full mb-6 transition-colors duration-300
              ${
                selectedRole === "PROFESSIONAL"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
              }
            `}
            >
              <Briefcase className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold mb-3">Quiero Trabajar</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Soy un profesional o freelancer. Quiero crear mi perfil, mostrar
              mi portafolio y encontrar clientes.
            </p>
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-8 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            className={`
              px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 mx-auto
              ${
                !selectedRole || isSubmitting
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Configurando perfil...
              </>
            ) : (
              <>
                Continuar como{" "}
                {selectedRole === "CLIENT"
                  ? "Cliente"
                  : selectedRole === "PROFESSIONAL"
                    ? "Profesional"
                    : ""}
              </>
            )}
          </button>

          {!selectedRole && (
            <p className="text-sm text-muted-foreground mt-4 animate-pulse">
              Selecciona una opción para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
