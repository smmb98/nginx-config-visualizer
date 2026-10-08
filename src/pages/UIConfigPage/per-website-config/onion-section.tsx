import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface OnionSectionProps {
  site: Site;
}

export function OnionSection({ site }: OnionSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const onion = site.onion;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Onion (Tor) Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Onion Address"
          tooltip="The .onion address for this Tor hidden service (e.g., example.onion)"
        >
          <Input
            value={onion.onionLocation}
            onChange={(e) => updateSiteField(site.id, "onion.onionLocation", e.target.value)}
            placeholder="youraddress.onion"
          />
          {/* Add validation warning if needed */}
          {onion.onionLocation && !onion.onionLocation.endsWith(".onion") && (
            <p className="text-xs text-red-500 mt-1">
              Warning: Onion addresses should end with .onion
            </p>
          )}
        </SectionRow>
      </div>
    </div>
  );
}