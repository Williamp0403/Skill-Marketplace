import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  UserRound,
  Users,
  Settings,
  Briefcase,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const navItems = [
  {
    to: "/client/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/client/jobs/new",
    icon: PlusCircle,
    label: "Publicar Proyecto",
  },
  {
    to: "/client/jobs",
    icon: FolderOpen,
    label: "Mis Proyectos",
  },
  {
    to: "/client/proposals",
    icon: FileText,
    label: "Propuestas Recibidas",
  },
  {
    to: "/client/profiles",
    icon: Users,
    label: "Buscar Talentos",
  },
  {
    to: "/client/profile",
    icon: UserRound,
    label: "Mi Perfil de Empresa",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClientSidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useClerk();
  const location = useLocation();

  const isRouteActive = (to: string) => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const fromProposals = searchParams.get("from") === "proposals";

    if (to === "/client/jobs") {
      // Activo en "Mis Proyectos" y en "Detalles de Proyecto" pero NO en "Publicar Proyecto"
      return (
        path === "/client/jobs" ||
        (path.startsWith("/client/jobs/") &&
          !path.startsWith("/client/jobs/new"))
      );
    }

    if (to === "/client/jobs/new") {
      return path === "/client/jobs/new";
    }

    // Si venimos de propuestas mantenemos "Propuestas" activo
    if (to === "/client/proposals") {
      return (
        path === "/client/proposals" ||
        (path.startsWith("/client/profiles/") && fromProposals)
      );
    }

    // Buscar Talentos (solo activo si NO venimos de propuestas)
    if (to === "/client/profiles") {
      return (
        path === "/client/profiles" ||
        (path.startsWith("/client/profiles/") && !fromProposals)
      );
    }

    // Para los demás (ej: /client/profile vs /client/profiles), requerimos coincidencia exacta o subruta real
    return path === to || path.startsWith(to + "/");
  };

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50 w-[280px] bg-card border-r border-border flex flex-col transition-transform duration-300 transform h-full
      lg:relative lg:translate-x-0 lg:flex
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      {/* Brand */}
      <div className="p-6 border-b border-border">
        <NavLink to="/client/dashboard" className="flex items-center gap-2.5">
          <div className="bg-primary rounded-lg p-1.5 shrink-0">
            <Briefcase className="size-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg truncate flex flex-col items-start leading-tight">
            Skill Marketplace
            <span className="text-xs text-primary font-medium tracking-wide">
              CLIENTE
            </span>
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 p-4 lg:p-6 lg:px-4 flex flex-col gap-1 items-stretch overflow-y-auto">
        <span className="text-[0.75rem] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
          Gestión
        </span>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = isRouteActive(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 p-3 rounded-lg text-[0.9375rem] font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              } justify-start`}
              title={label}
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border flex flex-col gap-1 items-stretch">
        <NavLink
          to="/client/settings"
          onClick={onClose}
          className={`flex items-center gap-3 p-3 rounded-lg text-[0.9375rem] font-medium transition-all ${
            isRouteActive("/client/settings")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          } justify-start`}
          title="Configuración"
        >
          <Settings className="size-5 shrink-0" />
          <span className="truncate">Configuración</span>
        </NavLink>
        <button
          onClick={() => {
            onClose();
            signOut();
          }}
          className="flex items-center gap-3 p-3 rounded-lg text-[0.9375rem] font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive justify-start w-full"
          title="Cerrar Sesión"
        >
          <LogOut className="size-5 shrink-0" />
          <span className="truncate">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
