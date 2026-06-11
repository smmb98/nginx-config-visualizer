import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { SectionRow } from "@/components/SectionRow";

interface RestrictSectionProps {
  site: Site;
}

export function RestrictSection({ site }: RestrictSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const restrict = site.restrict;

  // Check if any method is disabled (checked = true means disabled)
  const hasAtLeastOneDisabled =
    restrict.getMethod ||
    restrict.postMethod ||
    restrict.putMethod ||
    restrict.patchMethod ||
    restrict.deleteMethod ||
    restrict.headMethod ||
    restrict.connectMethod ||
    restrict.optionsMethod ||
    restrict.traceMethod;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Restrict Configuration</h3>
      <div className="space-y-6">
        {/* Two-column layout for HTTP methods */}
        <div className="grid grid-cols-2 gap-4">
          {/* First column - 5 methods */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`get-method-${site.id}`}
                checked={restrict.getMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.getMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`get-method-${site.id}`}>
                GET
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`post-method-${site.id}`}
                checked={restrict.postMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.postMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`post-method-${site.id}`}>
                POST
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`put-method-${site.id}`}
                checked={restrict.putMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.putMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`put-method-${site.id}`}>
                PUT
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`patch-method-${site.id}`}
                checked={restrict.patchMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.patchMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`patch-method-${site.id}`}>
                PATCH
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`delete-method-${site.id}`}
                checked={restrict.deleteMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.deleteMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`delete-method-${site.id}`}>
                DELETE
              </label>
            </div>
          </div>
          
          {/* Second column - 4 methods */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`head-method-${site.id}`}
                checked={restrict.headMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.headMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`head-method-${site.id}`}>
                HEAD
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`connect-method-${site.id}`}
                checked={restrict.connectMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.connectMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`connect-method-${site.id}`}>
                CONNECT
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`options-method-${site.id}`}
                checked={restrict.optionsMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.optionsMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`options-method-${site.id}`}>
                OPTIONS
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`trace-method-${site.id}`}
                checked={restrict.traceMethod}
                onCheckedChange={(v) => updateSiteField(site.id, "restrict.traceMethod", v)}
              />
              <label className="text-sm cursor-pointer" htmlFor={`trace-method-${site.id}`}>
                TRACE
              </label>
            </div>
          </div>
        </div>
        
        {/* Response code - only show when any method is disabled */}
        {hasAtLeastOneDisabled && (
          <SectionRow
            label="Response Code"
            tooltip="HTTP status code to return for blocked methods"
          >
            <Input
              type="number"
              value={restrict.responseCode}
              onChange={(e) => updateSiteField(site.id, "restrict.responseCode", Number(e.target.value) || 405)}
              placeholder="405"
              className="w-[100px]"
            />
          </SectionRow>
        )}
      </div>
    </div>
  );
}