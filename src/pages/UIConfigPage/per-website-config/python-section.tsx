import { Checkbox } from "@/components/ui/checkbox";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { Label } from "@/components/ui/label";

interface PythonSectionProps {
  site: Site;
}

export function PythonSection({ site }: PythonSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const python = site.python;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Python Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Python"
          tooltip="Enable Python/Django configuration for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`python-enabled-${site.id}`}
              checked={python.python}
              onCheckedChange={(v) => updateSiteField(site.id, "python.python", v)}
            />
            <Label htmlFor={`python-enabled-${site.id}`} className="text-sm">
              Enable Python
            </Label>
          </div>
        </SectionRow>
        
        {python.python && (
          <SectionRow
            label="Django"
            tooltip="Enable Django preset for Python configuration."
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`django-${site.id}`}
                checked={python.djangoRules}
                onCheckedChange={(v) => updateSiteField(site.id, "python.djangoRules", v)}
              />
              <Label htmlFor={`django-${site.id}`} className="text-sm">
                Django preset
              </Label>
            </div>
          </SectionRow>
        )}
      </div>
    </div>
  );
}