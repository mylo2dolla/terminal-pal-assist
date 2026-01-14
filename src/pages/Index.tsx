import { Header } from "@/components/Header";
import { TerminalHero } from "@/components/TerminalHero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CommandInput } from "@/components/CommandInput";
import { StatusBar } from "@/components/StatusBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      <div className="pt-14">
        <TerminalHero />
        <FeaturesSection />
        <CommandInput />
      </div>
      <StatusBar />
    </div>
  );
};

export default Index;
