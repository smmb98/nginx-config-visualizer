import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface HttpsSectionProps {
  site: Site;
}

export function HttpsSection({ site }: HttpsSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const https = site.https;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">HTTPS Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="SSL Certificate"
          tooltip="SSL/TLS certificate configuration for this site."
        >
          <RadioGroup
            value={https.certType}
            onValueChange={(v) => updateSiteField(site.id, "https.certType", v)}
            className="flex flex-col gap-2"
          >
            {[
              { value: "none", label: "No SSL" },
              { value: "self-signed", label: "Self-signed certificate" },
              { value: "letsencrypt", label: "Let's Encrypt" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`cert-type-${opt.value}-${site.id}`} />
                <Label htmlFor={`cert-type-${opt.value}-${site.id}`} className="text-sm cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </SectionRow>
        <SectionRow
          label="HTTP/2"
          tooltip="Enable HTTP/2 protocol support for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`http2-${site.id}`}
              checked={https.http2}
              onCheckedChange={(v) => updateSiteField(site.id, "https.http2", v)}
            />
            <Label htmlFor={`http2-${site.id}`} className="text-sm">
              Enable HTTP/2
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Force HTTPS"
          tooltip="Redirect all HTTP traffic to HTTPS."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`force-https-${site.id}`}
              checked={https.forceHttps}
              onCheckedChange={(v) => updateSiteField(site.id, "https.forceHttps", v)}
            />
            <Label htmlFor={`force-https-${site.id}`} className="text-sm">
              Force HTTPS redirect
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="WWW Redirect"
          tooltip="Redirect www subdomain to non-www domain."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`www-redirect-${site.id}`}
              checked={https.wwwRedirect}
              onCheckedChange={(v) => updateSiteField(site.id, "https.wwwRedirect", v)}
            />
            <Label htmlFor={`www-redirect-${site.id}`} className="text-sm">
              Redirect www to non-www
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="HSTS"
          tooltip="Enable HTTP Strict Transport Security header."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`hsts-${site.id}`}
              checked={https.hsts}
              onCheckedChange={(v) => updateSiteField(site.id, "https.hsts", v)}
            />
            <Label htmlFor={`hsts-${site.id}`} className="text-sm">
              Enable HSTS
            </Label>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}