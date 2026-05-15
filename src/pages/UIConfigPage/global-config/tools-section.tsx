import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionRow } from "@/components/SectionRow";

export function ToolsSection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Tools Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Modularized structure"
          tooltip="Generate separate per-site config files in sites-available/ and symlink them into sites-enabled."
        >
          <div className="flex items-center gap-2">
            <Checkbox id="modularized-structure" defaultChecked />
            <Label htmlFor="modularized-structure" className="text-sm">
              Enable modularized config files
            </Label>
          </div>
        </SectionRow>
        <SectionRow label="Symlink vhost">
          <div className="flex items-center gap-2">
            <Checkbox id="symlink-vhost" defaultChecked />
            <Label htmlFor="symlink-vhost" className="text-sm">
              Enable symlinks from sites-available/ to sites-enabled/
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Share configuration"
          tooltip="A unique URL that encodes the current configuration — share it to let others reproduce your setup."
        >
          <div className="flex items-center gap-2">
            <Input readOnly className="w-full" />
          </div>
        </SectionRow>
        <SectionRow label="Reset configuration">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="destructive" size="sm">
              Reset global config
            </Button>
            <Button variant="destructive" size="sm">
              Reset all domains
            </Button>
            <Button variant="destructive" size="sm">
              Remove all domains
            </Button>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}
