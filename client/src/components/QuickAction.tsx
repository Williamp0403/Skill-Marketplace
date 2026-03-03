import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface QuickActionProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function QuickAction({
  to,
  icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <NavLink
      to={to}
      className={`group flex flex-col justify-between gap-2 bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="flex flex-col gap-3">
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
      </div>
      <div className="flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Ir ahora <ArrowRight className="size-3" />
      </div>
    </NavLink>
  );
}
