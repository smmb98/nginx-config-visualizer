import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";

export function SecuritySection() {
  const updateField = useGlobalConfigStore((s) => s.updateField);
  const referrerPolicy = useGlobalConfigStore(
    (s) => s.referrerPolicy,
  ) as string;
  const contentSecurityPolicy = useGlobalConfigStore(
    (s) => s.contentSecurityPolicy,
  ) as string;
  const permissionsPolicy = useGlobalConfigStore(
    (s) => s.permissionsPolicy,
  ) as string;
  const serverTokens = useGlobalConfigStore((s) => s.serverTokens) as boolean;
  const limitReq = useGlobalConfigStore((s) => s.limitReq) as boolean;
  const securityTxt = useGlobalConfigStore((s) => s.securityTxt) as boolean;
  const securityTxtPath = useGlobalConfigStore(
    (s) => s.securityTxtPath,
  ) as string;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Security Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Referrer-Policy"
          tooltip="Controls how much referrer information is included with requests. no-referrer-when-downgrade is the browser default."
        >
          <Select
            value={referrerPolicy}
            onValueChange={(v) =>
              updateField("referrerPolicy", v)
            }
          >
            <SelectTrigger className="w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url",
              ].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SectionRow>
        <SectionRow
          label="Content-Security-Policy"
          tooltip="HTTP response header that helps mitigate cross-site scripting (XSS) and data injection attacks."
        >
          <Input
            value={contentSecurityPolicy}
            onChange={(e) =>
              updateField("contentSecurityPolicy", e.target.value)
            }
            defaultValue="default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';"
          />
        </SectionRow>
        <SectionRow
          label="Permissions-Policy"
          tooltip="Controls which browser features and APIs can be used in the browser (formerly Feature-Policy)."
        >
          <Input
            value={permissionsPolicy}
            onChange={(e) =>
              updateField("permissionsPolicy", e.target.value)
            }
            placeholder="interest-cohort=()"
          />
        </SectionRow>
        <SectionRow
          label="server_tokens"
          tooltip="Controls whether NGINX includes its version number in the Server response header and error pages. Disable for security hardening."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id="server-tokens"
              checked={serverTokens}
              onCheckedChange={(v) =>
                updateField("serverTokens", v)
              }
            />
            <Label htmlFor="server-tokens" className="text-sm">
              Enable server_tokens
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="limit_req"
          tooltip="Enables rate-limiting of requests per second for all server blocks. Configure zones via a Rate Limits card."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id="limit-req"
              checked={limitReq}
              onCheckedChange={(v) =>
                updateField("limitReq", v)
              }
            />
            <Label htmlFor="limit-req" className="text-sm">
              Enable limit_req
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="security.txt"
          tooltip="Enables a /.well-known/security.txt route so security researchers can contact you about vulnerabilities."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id="security-txt"
              checked={securityTxt}
              onCheckedChange={(v) =>
                updateField("securityTxt", v)
              }
            />
            <Label htmlFor="security-txt" className="text-sm">
              Enable security.txt
            </Label>
          </div>
          {/* Conditional security.txt path input - appears when security.txt is enabled */}
          <div className="mt-2 ps-4">
            <SectionRow
              label="security.txt path"
              tooltip="Path to the security.txt file relative to the web root"
            >
              <Input
                value={securityTxtPath}
                onChange={(e) =>
                  updateField("securityTxtPath", e.target.value)
                }
                placeholder="/path/to/security.txt"
              />
            </SectionRow>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}
