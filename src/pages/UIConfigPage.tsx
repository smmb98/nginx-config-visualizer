import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function UIConfigPage() {
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

  const closeSite = (e: React.MouseEvent, siteToDelete: string) => {
    e.stopPropagation(); // Prevents switching tabs when clicking 'X'
    const updatedSites = sites.filter((site) => site !== siteToDelete);
    setSites(updatedSites);

    // Logic to switch active tab if we closed the current one
    if (activeTab === siteToDelete && updatedSites.length > 0) {
      setActiveTab(updatedSites[updatedSites.length - 1]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-base p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="mb-8">
          <div>
            <h1 className="text-headline-lg text-on-surface mb-2">
              Configuration Generator
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              Optimize your NGINX environment with precise performance and
              security directives. Changes are validated in real-time against
              current schema.
            </p>
          </div>
        </div>

        {/* Per-Website Config heading */}
        <h2 className="text-headline-md text-on-surface">Per-Website Config</h2>

        {/* Site Selector */}
        <div
          className="w-full border-b-3 
        border-outline-variant 
        flex 
        justify-center
        overflow-x-auto"
        >
          {/* Site tabs */}
          <Tabs defaultValue="example.com" className="-mb-px">
            <TabsList variant="line">
              {sites.map((site) => (
                <TabsTrigger
                  key={site}
                  value={site}
                  className="px-4 py-4! border-0
                  border-b-3 border-transparent rounded-b-none
                  text-body-md
                  transition-colors
                  duration-150
                  hover:text-primary/80! 
                  hover:border-primary/70! 
                  data-[state=active]:border-primary/90!
                  data-[state=active]:text-primary!
                   "
                >
                  <span>{site}</span>
                  {/* Close Icon - Only show if more than 1 site exists */}
                  {sites.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => closeSite(e, site)}
                      className="
                      flex items-center justify-center
                      h-5 w-5
                      rounded-full
                      text-on-surface-variant
                      opacity-50
                      hover:opacity-100
                      hover:text-accent-error
                      hover:bg-accent-error/20 hover:border-accent-error/40 transition-all duration-150
                    "
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </TabsTrigger>
              ))}

              {/* Add Site Button */}
              <button
                onClick={addSite}
                className="flex items-center gap-1 px-4 py-1 
                whitespace-nowrap
                shrink-0
                min-w-max
                border-b-3 border-transparent
                text-on-surface-variant  
                transition-colors 
                duration-150
                hover:text-primary 
                hover:border-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add site
              </button>
            </TabsList>
          </Tabs>
        </div>

        {/* Empty card */}
        <div className="glass-panel rounded-xl p-6 min-h-[400px]" />
      </div>
    </div>
  );
}
