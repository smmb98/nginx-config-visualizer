import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { Label } from "@/components/ui/label";

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
          label="Enable SSL"
          tooltip="Enable SSL/TLS for this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`https-enabled-${site.id}`}
              checked={https.https}
              onCheckedChange={(v) => updateSiteField(site.id, "https.https", v)}
            />
            <Label htmlFor={`https-enabled-${site.id}`} className="text-sm">
              Enable SSL/TLS
            </Label>
          </div>
        </SectionRow>
        
        {https.https && (
          <>
            <SectionRow
              label="HTTP/2"
              tooltip="Enable HTTP/2 protocol support."
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
              label="HTTP/3"
              tooltip="Enable HTTP/3 (QUIC) protocol support."
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`http3-${site.id}`}
                  checked={https.http3}
                  onCheckedChange={(v) => updateSiteField(site.id, "https.http3", v)}
                />
                <Label htmlFor={`http3-${site.id}`} className="text-sm">
                  Enable HTTP/3
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
            
            {https.hsts && (
              <>
                <SectionRow
                  label="HSTS Subdomains"
                  tooltip="Apply HSTS to all subdomains."
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`hsts-subdomains-${site.id}`}
                      checked={https.hstsSubdomains}
                      onCheckedChange={(v) => updateSiteField(site.id, "https.hstsSubdomains", v)}
                    />
                    <Label htmlFor={`hsts-subdomains-${site.id}`} className="text-sm">
                      Include subdomains
                    </Label>
                  </div>
                </SectionRow>
                
                <SectionRow
                  label="HSTS Preload"
                  tooltip="Submit domain for HSTS preload list."
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`hsts-preload-${site.id}`}
                      checked={https.hstsPreload}
                      onCheckedChange={(v) => updateSiteField(site.id, "https.hstsPreload", v)}
                    />
                    <Label htmlFor={`hsts-preload-${site.id}`} className="text-sm">
                      Enable preload
                    </Label>
                  </div>
                </SectionRow>
              </>
            )}
            
            <SectionRow
              label="Certificate Type"
              tooltip="Type of SSL certificate to use."
            >
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`cert-type-${site.id}`}
                    value="letsEncrypt"
                    checked={https.certType === "letsEncrypt"}
                    onChange={(e) => updateSiteField(site.id, "https.certType", e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="text-sm cursor-pointer">Let's Encrypt</span>
                </label>
                <label className="flex items-center gap-2 ml-4">
                  <input
                    type="radio"
                    name={`cert-type-${site.id}`}
                    value="custom"
                    checked={https.certType === "custom"}
                    onChange={(e) => updateSiteField(site.id, "https.certType", e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="text-sm cursor-pointer">Custom</span>
                </label>
              </div>
            </SectionRow>
            
            {https.certType === "letsEncrypt" && (
              <SectionRow
                label="Let's Encrypt Email"
                tooltip="Email address for Let's Encrypt account and notifications."
              >
                <Input
                  value={https.letsEncryptEmail}
                  onChange={(e) => updateSiteField(site.id, "https.letsEncryptEmail", e.target.value)}
                  placeholder="info@example.com"
                />
              </SectionRow>
            )}
            
            {https.certType === "custom" && (
              <>
                <SectionRow
                  label="SSL Certificate"
                  tooltip="Path to SSL certificate file."
                >
                  <Input
                    value={https.sslCertificate}
                    onChange={(e) => updateSiteField(site.id, "https.sslCertificate", e.target.value)}
                    placeholder="/etc/ssl/certs/example.com.crt"
                  />
                </SectionRow>
                
                <SectionRow
                  label="SSL Certificate Key"
                  tooltip="Path to SSL certificate private key file."
                >
                  <Input
                    value={https.sslCertificateKey}
                    onChange={(e) => updateSiteField(site.id, "https.sslCertificateKey", e.target.value)}
                    placeholder="/etc/ssl/private/example.com.key"
                  />
                </SectionRow>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}