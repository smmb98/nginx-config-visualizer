import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { Label } from "@/components/ui/label";

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
          label="Root"
          tooltip="Enable serving static files from root directory"
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`root-${site.id}`}
              checked={routing.root}
              onCheckedChange={(v) => updateSiteField(site.id, "routing.root", v)}
            />
            <Label htmlFor={`root-${site.id}`} className="text-sm">
              Enable root
            </Label>
          </div>
        </SectionRow>
        
        {routing.root && (
          <>
            <SectionRow
              label="Index File"
              tooltip="Default file to serve when directory is requested"
            >
              <Select
                value={routing.index}
                onValueChange={(v) => updateSiteField(site.id, "routing.index", v)}
                className="w-[200px]"
              >
                <option value="index.html">index.html</option>
                <option value="index.php">index.php</option>
                <option value="index.htm">index.htm</option>
                <option value="index.asp">index.asp</option>
                <option value="index.aspx">index.aspx</option>
              </Select>
            </SectionRow>
            
            <SectionRow
              label="Fallback to index.html"
              tooltip="Serve index.html for all non-file requests (SPA fallback)"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`fallback-html-${site.id}`}
                  checked={routing.fallbackHtml}
                  onCheckedChange={(v) => updateSiteField(site.id, "routing.fallbackHtml", v)}
                />
                <Label htmlFor={`fallback-html-${site.id}`} className="text-sm">
                  Enable HTML fallback
                </Label>
              </div>
            </SectionRow>
            
            <SectionRow
              label="Fallback to index.php"
              tooltip="Serve index.php for all non-file requests"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`fallback-php-${site.id}`}
                  checked={routing.fallbackPhp}
                  onCheckedChange={(v) => updateSiteField(site.id, "routing.fallbackPhp", v)}
                />
                <Label htmlFor={`fallback-php-${site.id}`} className="text-sm">
                  Enable PHP fallback
                </Label>
              </div>
            </SectionRow>
            
            {routing.fallbackHtml && routing.fallbackPhp && (
              <SectionRow
                label="Fallback PHP Path"
                tooltip="Path for PHP fallback handler (when both fallbacks enabled)"
              >
                <Input
                  value={routing.fallbackPhpPath}
                  onChange={(e) => updateSiteField(site.id, "routing.fallbackPhpPath", e.target.value)}
                  placeholder="/api/"
                />
              </SectionRow>
            )}
            
            <SectionRow
              label="Legacy PHP Routing"
              tooltip="Use legacy PHP routing with pathinfo"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`legacy-php-${site.id}`}
                  checked={routing.legacyPhpRouting}
                  onCheckedChange={(v) => updateSiteField(site.id, "routing.legacyPhpRouting", v)}
                />
                <Label htmlFor={`legacy-php-${site.id}`} className="text-sm">
                  Enable legacy PHP routing
                </Label>
              </div>
            </SectionRow>
          </>
        )}
      </div>
    </div>
  );
}