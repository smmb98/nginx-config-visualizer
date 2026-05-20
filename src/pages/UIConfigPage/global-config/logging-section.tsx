import { FieldContent, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionRow } from "@/components/SectionRow";

export function LoggingSection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Logging Configuration</h3>
      <div className="space-y-4">
        <SectionRow label="error_log" align="top">
          <FieldGroup>
            <div className="flex items-center gap-2">
              <Checkbox id="error-log-enabled" />
              <Label htmlFor="error-log-enabled" className="text-sm">
                Enable
              </Label>
            </div>
            <FieldContent className="pt-2">
              <Input placeholder="/var/log/nginx/error.log" />
            </FieldContent>
          </FieldGroup>
        </SectionRow>
        <SectionRow label="error_log level">
          <RadioGroup defaultValue="error" className="flex gap-4">
            {["debug", "info", "notice", "warn", "error"].map((lvl) => (
              <div key={lvl} className="flex items-center gap-2">
                <RadioGroupItem value={lvl} id={`err-lvl-${lvl}`} />
                <Label htmlFor={`err-lvl-${lvl}`} className="text-sm">
                  {lvl}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </SectionRow>
        <SectionRow
          label="log_not_found"
          tooltip="Enables logging of requests for static files that were not found, directly into error_log."
        >
          <div className="flex items-center gap-2">
            <Checkbox id="log-not-found" />
            <Label htmlFor="log-not-found" className="text-sm">
              Enable file not found error logging in error_log
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Cloudflare"
          tooltip="Enable Cloudflare-specific logging headers"
        >
          <div className="flex items-center gap-2">
            <Checkbox id="cloudflare-enabled" />
            <Label htmlFor="cloudflare-enabled" className="text-sm">
              Enable Cloudflare logging
            </Label>
          </div>
          <div className="mt-2 ps-4 space-y-1">
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-cfray" defaultChecked />
              <Label htmlFor="cloudflare-cfray" className="text-sm">
                cfRay
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-cfconnectingip" defaultChecked />
              <Label htmlFor="cloudflare-cfconnectingip" className="text-sm">
                cfConnectingIp
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-xforwardedfor" />
              <Label htmlFor="cloudflare-xforwardedfor" className="text-sm">
                xForwardedFor
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-xforwardedproto" />
              <Label htmlFor="cloudflare-xforwardedproto" className="text-sm">
                xForwardedProto
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-trueclientip" />
              <Label htmlFor="cloudflare-trueclientip" className="text-sm">
                trueClientIp
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-cficountry" />
              <Label htmlFor="cloudflare-cficountry" className="text-sm">
                cfIpCountry
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-cfvisitor" />
              <Label htmlFor="cloudflare-cfvisitor" className="text-sm">
                cfVisitor
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cloudflare-cdnloop" />
              <Label htmlFor="cloudflare-cdnloop" className="text-sm">
                cdnLoop
              </Label>
            </div>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}
