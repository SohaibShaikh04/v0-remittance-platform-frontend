import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  change?: number;
  icon?: React.ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, change, icon, accent }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-2xl p-5 border flex flex-col gap-3",
      accent ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-semibold uppercase tracking-wide", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {label}
        </span>
        {icon && (
          <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accent ? "bg-primary-foreground/15" : "bg-muted")}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className={cn("text-xs mt-0.5", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>{sub}</p>}
      </div>
      {change !== undefined && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", change >= 0 ? "text-[oklch(0.58_0.14_155)]" : "text-destructive")}>
          {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{change >= 0 ? "+" : ""}{change}% vs last month</span>
        </div>
      )}
    </div>
  );
}
