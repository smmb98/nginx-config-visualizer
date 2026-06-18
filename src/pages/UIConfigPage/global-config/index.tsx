import { useState } from "react";
import { TabSelector } from "@/components/TabSelector";
import { HttpsSection } from "./https-section";
import { SecuritySection } from "./security-section";
import { PythonSection } from "./python-section";
import { ReverseProxySection } from "./reverse-proxy-section";
import { PerformanceSection } from "./performance-section";
import { LoggingSection } from "./logging-section";
import { NginxSection } from "./nginx-section";
import { DockerSection } from "./docker-section";
import { ToolsSection } from "./tools-section";

const GLOBAL_SECTIONS = [
  { key: "https", label: "HTTPS" },
  { key: "security", label: "Security" },
  { key: "python", label: "Python" },
  { key: "reverse-proxy", label: "Reverse Proxy" },
  { key: "performance", label: "Performance" },
  { key: "logging", label: "Logging" },
  { key: "nginx", label: "NGINX" },
  { key: "docker", label: "Docker" },
  { key: "tools", label: "Tools" },
] satisfies { key: string; label: string }[];

export function GlobalConfigSection() {
  const [activeGlobalSection, setActiveGlobalSection] = useState("https");

  const renderSection = () => {
    switch (activeGlobalSection) {
      case "https":
        return <HttpsSection />;
      case "security":
        return <SecuritySection />;
      case "python":
        return <PythonSection />;
      case "reverse-proxy":
        return <ReverseProxySection />;
      case "performance":
        return <PerformanceSection />;
      case "logging":
        return <LoggingSection />;
      case "nginx":
        return <NginxSection />;
      case "docker":
        return <DockerSection />;
      case "tools":
        return <ToolsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-headline-md text-on-surface">Global Config</h2>

      <div className="glass-panel rounded-xl p-6 min-h-100">
        <TabSelector
          tabs={GLOBAL_SECTIONS.map((s) => ({ key: s.key, label: s.label }))}
          activeTab={activeGlobalSection}
          onTabChange={setActiveGlobalSection}
        />
        {renderSection()}
      </div>
    </div>
  );
}
