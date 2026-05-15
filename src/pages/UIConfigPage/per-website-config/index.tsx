import { useState, type MouseEvent } from "react";
import { TabSelector } from "@/components/TabSelector";

export function PerWebsiteConfigSection() {
  const [sites, setSites] = useState(["example.com"]);
  const [activeTab, setActiveTab] = useState("example.com");

  const getNextSiteName = (base: string, sites: string[]) => {
    const regex = new RegExp(`^${base}( \\((\\d+)\\))?$`);

    const usedNumbers = sites
      .map((site) => {
        const match = site.match(regex);
        if (!match) return 0;
        return match[2] ? Number(match[2]) : 0;
      })
      .filter((n) => !isNaN(n));

    let next = 0;
    while (usedNumbers.includes(next)) {
      next++;
    }

    return next === 0 ? base : `${base} (${next})`;
  };

  const addSite = () => {
    const newSiteName = getNextSiteName("example.com", sites);

    setSites([...sites, newSiteName]);
    setActiveTab(newSiteName);
  };

  const closeSite = (e: MouseEvent, siteToDelete: string) => {
    e.stopPropagation();
    const updatedSites = sites.filter((site) => site !== siteToDelete);
    setSites(updatedSites);

    if (activeTab === siteToDelete && updatedSites.length > 0) {
      setActiveTab(updatedSites[updatedSites.length - 1]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-headline-md text-on-surface">Per-Website Config</h2>

      <TabSelector
        tabs={sites.map((s) => ({ key: s, label: s }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTab={addSite}
        addLabel="Add site"
        showAddButton
        onCloseTab={(site, e) => closeSite(e, site)}
      />

      <div className="glass-panel rounded-xl p-6 min-h-100" />
    </div>
  );
}