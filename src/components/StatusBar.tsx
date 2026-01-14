import { Server, Cpu, HardDrive, Wifi } from "lucide-react";

const stats = [
  { icon: Server, label: "Servers", value: "12", status: "online" },
  { icon: Cpu, label: "CPU Load", value: "23%", status: "normal" },
  { icon: HardDrive, label: "Storage", value: "2.4TB", status: "normal" },
  { icon: Wifi, label: "Network", value: "1.2Gbps", status: "online" },
];

export const StatusBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 bg-background/80 backdrop-blur-lg">
      <div className="container px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{stat.label}:</span>
                <span className="text-xs text-foreground font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};
