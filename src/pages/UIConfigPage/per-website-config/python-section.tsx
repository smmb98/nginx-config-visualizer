import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

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
          label="Django"
          tooltip="Enable Django configuration for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`django-${site.id}`}
              checked={python.django}
              onCheckedChange={(v) => updateSiteField(site.id, "python.django", v)}
            />
            <Label htmlFor={`django-${site.id}`} className="text-sm">
              Enable Django
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Gunicorn socket"
          tooltip="Unix socket path for Gunicorn WSGI server."
        >
          <Input
            value={python.gunicornSocket}
            onChange={(e) => updateSiteField(site.id, "python.gunicornSocket", e.target.value)}
            placeholder="unix:/run/gunicorn.sock"
          />
        </SectionRow>
      </div>
    </div>
  );
}