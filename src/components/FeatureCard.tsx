import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: "online" | "standby" | "offline";
  metrics?: string;
  className?: string;
}

const statusColors = {
  online: "bg-terminal-green",
  standby: "bg-terminal-amber",
  offline: "bg-terminal-red",
};

const statusLabels = {
  online: "ONLINE",
  standby: "STANDBY",
  offline: "OFFLINE",
};

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  status, 
  metrics,
  className 
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "group relative card-terminal rounded-lg border border-primary/20 p-6",
        "hover:border-primary/50 transition-all duration-300",
        "hover:shadow-[0_0_30px_hsl(var(--terminal-green)_/_0.2)]",
        className
      )}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{statusLabels[status]}</span>
        <div className={cn(
          "w-2 h-2 rounded-full",
          statusColors[status],
          status === "online" && "animate-pulse"
        )} />
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:border-glow transition-all duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-semibold mb-2 text-foreground group-hover:text-glow transition-all duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>

      {/* Metrics */}
      {metrics && (
        <div className="pt-4 border-t border-primary/10">
          <code className="text-xs text-terminal-cyan">{metrics}</code>
        </div>
      )}
    </div>
  );
};
