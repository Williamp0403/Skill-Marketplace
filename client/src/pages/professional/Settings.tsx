import { Bell, Lock, User, ShieldCheck } from "lucide-react";

export function ProfessionalSettings() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las preferencias de tu cuenta y la seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Mini Settings */}
        <div className="md:col-span-1 space-y-1">
          <SettingsTab
            icon={<User className="size-4" />}
            label="Cuenta"
            active
          />
          <SettingsTab
            icon={<Bell className="size-4" />}
            label="Notificaciones"
          />
          <SettingsTab icon={<Lock className="size-4" />} label="Seguridad" />
          <SettingsTab
            icon={<ShieldCheck className="size-4" />}
            label="Privacidad"
          />
        </div>

        {/* Form Placeholder */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="size-5 text-primary" />
                Información de la cuenta
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <div className="h-10 px-3 flex items-center bg-secondary border border-border rounded-md text-muted-foreground">
                    Cargando...
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="h-10 px-3 flex items-center bg-secondary border border-border rounded-md text-muted-foreground">
                    Cargando...
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
    >
      {icon}
      {label}
    </button>
  );
}
