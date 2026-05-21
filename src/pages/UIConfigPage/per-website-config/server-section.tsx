import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface ServerSectionProps {
  site: Site;
}

export function ServerSection({ site }: ServerSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Server Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Domain"
          tooltip="The primary domain name for this site configuration."
        >
          <Input
            value={site.domain}
            onChange={(e) => updateSiteField(site.id, "domain", e.target.value)}
            placeholder="example.com"
          />
        </SectionRow>
        <SectionRow
          label="Root path"
          tooltip="Document root directory for this site."
        >
          <Input
            value={site.root}
            onChange={(e) => updateSiteField(site.id, "root", e.target.value)}
            placeholder="/var/www/example.com/html"
          />
        </SectionRow>
        <SectionRow
          label="Index files"
          tooltip="Space-separated list of index file names to serve for directory requests."
        >
          <Input
            value={site.index}
            onChange={(e) => updateSiteField(site.id, "index", e.target.value)}
            placeholder="index.html index.php"
          />
        </SectionRow>
      </div>
    </div>
  );
}