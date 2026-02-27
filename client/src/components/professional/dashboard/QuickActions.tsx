import { TrendingUp, Briefcase, FileText } from "lucide-react";
import { QuickAction } from "./QuickAction";

export function QuickActions() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Acciones rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          to="/professional/profile"
          icon={<TrendingUp className="size-5" />}
          title="Completar mi perfil"
          description="Mejora tu visibilidad añadiendo habilidades y experiencia."
        />
        <QuickAction
          to="/professional/jobs"
          icon={<Briefcase className="size-5" />}
          title="Explorar trabajos"
          description="Encuentra proyectos que se ajusten a tus habilidades."
        />
        <QuickAction
          to="/professional/proposals"
          icon={<FileText className="size-5" />}
          title="Mis propuestas"
          description="Revisa el estado de tus propuestas enviadas."
        />
      </div>
    </section>
  );
}
