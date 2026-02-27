import { FolderOpen, Users, Clock, AlertCircle } from "lucide-react";
import { useAppAuth } from "@/store/Auth";

export function ClientDashboard() {
  const { user } = useAppAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola de nuevo, {user?.name?.split(" ")[0] || "Cliente"}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Este es el resumen de tu actividad y tus proyectos.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <FolderOpen className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Proyectos Activos
            </p>
            <h3 className="text-2xl font-bold">2</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Users className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Propuestas Nuevas
            </p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Clock className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              En Progreso
            </p>
            <h3 className="text-2xl font-bold">1</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-yellow-500/10 p-3 rounded-lg">
            <AlertCircle className="size-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Acción Requerida
            </p>
            <h3 className="text-2xl font-bold">3</h3>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FolderOpen className="size-12 mb-4 opacity-20" />
            <p className="text-lg">No hay actividades recientes.</p>
            <p className="text-sm">
              Tus últimas actualizaciones aparecerán aquí.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Atajos Rápidos</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              Publicar un nuevo proyecto
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              Buscar profesionales
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              Configurar mi cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
