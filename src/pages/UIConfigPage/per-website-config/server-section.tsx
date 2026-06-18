import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface ServerSectionProps {
  site: Site;
}

export function ServerSection({ site }: ServerSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);

  // Auto-generate path if domain changes and path is default or empty
  // This mimics the Vue.js watcher logic
  // Note: In a real implementation, we might want to use useEffect or similar
  // For now, we'll handle this in the onChange of domain

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Server Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Domain"
          tooltip="The primary domain name for this site configuration."
        >
          <Input
            value={site.server.domain}
            onChange={(e) => {
              const domain = e.target.value;
              updateSiteField(site.id, "server.domain", domain);
              // Auto-set wwwSubdomain if domain contains www
              updateSiteField(site.id, "server.wwwSubdomain", domain.startsWith("www."));
              // Auto-generate path if it's the default or empty
              if (!site.server.path || site.server.path === `/var/www/${site.server.domain.replace(/^www\./, "")}`) {
                const cleanDomain = domain.replace(/^www\./, "");
                updateSiteField(site.id, "server.path", `/var/www/${cleanDomain}`);
              }
            }}
            placeholder="example.com"
          />
        </SectionRow>
        <SectionRow
          label="Root path"
          tooltip="Document root directory for this site."
        >
          <Input
            value={site.server.path}
            onChange={(e) => updateSiteField(site.id, "server.path", e.target.value)}
            placeholder="/var/www/example.com"
          />
        </SectionRow>
        <SectionRow
          label="Document root"
          tooltip="Subdirectory within the root path to serve"
        >
          <Input
            value={site.server.documentRoot}
            onChange={(e) => updateSiteField(site.id, "server.documentRoot", e.target.value)}
            placeholder="/public"
          />
        </SectionRow>
        <SectionRow
          label="WWW subdomain"
          tooltip="Redirect non-WWW to WWW variant"
        >
          <Checkbox
            checked={site.server.wwwSubdomain}
            onChange={(checked) => updateSiteField(site.id, "server.wwwSubdomain", checked)}
          />
        </SectionRow>
        <SectionRow
          label="CDN subdomain"
          tooltip="Enable CDN subdomain (requires WWW subdomain)"
        >
          <Checkbox
            checked={site.server.cdnSubdomain}
            onChange={(checked) => updateSiteField(site.id, "server.cdnSubdomain", checked)}
            disabled={!site.server.wwwSubdomain}
          />
        </SectionRow>
        <SectionRow
          label="Redirect subdomains"
          tooltip="Redirect all subdomains to the main domain"
        >
          <Checkbox
            checked={site.server.redirectSubdomains}
            onChange={(checked) => updateSiteField(site.id, "server.redirectSubdomains", checked)}
          />
        </SectionRow>
        <SectionRow
          label="IPv4 listen address"
          tooltip="IPv4 address to listen on (use * for all interfaces)"
        >
          <Input
            value={site.server.listenIpv4}
            onChange={(e) => updateSiteField(site.id, "server.listenIpv4", e.target.value)}
            placeholder="*"
          />
        </SectionRow>
        <SectionRow
          label="IPv6 listen address"
          tooltip="IPv6 address to listen on (use :: for all interfaces)"
        >
          <Input
            value={site.server.listenIpv6}
            onChange={(e) => updateSiteField(site.id, "server.listenIpv6", e.target.value)}
            placeholder="::"
          />
        </SectionRow>
      </div>
    </div>
  );
}