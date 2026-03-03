import { Loader2 } from "lucide-react";

const colorMap = {
  yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string | null;
  color: keyof typeof colorMap;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className={`p-2 rounded-lg w-fit ${colorMap[color]}`}>{icon}</div>
      <div>
        {value === null ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}
