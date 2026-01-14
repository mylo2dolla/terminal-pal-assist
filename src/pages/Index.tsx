import { TerminalHero } from "@/components/TerminalHero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CommandInput } from "@/components/CommandInput";
import { StatusBar } from "@/components/StatusBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <TerminalHero />
      <FeaturesSection />
      <CommandInput />
      <StatusBar />
    </div>
  );
};

export default Index;
