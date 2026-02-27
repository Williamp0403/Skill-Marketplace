import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  UserRound,
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
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-[0.9375rem] font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              } justify-start`
            }
            title={label}
          >
            <Icon className="size-5 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border flex flex-col gap-1 items-stretch">
        <NavLink
          to="/client/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-[0.9375rem] font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            } justify-start`
          }
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
