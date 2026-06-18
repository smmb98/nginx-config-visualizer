import { FieldContent, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";

export function LoggingSection() {
  const updateField = useGlobalConfigStore((s) => s.updateField);
  const errorLogEnabled = useGlobalConfigStore(
    (s) => s.errorLogEnabled,
  ) as boolean;
  const errorLogPath = useGlobalConfigStore(
    (s) => s.errorLogPath,
  ) as string;
  const errorLogLevel = useGlobalConfigStore(
    (s) => s.errorLogLevel,
  ) as string;
  const logNotFound = useGlobalConfigStore((s) => s.logNotFound) as boolean;
  const cloudflare = useGlobalConfigStore((s) => s.cloudflare) as boolean;
  const cfRay = useGlobalConfigStore((s) => s.cfRay) as boolean;
  const cfConnectingIp = useGlobalConfigStore(
    (s) => s.cfConnectingIp,
  ) as boolean;
  const xForwardedFor = useGlobalConfigStore(
    (s) => s.xForwardedFor,
  ) as boolean;
  const xForwardedProto = useGlobalConfigStore(
    (s) => s.xForwardedProto,
  ) as boolean;
  const trueClientIp = useGlobalConfigStore(
    (s) => s.trueClientIp,
  ) as boolean;
  const cfIpCountry = useGlobalConfigStore((s) => s.cfIpCountry) as boolean;
  const cfVisitor = useGlobalConfigStore((s) => s.cfVisitor) as boolean;
  const cdnLoop = useGlobalConfigStore((s) => s.cdnLoop) as boolean;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Logging Configuration</h3>
      <div className="space-y-4">
        <SectionRow label="error_log" align="top">
          <FieldGroup>
            <div className="flex items-center gap-2">
              <Checkbox
                id="error-log-enabled"
                checked={errorLogEnabled}
                onCheckedChange={(v) =>
                  updateField("errorLogEnabled", v)
                }
              />
              <Label htmlFor="error-log-enabled" className="text-sm">
                Enable
              </Label>
            </div>
            <FieldContent className="pt-2">
              <Input
                value={errorLogPath}
                onChange={(e) =>
                  updateField("errorLogPath", e.target.value)
                }
                placeholder="/var/log/nginx/error.log"
              />
            </FieldContent>
          </FieldGroup>
        </SectionRow>
        <SectionRow label="error_log level">
          <RadioGroup
            value={errorLogLevel}
            onValueChange={(v) =>
              updateField("errorLogLevel", v)
            }
            className="flex gap-4"
          >
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
            <Checkbox
              id="log-not-found"
              checked={logNotFound}
              onCheckedChange={(v) =>
                updateField("logNotFound", v)
              }
            />
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
            <Checkbox
              id="cloudflare-enabled"
              checked={cloudflare}
              onCheckedChange={(v) =>
                updateField("cloudflare", v)
              }
            />
            <Label htmlFor="cloudflare-enabled" className="text-sm">
              Enable Cloudflare logging
            </Label>
          </div>
          <div className="mt-2 ps-4 space-y-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-cfray"
                checked={cfRay}
                onCheckedChange={(v) =>
                  updateField("cfRay", v)
                }
              />
              <Label htmlFor="cloudflare-cfray" className="text-sm">
                cfRay
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-cfconnectingip"
                checked={cfConnectingIp}
                onCheckedChange={(v) =>
                  updateField("cfConnectingIp", v)
                }
              />
              <Label htmlFor="cloudflare-cfconnectingip" className="text-sm">
                cfConnectingIp
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-xforwardedfor"
                checked={xForwardedFor}
                onCheckedChange={(v) =>
                  updateField("xForwardedFor", v)
                }
              />
              <Label htmlFor="cloudflare-xforwardedfor" className="text-sm">
                xForwardedFor
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-xforwardedproto"
                checked={xForwardedProto}
                onCheckedChange={(v) =>
                  updateField("xForwardedProto", v)
                }
              />
              <Label htmlFor="cloudflare-xforwardedproto" className="text-sm">
                xForwardedProto
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-trueclientip"
                checked={trueClientIp}
                onCheckedChange={(v) =>
                  updateField("trueClientIp", v)
                }
              />
              <Label htmlFor="cloudflare-trueclientip" className="text-sm">
                trueClientIp
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-cficountry"
                checked={cfIpCountry}
                onCheckedChange={(v) =>
                  updateField("cfIpCountry", v)
                }
              />
              <Label htmlFor="cloudflare-cficountry" className="text-sm">
                cfIpCountry
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-cfvisitor"
                checked={cfVisitor}
                onCheckedChange={(v) =>
                  updateField("cfVisitor", v)
                }
              />
              <Label htmlFor="cloudflare-cfvisitor" className="text-sm">
                cfVisitor
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cloudflare-cdnloop"
                checked={cdnLoop}
                onCheckedChange={(v) =>
                  updateField("cdnLoop", v)
                }
              />
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
