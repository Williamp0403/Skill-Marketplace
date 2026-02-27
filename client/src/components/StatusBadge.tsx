interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: "Pendiente",
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },
    ACCEPTED: {
      label: "Aceptada",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    REJECTED: {
      label: "Rechazada",
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  };

  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
