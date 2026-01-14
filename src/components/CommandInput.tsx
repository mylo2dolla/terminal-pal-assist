import { useState } from "react";
import { Send, ChevronRight } from "lucide-react";

const suggestions = [
  "ssh connect production",
  "show system stats",
  "analyze traffic logs",
  "backup database",
  "check security status",
];

export const CommandInput = () => {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([
    "$ system --status",
    "✓ All systems operational",
    "$ uptime",
    "up 47 days, 3:22, load average: 0.52, 0.58, 0.59",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      setHistory([...history, `$ ${command}`, "Processing command..."]);
      setCommand("");
    }
  };

  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-terminal-green text-glow">&gt;</span> Command Center
            </h2>
            <p className="text-muted-foreground">
              Execute commands and manage your infrastructure
            </p>
          </div>

          {/* Terminal Window */}
          <div className="card-terminal rounded-lg border border-primary/30 overflow-hidden border-glow">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-primary/20">
              <div className="w-3 h-3 rounded-full bg-terminal-red" />
              <div className="w-3 h-3 rounded-full bg-terminal-amber" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
              <span className="ml-4 text-sm text-muted-foreground">command-center — interactive</span>
            </div>

            {/* Output area */}
            <div className="p-4 h-48 overflow-y-auto font-mono text-sm border-b border-primary/10">
              {history.map((line, index) => (
                <div 
                  key={index} 
                  className={`${line.startsWith("$") ? "text-terminal-amber" : line.startsWith("✓") ? "text-terminal-green" : "text-muted-foreground"}`}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex items-center gap-3">
                <ChevronRight className="w-5 h-5 text-terminal-green" />
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 font-mono"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all"
                >
                  <Send className="w-4 h-4 text-primary" />
                </button>
              </div>
            </form>

            {/* Suggestions */}
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setCommand(suggestion)}
                    className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
