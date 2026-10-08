import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { Label } from "@/components/ui/label";

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
          label="Reverse Proxy"
          tooltip="Enable reverse proxy mode for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`reverse-proxy-enabled-${site.id}`}
              checked={reverseProxy.reverseProxy}
              onCheckedChange={(v) => updateSiteField(site.id, "reverseProxy.reverseProxy", v)}
            />
            <Label htmlFor={`reverse-proxy-enabled-${site.id}`} className="text-sm">
              Enable Reverse Proxy
            </Label>
          </div>
        </SectionRow>
        
        {reverseProxy.reverseProxy && (
          <>
            <SectionRow
              label="Proxy Path"
              tooltip="Local path to proxy (e.g., /api)"
            >
              <Input
                value={reverseProxy.path}
                onChange={(e) => updateSiteField(site.id, "reverseProxy.path", e.target.value)}
                placeholder="/"
              />
            </SectionRow>
            
            <SectionRow
              label="Proxy Pass URL"
              tooltip="URL to proxy requests to (e.g., http://localhost:3000)"
            >
              <Input
                value={reverseProxy.proxyPass}
                onChange={(e) => updateSiteField(site.id, "reverseProxy.proxyPass", e.target.value)}
                placeholder="http://127.0.0.1:3000"
              />
            </SectionRow>
            
            <SectionRow
              label="Proxy Host Header"
              tooltip="Host header to pass to the proxied server"
            >
              <Input
                value={reverseProxy.proxyHostHeader}
                onChange={(e) => updateSiteField(site.id, "reverseProxy.proxyHostHeader", e.target.value)}
                placeholder="\$host"
              />
            </SectionRow>
          </>
        )}
      </div>
    </div>
  );
}