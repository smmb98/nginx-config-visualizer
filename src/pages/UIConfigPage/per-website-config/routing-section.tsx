import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface RoutingSectionProps {
  site: Site;
}

export function RoutingSection({ site }: RoutingSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const routing = site.routing;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Routing Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Fallback route"
          tooltip="The fallback route for handling unmatched requests."
        >
          <Input
            value={routing.fallbackRoute}
            onChange={(e) => updateSiteField(site.id, "routing.fallbackRoute", e.target.value)}
            placeholder="/index.php"
          />
        </SectionRow>
      </div>
    </div>
  );
}