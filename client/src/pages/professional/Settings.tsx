import { useUser, useClerk } from "@clerk/clerk-react";
import { User, ExternalLink } from "lucide-react";

export function ProfessionalSettings() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las preferencias de tu cuenta y la seguridad.
        </p>
      </div>

      {/* Form Placeholder */}
      <div className="">
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="size-5 text-primary" />
                Información de la cuenta
              </h2>
              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="Avatar"
                  className="size-10 rounded-full border border-border object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Completo</label>
                <div className="h-10 px-3 flex items-center bg-secondary border border-border rounded-md text-foreground font-medium">
                  {user?.fullName || "Nombre no definido"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email principal</label>
                <div className="h-10 px-3 flex items-center bg-secondary border border-border rounded-md text-foreground font-medium truncate">
                  {user?.primaryEmailAddress?.emailAddress || "Cargando..."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Tu información personal es gestionada de forma segura por Clerk.
              Para modificar tu nombre, correo, imagen de perfil o cambiar tu
              contraseña, accede al panel de configuración.
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => openUserProfile()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="size-4" />
              Administrar con Clerk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
