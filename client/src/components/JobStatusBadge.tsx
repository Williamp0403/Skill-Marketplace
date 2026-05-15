import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types/job";

interface JobStatusBadgeProps {
  status?: JobStatus;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  if (!status) return null;

  const variant =
    status === "OPEN"
      ? "default"
      : status === "IN_PROGRESS"
        ? "outline"
        : "secondary";

  const customClass =
    status === "IN_PROGRESS"
      ? "border-blue-500/50 text-blue-500 bg-blue-500/10"
      : status === "COMPLETED"
        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
        : status === "CANCELLED"
          ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
          : "";

  const text =
    status === "OPEN"
      ? "Abierto"
      : status === "IN_PROGRESS"
        ? "En Progreso"
        : status === "COMPLETED"
          ? "Completado"
          : status === "CANCELLED"
            ? "Cancelado"
            : status;

  return (
    <Badge
      variant={variant}
      className={`gap-1.5 font-medium text-xs ${customClass}`}
    >
      {text}
    </Badge>
  );
}
