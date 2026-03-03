import { PlusCircle, Search, Settings } from "lucide-react";
import { QuickAction } from "../../QuickAction";

export function QuickActions() {
  const actions = [
    {
      to: "/client/jobs/new",
      label: "Publicar un nuevo proyecto",
      description: "Crea una nueva oferta para atraer talentos.",
      icon: <PlusCircle className="size-5" />,
    },
    {
      to: "/client/profiles",
      label: "Buscar profesionales",
      description: "Encuentra al experto ideal para tu proyecto.",
      icon: <Search className="size-5" />,
    },
    {
      to: "/client/settings",
      label: "Configurar mi cuenta",
      description: "Gestiona tu información y preferencias.",
      icon: <Settings className="size-5" />,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Atajos Rápidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(({ to, label, description, icon }) => (
          <QuickAction
            key={to}
            to={to}
            icon={icon}
            title={label}
            description={description}
          />
        ))}
      </div>
    </section>
  );
}
