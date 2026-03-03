import { TrendingUp, Briefcase, FileText } from "lucide-react";
import { QuickAction } from "../../QuickAction";

export function QuickActions() {
  const actions = [
    {
      to: "/professional/profile",
      icon: <TrendingUp className="size-5" />,
      label: "Completar mi perfil",
      description: "Mejora tu visibilidad añadiendo habilidades y experiencia.",
    },
    {
      to: "/professional/jobs",
      icon: <Briefcase className="size-5" />,
      label: "Explorar trabajos",
      description: "Encuentra proyectos que se ajusten a tus habilidades.",
    },
    {
      to: "/professional/proposals",
      icon: <FileText className="size-5" />,
      label: "Mis propuestas",
      description: "Revisa el estado de tus propuestas enviadas.",
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Acciones rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickAction
            key={action.to}
            to={action.to}
            icon={action.icon}
            title={action.label}
            description={action.description}
          />
        ))}
      </div>
    </section>
  );
}
