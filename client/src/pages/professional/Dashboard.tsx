import {
  Briefcase,
  TrendingUp,
  Eye,
  FileText,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function ProfessionalDashboard() {
  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Bienvenido de vuelta! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Aquí tienes un resumen de tu actividad en Skill Marketplace.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="size-5" />}
          label="Vistas de perfil"
          value="—"
          trend="Esta semana"
        />
        <StatCard
          icon={<FileText className="size-5" />}
          label="Propuestas enviadas"
          value="0"
          trend="Total"
        />
        <StatCard
          icon={<Briefcase className="size-5" />}
          label="Trabajos activos"
          value="0"
          trend="En progreso"
        />
        <StatCard
          icon={<Star className="size-5" />}
          label="Valoración"
          value="—"
          trend="Promedio"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
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
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Actividad reciente</h2>
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Clock className="size-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No tienes actividad reciente. ¡Empieza explorando trabajos
            disponibles!
          </p>
          <NavLink
            to="/professional/jobs"
            className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline"
          >
            Ver trabajos disponibles
            <ArrowRight className="size-4" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

/* ─── Subcomponents ─── */

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <NavLink
      to={to}
      className="group flex flex-col gap-3 bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="p-2.5 bg-primary/10 rounded-lg w-fit text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Ir ahora <ArrowRight className="size-3" />
      </div>
    </NavLink>
  );
}
