import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface LoggingSectionProps {
  site: Site;
}

export function LoggingSection({ site }: LoggingSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const logging = site.logging;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Logging Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Access log path"
          tooltip="Path where access logs will be stored for this site."
        >
          <Input
            value={logging.accessLogPath}
            onChange={(e) => updateSiteField(site.id, "logging.accessLogPath", e.target.value)}
            placeholder="/var/log/nginx/example.com.access.log"
          />
        </SectionRow>
        <SectionRow
          label="Error log path"
          tooltip="Path where error logs will be stored for this site."
        >
          <Input
            value={logging.errorLogPath}
            onChange={(e) => updateSiteField(site.id, "logging.errorLogPath", e.target.value)}
            placeholder="/var/log/nginx/example.com.error.log"
          />
        </SectionRow>
      </div>
    </div>
  );
}