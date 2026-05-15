import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";

export function HttpsSection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">HTTPS Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Reuseport"
          tooltip="Enables reuseport to generate a separate listening socket per NGINX worker process, improving connection handling under load."
        >
          <div className="flex items-center gap-2">
            <Checkbox id="port-reuse" />
            <Label htmlFor="port-reuse" className="text-sm">
              Enable reuseport to generate a listening socket per worker
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Let's Encrypt webroot"
          tooltip="Webroot path used for Let's Encrypt HTTP-01 challenges."
        >
          <Input placeholder="/var/www/_letsencrypt/" />
        </SectionRow>
        <SectionRow
          label="Let's Encrypt certificate directory"
          tooltip="Directory where Let's Encrypt live certificates are stored."
        >
          <Input placeholder="/etc/letsencrypt/live/" />
        </SectionRow>
      </div>
    </div>
  );
}
