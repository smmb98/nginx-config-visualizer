import { Info } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldContent,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabSelector } from "@/components/TabSelector";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ─────────────────── helper: labelled form row ─────────────────── */
function Row({
  label,
  tooltip,
  children,
  align = "top",
}: {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  align?: "top" | "center";
}) {
  return (
    <Field
      orientation="horizontal"
      className={cn("items-center", align === "top" && "items-start")}
    >
      <FieldLabel className="w-44 shrink-0">
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1.5 cursor-help text-sm font-medium">
                {label}
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-sm font-medium">{label}</span>
        )}
      </FieldLabel>
      <FieldContent className="flex-1">{children}</FieldContent>
    </Field>
  );
}

/* ── section definitions ─────────────────────────────── */
const SECTIONS = [
  { key: "https", label: "HTTPS" },
  { key: "security", label: "Security" },
  { key: "python", label: "Python" },
  { key: "reverse-proxy", label: "Reverse Proxy" },
  { key: "performance", label: "Performance" },
  { key: "logging", label: "Logging" },
  { key: "nginx", label: "NGINX" },
  { key: "docker", label: "Docker" },
  { key: "tools", label: "Tools" },
] satisfies { key: string; label: string }[];

export function UIConfigPage() {
  const [sites, setSites] = useState(["example.com"]);
  const [activeTab, setActiveTab] = useState("example.com");
  const [activeSection, setActiveSection] = useState("https");

  const getNextSiteName = (base: string, sites: string[]) => {
    const regex = new RegExp(`^${base}( \\((\\d+)\\))?$`);

    const usedNumbers = sites
      .map((site) => {
        const match = site.match(regex);
        if (!match) return 0;
        return match[2] ? Number(match[2]) : 0;
      })
      .filter((n) => !isNaN(n));

    let next = 0;
    while (usedNumbers.includes(next)) {
      next++;
    }

    return next === 0 ? base : `${base} (${next})`;
  };

  const addSite = () => {
    const newSiteName = getNextSiteName("example.com", sites);

    setSites([...sites, newSiteName]);
    setActiveTab(newSiteName);
  };

  const closeSite = (e: MouseEvent, siteToDelete: string) => {
    e.stopPropagation(); // Prevents switching tabs when clicking 'X'
    const updatedSites = sites.filter((site) => site !== siteToDelete);
    setSites(updatedSites);

    // Logic to switch active tab if we closed the current one
    if (activeTab === siteToDelete && updatedSites.length > 0) {
      setActiveTab(updatedSites[updatedSites.length - 1]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-base p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="mb-8">
          <div>
            <h1 className="text-headline-lg text-on-surface mb-2">
              Configuration Generator
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              Optimize your NGINX environment with precise performance and
              security directives. Changes are validated in real-time against
              current schema.
            </p>
          </div>
        </div>

        {/* Per-Website Config heading */}
        <h2 className="text-headline-md text-on-surface">Per-Website Config</h2>

        {/* Site Selector */}
        <TabSelector
          tabs={sites.map((s) => ({ key: s, label: s }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddTab={addSite}
          addLabel="Add site"
          showAddButton
          onCloseTab={(site, e) => closeSite(e, site)}
        />

        {/* Empty card */}
        {/* <div className="glass-panel rounded-xl p-6 min-h-100" /> */}

        {/* Global Config heading */}
        <h2 className="text-headline-md text-on-surface">Global Config</h2>

        <div className="glass-panel rounded-xl p-6 min-h-100">
          <TabSelector
            tabs={SECTIONS.map((s) => ({ key: s.key, label: s.label }))}
            activeTab={activeSection}
            onTabChange={setActiveSection}
          />

          <CardContent>
            <FieldGroup>
              {/* ── NGINX ─────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>NGINX</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="Config Directory"
                      tooltip="Directory where NGINX is installed, e.g. /etc/nginx/"
                    >
                      <Input placeholder="/etc/nginx/" />
                    </Row>

                    <Row
                      label="worker_processes"
                      tooltip="Determines how many NGINX worker processes are spawned. Set to auto to match your CPU core count."
                    >
                      <Select defaultValue="auto">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="auto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto</SelectItem>
                          {Array.from({ length: 16 }, (_, i) => i + 1).map(
                            (n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </Row>

                    <Row
                      label="user"
                      tooltip="UNIX user and group that the worker processes will run as. Set to www-data for the default NGINX user."
                    >
                      <Input placeholder="www-data" />
                    </Row>

                    <Row
                      label="pid"
                      tooltip="Location of the NGINX process ID file, used by the master process."
                    >
                      <Input placeholder="/run/nginx.pid" />
                    </Row>

                    <Row
                      label="client_max_body_size"
                      tooltip="Sets the maximum allowed body size of a client request. Use mb suffix for megabytes."
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="16"
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">
                          MB
                        </span>
                      </div>
                    </Row>

                    <Row
                      label="types_hash_max_size"
                      tooltip="Sets the maximum size of the types hash table. Larger values consume more memory."
                    >
                      <Select defaultValue="2048">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="2048" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 8 }, (_, i) =>
                            Math.pow(2, i + 6),
                          ).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Row>

                    <Row
                      label="types_hash_bucket_size"
                      tooltip="Sets the bucket size for the server names hash table."
                    >
                      <Select defaultValue="64">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="64" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) =>
                            Math.pow(2, i + 4),
                          ).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── PERFORMANCE ────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="Disable HTML caching"
                      tooltip="Disables the sending of the ETag and Last-Modified headers for HTML files, preventing browser caching."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="disable-html-caching" />
                        <Label
                          htmlFor="disable-html-caching"
                          className="text-sm"
                        >
                          Disable HTML caching
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="Gzip compression"
                      tooltip="Enables gzip compression to reduce the size of transmitted data for text-based assets."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="gzip-compression" defaultChecked />
                        <Label htmlFor="gzip-compression" className="text-sm">
                          Enable gzip compression
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="Brotli compression"
                      tooltip="Enables Brotli compression. Brotli is a newer, more efficient lossless compression algorithm."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="brotli-compression" />
                        <Label htmlFor="brotli-compression" className="text-sm">
                          Enable Brotli compression
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="Expiration for assets"
                      tooltip="Set the Cache-Control max-age for JS and CSS assets (e.g. 7d for 7 days)."
                    >
                      <Input placeholder="7d" className="w-32" />
                    </Row>

                    <Row
                      label="Expiration for media"
                      tooltip="Set the Cache-Control max-age for image and media files (e.g. 7d for 7 days)."
                    >
                      <Input placeholder="7d" className="w-32" />
                    </Row>

                    <Row
                      label="Expiration for SVGs"
                      tooltip="Set the Cache-Control max-age for SVG files (e.g. 7d for 7 days)."
                    >
                      <Input placeholder="7d" className="w-32" />
                    </Row>

                    <Row
                      label="Expiration for fonts"
                      tooltip="Set the Cache-Control max-age for font files (e.g. 7d for 7 days)."
                    >
                      <Input placeholder="7d" className="w-32" />
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── SECURITY ───────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="Referrer-Policy"
                      tooltip="Controls how much referrer information is included with requests. no-referrer-when-downgrade is the browser default."
                    >
                      <Select defaultValue="no-referrer-when-downgrade">
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
                    </Row>

                    <Row
                      label="Content-Security-Policy"
                      tooltip="HTTP response header that helps mitigate cross-site scripting (XSS) and data injection attacks."
                    >
                      <Input defaultValue="default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';" />
                    </Row>

                    <Row
                      label="Permissions-Policy"
                      tooltip="Controls which browser features and APIs can be used in the browser (formerly Feature-Policy)."
                    >
                      <Input placeholder="interest-cohort=()" />
                    </Row>

                    <Row
                      label="server_tokens"
                      tooltip="Controls whether NGINX includes its version number in the Server response header and error pages. Disable for security hardening."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="server-tokens" />
                        <Label htmlFor="server-tokens" className="text-sm">
                          Enable server_tokens
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="limit_req"
                      tooltip="Enables rate-limiting of requests per second for all server blocks. Configure zones via a Rate Limits card."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="limit-req" />
                        <Label htmlFor="limit-req" className="text-sm">
                          Enable limit_req
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="security.txt"
                      tooltip="Enables a /.well-known/security.txt route so security researchers can contact you about vulnerabilities."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="security-txt" />
                        <Label htmlFor="security-txt" className="text-sm">
                          Enable security.txt
                        </Label>
                      </div>
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── LOGGING ───────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Logging</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row label="error_log" align="top">
                      <FieldGroup>
                        <div className="flex items-center gap-2">
                          <Checkbox id="error-log-enabled" />
                          <Label
                            htmlFor="error-log-enabled"
                            className="text-sm"
                          >
                            Enable
                          </Label>
                        </div>
                        <FieldContent className="pt-2">
                          <Input placeholder="/var/log/nginx/error.log" />
                        </FieldContent>
                      </FieldGroup>
                    </Row>

                    <Row label="error_log level">
                      <RadioGroup defaultValue="error" className="flex gap-4">
                        {["debug", "info", "notice", "warn", "error"].map(
                          (lvl) => (
                            <div key={lvl} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={lvl}
                                id={`err-lvl-${lvl}`}
                              />
                              <Label
                                htmlFor={`err-lvl-${lvl}`}
                                className="text-sm"
                              >
                                {lvl}
                              </Label>
                            </div>
                          ),
                        )}
                      </RadioGroup>
                    </Row>

                    <Row
                      label="log_not_found"
                      tooltip="Enables logging of requests for static files that were not found, directly into error_log."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="log-not-found" />
                        <Label htmlFor="log-not-found" className="text-sm">
                          Enable file not found error logging in error_log
                        </Label>
                      </div>
                    </Row>

                    <Row label="log_format">
                      <FieldGroup>
                        <div className="flex items-center gap-2 pb-3">
                          <Checkbox id="cloudflare-enable" />
                          <Label
                            htmlFor="cloudflare-enable"
                            className="text-sm"
                          >
                            Add Cloudflare request headers to the default log
                            format
                          </Label>
                        </div>

                        <Separator className="mb-3" />

                        <div className="flex items-center gap-2">
                          <Checkbox id="cf-ray" defaultChecked />
                          <Label
                            htmlFor="cf-ray"
                            className="text-sm font-mono text-xs"
                          >
                            CF-Ray
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="cf-connecting-ip" defaultChecked />
                          <Label
                            htmlFor="cf-connecting-ip"
                            className="text-sm font-mono text-xs"
                          >
                            CF-Connecting-IP
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="x-forwarded-for" />
                          <Label
                            htmlFor="x-forwarded-for"
                            className="text-sm font-mono text-xs"
                          >
                            X-Forwarded-For
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="x-forwarded-proto" />
                          <Label
                            htmlFor="x-forwarded-proto"
                            className="text-sm font-mono text-xs"
                          >
                            X-Forwarded-Proto
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="true-client-ip" />
                          <Label
                            htmlFor="true-client-ip"
                            className="text-sm font-mono text-xs"
                          >
                            True-Client-IP
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="cf-ipcountry" />
                          <Label
                            htmlFor="cf-ipcountry"
                            className="text-sm font-mono text-xs"
                          >
                            CF-IPCountry
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="cf-visitor" />
                          <Label
                            htmlFor="cf-visitor"
                            className="text-sm font-mono text-xs"
                          >
                            CF-Visitor
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="cdn-loop" />
                          <Label
                            htmlFor="cdn-loop"
                            className="text-sm font-mono text-xs"
                          >
                            CDN-Loop
                          </Label>
                        </div>
                      </FieldGroup>
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── HTTPS ─────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>HTTPS</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="Reuseport"
                      tooltip="Enables reuseport to generate a separate listening socket per NGINX worker process, improving connection handling under load."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="port-reuse" />
                        <Label htmlFor="port-reuse" className="text-sm">
                          Enable reuseport to generate a listening socket per
                          worker
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="SSL Profile"
                      tooltip="Mozilla's SSL Configuration Generator profiles define which SSL/TLS ciphers and protocol versions are permitted."
                    >
                      <RadioGroup
                        defaultValue="intermediate"
                        className="flex flex-col gap-2"
                      >
                        {[
                          { value: "modern", label: "Mozilla Modern" },
                          {
                            value: "intermediate",
                            label: "Mozilla Intermediate",
                          },
                          { value: "old", label: "Mozilla Old" },
                        ].map((opt) => (
                          <div
                            key={opt.value}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem
                              value={opt.value}
                              id={`ssl-${opt.value}`}
                            />
                            <Label
                              htmlFor={`ssl-${opt.value}`}
                              className="text-sm font-normal"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </Row>

                    <Row label="OCSP DNS Resolvers">
                      <FieldGroup>
                        <div className="flex items-start gap-4 flex-wrap">
                          {[
                            {
                              id: "ocsp-cf",
                              label: "Cloudflare Resolver",
                              defaultChecked: true,
                            },
                            {
                              id: "ocsp-google",
                              label: "Google Public DNS",
                              defaultChecked: true,
                            },
                            {
                              id: "ocsp-opendns",
                              label: "OpenDNS",
                              defaultChecked: true,
                            },
                            { id: "ocsp-quad9", label: "Quad9" },
                            { id: "ocsp-verisign", label: "Verisign" },
                          ].map((resolver) => (
                            <div
                              key={resolver.id}
                              className="flex flex-col gap-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={resolver.id}
                                  defaultChecked={resolver.defaultChecked}
                                />
                                <Label
                                  htmlFor={resolver.id}
                                  className="text-sm"
                                >
                                  {resolver.label}
                                </Label>
                              </div>
                              {resolver.defaultChecked && (
                                <RadioGroup
                                  defaultValue="ipv4"
                                  className="flex gap-3 pl-6"
                                >
                                  {[
                                    "IPv4 only",
                                    "IPv6 only",
                                    "IPv4 & IPv6",
                                  ].map((opt) => (
                                    <div
                                      key={opt}
                                      className="flex items-center gap-1.5"
                                    >
                                      <RadioGroupItem
                                        value={opt
                                          .toLowerCase()
                                          .replace(/[^a-z0-9]/g, "-")}
                                        id={`${resolver.id}-${opt
                                          .toLowerCase()
                                          .replace(/[^a-z0-9]/g, "-")}`}
                                      />
                                      <Label
                                        htmlFor={`${resolver.id}-${opt
                                          .toLowerCase()
                                          .replace(/[^a-z0-9]/g, "-")}`}
                                        className="text-xs text-muted-foreground"
                                      >
                                        {opt}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}
                            </div>
                          ))}
                        </div>
                      </FieldGroup>
                    </Row>

                    <Row
                      label="Let's Encrypt webroot"
                      tooltip="Webroot path used for Let's Encrypt HTTP-01 challenges."
                    >
                      <Input placeholder="/var/www/_letsencrypt/" />
                    </Row>

                    <Row
                      label="Let's Encrypt certificate directory"
                      tooltip="Directory where Let's Encrypt live certificates are stored."
                    >
                      <Input placeholder="/etc/letsencrypt/live/" />
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── REVERSE PROXY ─────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Reverse Proxy</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="proxy_connect_timeout"
                      tooltip="Timeout for establishing a connection to a proxied server. Default is 60 seconds."
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="60"
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">
                          seconds
                        </span>
                      </div>
                    </Row>

                    <Row
                      label="proxy_send_timeout"
                      tooltip="Timeout for transmitting a request to the proxied server. Default is 60 seconds."
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="60"
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">
                          seconds
                        </span>
                      </div>
                    </Row>

                    <Row
                      label="proxy_read_timeout"
                      tooltip="Timeout for reading a response from the proxied server. Default is 60 seconds."
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="60"
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">
                          seconds
                        </span>
                      </div>
                    </Row>

                    <Row
                      label="Coexistence with X-Forwarded-*"
                      tooltip="Determines how nginxconfig.io handles X-Forwarded-* headers passed through the proxy."
                    >
                      <RadioGroup
                        defaultValue="pass-on"
                        className="flex flex-col gap-2"
                      >
                        {[
                          {
                            value: "pass-on",
                            label: "Legacy X-Forwarded-* headers passed on",
                          },
                          {
                            value: "remove",
                            label:
                              "Legacy X-Forwarded-* headers actively removed",
                          },
                        ].map((opt) => (
                          <div
                            key={opt.value}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem
                              value={opt.value}
                              id={`xfd-${opt.value}`}
                            />
                            <Label
                              htmlFor={`xfd-${opt.value}`}
                              className="text-sm font-normal"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── PYTHON ────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Python</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="Python server"
                      tooltip="Unix socket path used by the Python WSGI/uWSGI server process."
                    >
                      <Input placeholder="/tmp/uwsgi.sock" />
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── DOCKER ────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Docker</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row label="Docker" align="top">
                      <FieldGroup>
                        <div className="flex items-center gap-3 pb-3">
                          <Button variant="default" size="sm">
                            Apply Docker tweaks
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Apply configuration tweaks for running NGINX with
                            Docker.
                            <br />
                            <small>
                              Updates the NGINX user to{" "}
                              <code className="slim">nginx</code> and the pid to{" "}
                              <code className="slim">/var/run/nginx.pid</code>.
                            </small>
                          </span>
                        </div>
                      </FieldGroup>
                    </Row>

                    <Row label="Dockerfile">
                      <div className="flex items-center gap-2">
                        <Checkbox id="dockerfile" />
                        <Label htmlFor="dockerfile" className="text-sm">
                          Include Dockerfile to run NGINX with Docker
                        </Label>
                      </div>
                    </Row>

                    <Row label="Docker Compose">
                      <div className="flex items-center gap-2">
                        <Checkbox id="docker-compose" />
                        <Label htmlFor="docker-compose" className="text-sm">
                          Include docker-compose to run NGINX with
                          docker-compose
                        </Label>
                      </div>
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* ── TOOLS ─────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Row
                      label="Modularized structure"
                      tooltip="Generate separate per-site config files in sites-available/ and symlink them into sites-enabled."
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox id="modularized-structure" defaultChecked />
                        <Label
                          htmlFor="modularized-structure"
                          className="text-sm"
                        >
                          Enable modularized config files
                        </Label>
                      </div>
                    </Row>

                    <Row label="Symlink vhost">
                      <div className="flex items-center gap-2">
                        <Checkbox id="symlink-vhost" defaultChecked />
                        <Label htmlFor="symlink-vhost" className="text-sm">
                          Enable symlinks from sites-available/ to
                          sites-enabled/
                        </Label>
                      </div>
                    </Row>

                    <Row
                      label="Share configuration"
                      tooltip="A unique URL that encodes the current configuration — share it to let others reproduce your setup."
                    >
                      <div className="flex items-center gap-2">
                        <Input readOnly className="w-full" />
                      </div>
                    </Row>

                    <Row label="Reset configuration">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="destructive" size="sm">
                          Reset global config
                        </Button>
                        <Button variant="destructive" size="sm">
                          Reset all domains
                        </Button>
                        <Button variant="destructive" size="sm">
                          Remove all domains
                        </Button>
                      </div>
                    </Row>
                  </FieldGroup>
                </CardContent>
              </Card>
            </FieldGroup>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
