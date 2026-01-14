import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

const commands = [
  "ssh admin@192.168.1.100",
  "sqlite3 /var/db/metrics.db",
  "htop --sort-key PERCENT_CPU",
  "tail -f /var/log/nginx/access.log",
  "netstat -tulpn | grep LISTEN",
];

export const TerminalHero = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const command = commands[currentCommand];
    let charIndex = 0;

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (charIndex <= command.length) {
          setDisplayText(command.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
            setTimeout(() => {
              setCurrentCommand((prev) => (prev + 1) % commands.length);
              setDisplayText("");
              setIsTyping(true);
            }, 1500);
          }, 1000);
        }
      }, 80);

      return () => clearInterval(typingInterval);
    }
  }, [currentCommand, isTyping]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(160_100%_50%_/_0.08)_0%,_transparent_70%)]" />
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="container relative z-10 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary">Terminal Assistant v1.0</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-glow">
            Server<span className="text-terminal-cyan text-glow-cyan">CMD</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Your intelligent terminal companion for SSH, SQLite, server monitoring, 
            and web traffic analysis. Execute with precision.
          </p>
        </div>

        {/* Terminal Window */}
        <div className="max-w-3xl mx-auto">
          <div className="card-terminal rounded-lg border border-primary/30 overflow-hidden border-glow">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-primary/20">
              <div className="w-3 h-3 rounded-full bg-terminal-red" />
              <div className="w-3 h-3 rounded-full bg-terminal-amber" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
              <span className="ml-4 text-sm text-muted-foreground">bash — server-cmd</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm md:text-base">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <span className="text-terminal-cyan">admin</span>
                <span>@</span>
                <span className="text-terminal-green">server</span>
                <span>~</span>
                <span className="text-terminal-amber">$</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-foreground">{displayText}</span>
                <span className="w-2 h-5 bg-primary ml-1 animate-blink" />
              </div>
              
              <div className="mt-4 pt-4 border-t border-primary/10">
                <p className="text-muted-foreground text-xs">
                  Ready to execute • {commands.length} commands queued • Latency: 12ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
