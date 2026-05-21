import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface ReverseProxySectionProps {
  site: Site;
}

export function ReverseProxySection({ site }: ReverseProxySectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const reverseProxy = site.reverseProxy;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Reverse Proxy Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Proxy pass URL"
          tooltip="URL to proxy requests to (e.g., http://localhost:3000)."
        >
          <Input
            value={reverseProxy.proxyPass}
            onChange={(e) => updateSiteField(site.id, "reverseProxy.proxyPass", e.target.value)}
            placeholder="http://localhost:3000"
          />
        </SectionRow>
        <SectionRow
          label="WebSockets"
          tooltip="Enable WebSocket support for proxied connections."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`websockets-${site.id}`}
              checked={reverseProxy.websockets}
              onCheckedChange={(v) => updateSiteField(site.id, "reverseProxy.websockets", v)}
            />
            <Label htmlFor={`websockets-${site.id}`} className="text-sm">
              Enable WebSocket proxying
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="X-Forwarded-Proto"
          tooltip="Pass the original protocol header to the upstream server."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`xfd-proto-${site.id}`}
              checked={reverseProxy.xForwardedProto}
              onCheckedChange={(v) => updateSiteField(site.id, "reverseProxy.xForwardedProto", v)}
            />
            <Label htmlFor={`xfd-proto-${site.id}`} className="text-sm">
              Pass X-Forwarded-Proto
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="X-Forwarded-Host"
          tooltip="Pass the original host header to the upstream server."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`xfd-host-${site.id}`}
              checked={reverseProxy.xForwardedHost}
              onCheckedChange={(v) => updateSiteField(site.id, "reverseProxy.xForwardedHost", v)}
            />
            <Label htmlFor={`xfd-host-${site.id}`} className="text-sm">
              Pass X-Forwarded-Host
            </Label>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}