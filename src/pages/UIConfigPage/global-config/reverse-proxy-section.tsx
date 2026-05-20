import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";

export function ReverseProxySection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Reverse Proxy Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="proxy_connect_timeout"
          tooltip="Timeout for establishing a connection to a proxied server. Default is 60 seconds."
        >
          <div className="flex items-center gap-2">
            <Input type="number" min={0} placeholder="60" className="w-28" />
            <span className="text-sm text-muted-foreground">s</span>
          </div>
        </SectionRow>
        <SectionRow
          label="proxy_send_timeout"
          tooltip="Timeout for transmitting a request to the proxied server. Default is 60 seconds."
        >
          <div className="flex items-center gap-2">
            <Input type="number" min={0} placeholder="60" className="w-28" />
            <span className="text-sm text-muted-foreground">s</span>
          </div>
        </SectionRow>
        <SectionRow
          label="proxy_read_timeout"
          tooltip="Timeout for reading a response from the proxied server. Default is 60 seconds."
        >
          <div className="flex items-center gap-2">
            <Input type="number" min={0} placeholder="60" className="w-28" />
            <span className="text-sm text-muted-foreground">s</span>
          </div>
        </SectionRow>
        <SectionRow
          label="Coexistence with X-Forwarded-*"
          tooltip="Determines how nginxconfig.io handles X-Forwarded-* headers passed through the proxy."
        >
          <RadioGroup defaultValue="pass-on" className="flex flex-col gap-2">
            {[
              {
                value: "pass-on",
                label: "Legacy X-Forwarded-* headers passed on",
              },
              {
                value: "remove",
                label: "Legacy X-Forwarded-* headers actively removed",
              },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`xfd-${opt.value}`} />
                <Label
                  htmlFor={`xfd-${opt.value}`}
                  className="text-sm font-normal"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </SectionRow>
      </div>
    </div>
  );
}
