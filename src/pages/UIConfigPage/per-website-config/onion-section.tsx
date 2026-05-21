import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          label="Hidden service"
          tooltip="Enable Tor hidden service for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`onion-enabled-${site.id}`}
              checked={onion.enabled}
              onCheckedChange={(v) => updateSiteField(site.id, "onion.enabled", v)}
            />
            <Label htmlFor={`onion-enabled-${site.id}`} className="text-sm">
              Enable Tor hidden service
            </Label>
          </div>
        </SectionRow>
        {onion.enabled && (
          <SectionRow
            label="Onion location"
            tooltip="The .onion address for this site."
          >
            <Input
              value={onion.location}
              onChange={(e) => updateSiteField(site.id, "onion.location", e.target.value)}
              placeholder="example.onion"
            />
          </SectionRow>
        )}
      </div>
    </div>
  );
}