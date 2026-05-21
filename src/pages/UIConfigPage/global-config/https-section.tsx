import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGlobalConfigStore } from "../store";

export function HttpsSection() {
  const updateField = useGlobalConfigStore((s) => s.updateField);
  const sslProfile = useGlobalConfigStore((s) => s.sslProfile);
  const reuseport = useGlobalConfigStore((s) => s.reuseport);
  const letsEncryptRoot = useGlobalConfigStore((s) => s.letsEncryptRoot);
  const letsEncryptCertRoot = useGlobalConfigStore(
    (s) => s.letsEncryptCertRoot,
  );
  const ocspCloudflare = useGlobalConfigStore((s) => s.ocspCloudflare);
  const ocspCloudflareType = useGlobalConfigStore((s) => s.ocspCloudflareType);
  const ocspGoogle = useGlobalConfigStore((s) => s.ocspGoogle);
  const ocspGoogleType = useGlobalConfigStore((s) => s.ocspGoogleType);
  const ocspOpenDns = useGlobalConfigStore((s) => s.ocspOpenDns);
  const ocspOpenDnsType = useGlobalConfigStore((s) => s.ocspOpenDnsType);
  const ocspQuad9 = useGlobalConfigStore((s) => s.ocspQuad9);
  const ocspQuad9Type = useGlobalConfigStore((s) => s.ocspQuad9Type);
  const ocspVerisign = useGlobalConfigStore((s) => s.ocspVerisign);
  const ocspVerisignType = useGlobalConfigStore((s) => s.ocspVerisignType);

  const SSL_PROFILES = ["modern", "intermediate", "old"] as const;
  const MOZILLA_PROFILE_LABELS = {
    modern: "Mozilla Modern (TLS 1.3)",
    intermediate: "Mozilla Intermediate (TLS 1.2+)",
    old: "Mozilla Old (TLS 1.0+)",
  };

  const IP_TYPES = ["ipv4", "ipv6", "both"] as const;
  const IP_TYPE_LABELS = {
    ipv4: "IPv4 only",
    ipv6: "IPv6 only",
    both: "IPv4 and IPv6",
  };

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">HTTPS Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Reuseport"
          tooltip="Enables reuseport to generate a separate listening socket per NGINX worker process, improving connection handling under load."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id="port-reuse"
              checked={reuseport}
              onCheckedChange={(v) => updateField("reuseport", v)}
            />
            <Label htmlFor="port-reuse" className="text-sm">
              Enable reuseport to generate a listening socket per worker
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="SSL Profile"
          tooltip="Mozilla-recommended SSL configuration profiles."
        >
          <RadioGroup
            value={sslProfile}
            onValueChange={(v) => updateField("sslProfile", v)}
            className="flex flex-col gap-2"
          >
            {SSL_PROFILES.map((profile) => (
              <div key={profile} className="flex items-center gap-2">
                <RadioGroupItem id={`ssl-profile-${profile}`} value={profile} />
                <Label
                  htmlFor={`ssl-profile-${profile}`}
                  className="text-sm cursor-pointer"
                >
                  {MOZILLA_PROFILE_LABELS[profile]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </SectionRow>
        <SectionRow
          label="Let's Encrypt webroot"
          tooltip="Webroot path used for Let's Encrypt HTTP-01 challenges."
        >
          <Input
            value={letsEncryptRoot}
            onChange={(e) => updateField("letsEncryptRoot", e.target.value)}
            placeholder="/var/www/_letsencrypt/"
          />
        </SectionRow>
        <SectionRow
          label="Let's Encrypt certificate directory"
          tooltip="Directory where Let's Encrypt live certificates are stored."
        >
          <Input
            value={letsEncryptCertRoot}
            onChange={(e) => updateField("letsEncryptCertRoot", e.target.value)}
            placeholder="/etc/letsencrypt/live/"
          />
        </SectionRow>
        <SectionRow
          label="OCSP DNS Resolvers"
          tooltip="Configure OCSP stapling DNS resolvers for certificate status checking."
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="ocsp-cloudflare"
                checked={ocspCloudflare}
                onCheckedChange={(v) => {
                  updateField("ocspCloudflare", v);
                  updateField("ocspCloudflareType", undefined);
                }}
              />
              <Label htmlFor="ocsp-cloudflare" className="text-sm font-medium">
                Cloudflare Resolver
              </Label>
            </div>
            {ocspCloudflare && (
              <div className="flex items-center gap-2 ps-4">
                <RadioGroup
                  value={ocspCloudflareType}
                  onValueChange={(v) => updateField("ocspCloudflareType", v)}
                  className="flex flex-row gap-4"
                >
                  {IP_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-1">
                      <RadioGroupItem
                        id={`ocsp-cloudflare-${type}`}
                        value={type}
                      />
                      <Label
                        htmlFor={`ocsp-cloudflare-${type}`}
                        className="text-sm"
                      >
                        {IP_TYPE_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="ocsp-google"
                checked={ocspGoogle}
                onCheckedChange={(v) => {
                  updateField("ocspGoogle", v);
                  updateField("ocspGoogleType", undefined);
                }}
              />
              <Label htmlFor="ocsp-google" className="text-sm font-medium">
                Google Public DNS
              </Label>
            </div>
            {ocspGoogle && (
              <div className="flex items-center gap-2 ps-4">
                <RadioGroup
                  value={ocspGoogleType}
                  onValueChange={(v) => updateField("ocspGoogleType", v)}
                  className="flex flex-row gap-4"
                >
                  {IP_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-1">
                      <RadioGroupItem id={`ocsp-google-${type}`} value={type} />
                      <Label
                        htmlFor={`ocsp-google-${type}`}
                        className="text-sm"
                      >
                        {IP_TYPE_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="ocsp-opendns"
                checked={ocspOpenDns}
                onCheckedChange={(v) => {
                  updateField("ocspOpenDns", v);
                  updateField("ocspOpenDnsType", undefined);
                }}
              />
              <Label htmlFor="ocsp-opendns" className="text-sm font-medium">
                OpenDNS
              </Label>
            </div>
            {ocspOpenDns && (
              <div className="flex items-center gap-2 ps-4">
                <RadioGroup
                  value={ocspOpenDnsType}
                  onValueChange={(v) => updateField("ocspOpenDnsType", v)}
                  className="flex flex-row gap-4"
                >
                  {IP_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-1">
                      <RadioGroupItem
                        id={`ocsp-opendns-${type}`}
                        value={type}
                      />
                      <Label
                        htmlFor={`ocsp-opendns-${type}`}
                        className="text-sm"
                      >
                        {IP_TYPE_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="ocsp-quad9"
                checked={ocspQuad9}
                onCheckedChange={(v) => {
                  updateField("ocspQuad9", v);
                  updateField("ocspQuad9Type", undefined);
                }}
              />
              <Label htmlFor="ocsp-quad9" className="text-sm font-medium">
                Quad9
              </Label>
            </div>
            {ocspQuad9 && (
              <div className="flex items-center gap-2 ps-4">
                <RadioGroup
                  value={ocspQuad9Type}
                  onValueChange={(v) => updateField("ocspQuad9Type", v)}
                  className="flex flex-row gap-4"
                >
                  {IP_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-1">
                      <RadioGroupItem id={`ocsp-quad9-${type}`} value={type} />
                      <Label htmlFor={`ocsp-quad9-${type}`} className="text-sm">
                        {IP_TYPE_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="ocsp-verisign"
                checked={ocspVerisign}
                onCheckedChange={(v) => {
                  updateField("ocspVerisign", v);
                  updateField("ocspVerisignType", undefined);
                }}
              />
              <Label htmlFor="ocsp-verisign" className="text-sm font-medium">
                Verisign
              </Label>
            </div>
            {ocspVerisign && (
              <div className="flex items-center gap-2 ps-4">
                <RadioGroup
                  value={ocspVerisignType}
                  onValueChange={(v) => updateField("ocspVerisignType", v)}
                  className="flex flex-row gap-4"
                >
                  {IP_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-1">
                      <RadioGroupItem
                        id={`ocsp-verisign-${type}`}
                        value={type}
                      />
                      <Label
                        htmlFor={`ocsp-verisign-${type}`}
                        className="text-sm"
                      >
                        {IP_TYPE_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        </SectionRow>
      </div>
    </div>
  );
}
