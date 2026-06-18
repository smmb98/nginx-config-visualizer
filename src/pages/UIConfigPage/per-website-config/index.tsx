import { useState, type MouseEvent, useMemo, useCallback } from "react";
import { TabSelector } from "@/components/TabSelector";
import { ServerSection } from "./server-section";
import { HttpsSection } from "./https-section";
import { PhpSection } from "./php-section";
import { PythonSection } from "./python-section";
import { ReverseProxySection } from "./reverse-proxy-section";
import { RoutingSection } from "./routing-section";
import { LoggingSection } from "./logging-section";
import { RestrictSection } from "./restrict-section";
import { OnionSection } from "./onion-section";
import { useGlobalConfigStore } from "../store";

const SITE_SECTIONS = [
  { key: "server", label: "Server" },
  { key: "https", label: "HTTPS" },
  { key: "php", label: "PHP" },
  { key: "python", label: "Python" },
  { key: "reverse-proxy", label: "Reverse Proxy" },
  { key: "routing", label: "Routing" },
  { key: "logging", label: "Logging" },
  { key: "restrict", label: "Restrict" },
  { key: "onion", label: "Onion" },
] satisfies { key: string; label: string }[];

export function PerWebsiteConfigSection() {
  const [activeSection, setActiveSection] = useState("server");
  const sites = useGlobalConfigStore((s) => s.sites);
  const addSite = useGlobalConfigStore((s) => s.addSite);
  const removeSite = useGlobalConfigStore((s) => s.removeSite);

  const [activeTab, setActiveTab] = useState<string>(() => sites[0]?.id ?? "");

  // Keep activeTab synced with sites array
  const effectiveActiveTab = useMemo(() => {
    if (sites.length === 0) return "";
    if (sites.find((s) => s.id === activeTab)) return activeTab;
    return sites[sites.length - 1].id;
  }, [sites, activeTab]);

  const activeSite = useMemo(
    () => sites.find((s) => s.id === effectiveActiveTab),
    [sites, effectiveActiveTab],
  );

  const getNextDomain = useCallback(
    (domainList: typeof sites, base: string) => {
      const regex = new RegExp(`^${base}( \\((\\d+)\\))?$`);

      const usedNumbers = domainList
        .map((site) => {
          const match = site.server.domain.match(regex);
          if (!match) return 0;
          return match[2] ? Number(match[2]) : 0;
        })
        .filter((n) => !isNaN(n));

      let next = 0;
      while (usedNumbers.includes(next)) {
        next++;
      }

      return next === 0 ? base : `${base} (${next})`;
    },
    [],
  );

  const handleAddSite = useCallback(() => {
    const newDomain = getNextDomain(sites, "example.com");
    addSite({ domain: newDomain });
  }, [sites, addSite, getNextDomain]);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  const handleCloseSite = useCallback(
    (e: MouseEvent, siteId: string) => {
      e.stopPropagation();
      removeSite(siteId);
    },
    [removeSite],
  );

  const renderSection = () => {
    if (!activeSite) return null;

    switch (activeSection) {
      case "server":
        return <ServerSection site={activeSite} />;
      case "https":
        return <HttpsSection site={activeSite} />;
      case "php":
        return <PhpSection site={activeSite} />;
      case "python":
        return <PythonSection site={activeSite} />;
      case "reverse-proxy":
        return <ReverseProxySection site={activeSite} />;
      case "routing":
        return <RoutingSection site={activeSite} />;
      case "logging":
        return <LoggingSection site={activeSite} />;
      case "restrict":
        return <RestrictSection site={activeSite} />;
      case "onion":
        return <OnionSection site={activeSite} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-headline-md text-on-surface">Per-Website Config</h2>

      <TabSelector
        tabs={sites.map((s) => ({ key: s.id, label: s.server.domain }))}
        activeTab={effectiveActiveTab}
        onTabChange={handleTabChange}
        onAddTab={handleAddSite}
        addLabel="Add site"
        showAddButton
        onCloseTab={(siteId, e) => handleCloseSite(e, siteId)}
      />

      <div className="glass-panel rounded-xl p-6 min-h-100">
        <TabSelector
          tabs={SITE_SECTIONS.map((s) => ({ key: s.key, label: s.label }))}
          activeTab={activeSection}
          onTabChange={setActiveSection}
        />
        {renderSection()}
      </div>
    </div>
  );
}
