import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { Label } from "@/components/ui/label";

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
          label="Access Log"
          tooltip="Enable access logging for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`access-log-enabled-${site.id}`}
              checked={logging.accessLogEnabled}
              onCheckedChange={(v) => updateSiteField(site.id, "logging.accessLogEnabled", v)}
            />
            <Label htmlFor={`access-log-enabled-${site.id}`} className="text-sm">
              Enable access log
            </Label>
          </div>
        </SectionRow>
        
        {logging.accessLogEnabled && (
          <>
            <SectionRow
              label="Access Log Path"
              tooltip="Path where access logs will be stored"
            >
              <Input
                value={logging.accessLogPath}
                onChange={(e) => updateSiteField(site.id, "logging.accessLogPath", e.target.value)}
                placeholder="/var/log/nginx/example.com.access.log"
              />
            </SectionRow>
            
            <SectionRow
              label="Access Log Format"
              tooltip="Log format parameters for access logs"
            >
              <Input
                value={logging.accessLogParameters}
                onChange={(e) => updateSiteField(site.id, "logging.accessLogParameters", e.target.value)}
                placeholder='combined'
              />
            </SectionRow>
            
            <SectionRow
              label="Log Redirects"
              tooltip="Include redirect status codes in access logs"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`redirect-access-log-${site.id}`}
                  checked={logging.redirectAccessLog}
                  onCheckedChange={(v) => updateSiteField(site.id, "logging.redirectAccessLog", v)}
                />
                <Label htmlFor={`redirect-access-log-${site.id}`} className="text-sm">
                  Log redirects
                </Label>
              </div>
            </SectionRow>
          </>
        )}
        
        <SectionRow
          label="Error Log"
          tooltip="Enable error logging for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`error-log-enabled-${site.id}`}
              checked={logging.errorLogEnabled}
              onCheckedChange={(v) => updateSiteField(site.id, "logging.errorLogEnabled", v)}
            />
            <Label htmlFor={`error-log-enabled-${site.id}`} className="text-sm">
              Enable error log
            </Label>
          </div>
        </SectionRow>
        
        {logging.errorLogEnabled && (
          <>
            <SectionRow
              label="Error Log Path"
              tooltip="Path where error logs will be stored"
            >
              <Input
                value={logging.errorLogPath}
                onChange={(e) => updateSiteField(site.id, "logging.errorLogPath", e.target.value)}
                placeholder="/var/log/nginx/example.com.error.log"
              />
            </SectionRow>
            
            <SectionRow
              label="Error Log Level"
              tooltip="Minimum severity level to log"
            >
              <Select
                value={logging.errorLogLevel}
                onValueChange={(v) => updateSiteField(site.id, "logging.errorLogLevel", v)}
                className="w-[200px]"
              >
                <option value="debug">debug</option>
                <option value="info">info</option>
                <option value="notice">notice</option>
                <option value="warn">warn</option>
                <option value="error">error</option>
                <option value="crit">crit</option>
                <option value="alert">alert</option>
                <option value="emerg">emerg</option>
              </Select>
            </SectionRow>
            
            <SectionRow
              label="Log Error Redirects"
              tooltip="Include redirect status codes in error logs"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`redirect-error-log-${site.id}`}
                  checked={logging.redirectErrorLog}
                  onCheckedChange={(v) => updateSiteField(site.id, "logging.redirectErrorLog", v)}
                />
                <Label htmlFor={`redirect-error-log-${site.id}`} className="text-sm">
                  Log redirect errors
                </Label>
              </div>
            </SectionRow>
          </>
        )}
      </div>
    </div>
  );
}