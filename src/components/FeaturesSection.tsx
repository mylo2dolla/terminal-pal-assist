import { 
  Terminal, 
  Database, 
  Activity, 
  Globe, 
  Shield, 
  Zap 
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Terminal,
    title: "SSH Management",
    description: "Secure shell connections with key management, session logging, and multi-hop tunneling support.",
    status: "online" as const,
    metrics: "connections: 24 | uptime: 99.9%",
  },
  {
    icon: Database,
    title: "SQLite Server",
    description: "Lightweight database operations with query optimization, backup automation, and data integrity checks.",
    status: "online" as const,
    metrics: "queries/s: 1.2k | size: 256MB",
  },
  {
    icon: Activity,
    title: "Server Monitoring",
    description: "Real-time CPU, memory, and disk monitoring with intelligent alerts and resource prediction.",
    status: "online" as const,
    metrics: "cpu: 23% | mem: 4.2GB | disk: 67%",
  },
  {
    icon: Globe,
    title: "Traffic Analysis",
    description: "Web traffic monitoring with request logging, bandwidth analysis, and geographic insights.",
    status: "standby" as const,
    metrics: "req/min: 847 | bandwidth: 12MB/s",
  },
  {
    icon: Shield,
    title: "Security Audit",
    description: "Continuous security scanning with vulnerability detection and compliance reporting.",
    status: "online" as const,
    metrics: "threats: 0 | last scan: 2m ago",
  },
  {
    icon: Zap,
    title: "Process Manager",
    description: "Manage system processes with start, stop, restart controls and automatic recovery.",
    status: "online" as const,
    metrics: "processes: 142 | zombies: 0",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(185_100%_60%_/_0.05)_0%,_transparent_60%)]" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-terminal-amber text-glow-amber">$</span> System Modules
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive tools for server administration and monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              status={feature.status}
              metrics={feature.metrics}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
