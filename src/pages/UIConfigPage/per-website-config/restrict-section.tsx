import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface RestrictSectionProps {
  site: Site;
}

export function RestrictSection({ site }: RestrictSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const restrict = site.restrict;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Restrict Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Allow list"
          tooltip="IP addresses allowed to access this site (one per line)."
        >
          <Textarea
            value={restrict.allowList}
            onChange={(e) => updateSiteField(site.id, "restrict.allowList", e.target.value)}
            placeholder="192.168.1.1"
            rows={3}
          />
        </SectionRow>
        <SectionRow
          label="Deny list"
          tooltip="IP addresses denied access to this site (one per line)."
        >
          <Textarea
            value={restrict.denyList}
            onChange={(e) => updateSiteField(site.id, "restrict.denyList", e.target.value)}
            placeholder="10.0.0.0/8"
            rows={3}
          />
        </SectionRow>
        <SectionRow
          label="Basic Auth"
          tooltip="Enable HTTP Basic Authentication for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`basic-auth-${site.id}`}
              checked={restrict.basicAuth}
              onCheckedChange={(v) => updateSiteField(site.id, "restrict.basicAuth", v)}
            />
            <Label htmlFor={`basic-auth-${site.id}`} className="text-sm">
              Enable Basic Auth
            </Label>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}