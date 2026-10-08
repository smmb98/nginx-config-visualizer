/**
 * A `fastcgi_pass` target, spelled exactly as nginx will receive it — the generator
 * interpolates these directly, so a key that is not also the emitted string is a bug.
 * `custom` is the one sentinel: its socket comes from `phpServerCustom` instead.
 * `tcp` (a bare host:port) was dropped — `custom` covers it.
 */
export type PhpFpmTarget =
  | "unix:/var/run/php/php7.4-fpm.sock"
  | "unix:/var/run/php/php8.0-fpm.sock"
  | "unix:/var/run/php/php8.1-fpm.sock"
  | "unix:/var/run/php/php8.2-fpm.sock"
  | "unix:/var/run/php/php8.3-fpm.sock"
  | "unix:/var/run/hhvm/hhvm.sock"
  | "custom";

export const ERROR_LOG_LEVELS = [
  "debug",
  "info",
  "notice",
  "warn",
  "error",
  "crit",
  "alert",
  "emerg",
] as const;

export type ErrorLogLevel = (typeof ERROR_LOG_LEVELS)[number];

/** Per-site also accepts `none`, which disables the error log entirely. */
export const SITE_ERROR_LOG_LEVELS = [...ERROR_LOG_LEVELS, "none"] as const;

export type SiteErrorLogLevel = (typeof SITE_ERROR_LOG_LEVELS)[number];

export const REFERRER_POLICIES = [
  "no-referrer",
  "no-referrer-when-downgrade",
  "origin",
  "origin-when-cross-origin",
  "same-origin",
  "strict-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url",
] as const;

export type ReferrerPolicy = (typeof REFERRER_POLICIES)[number];

export interface SiteServerConfig {
  domain: string;
  path: string;
  documentRoot: string;
  wwwSubdomain: boolean;
  cdnSubdomain: boolean;
  redirectSubdomains: boolean;
  listenIpv4: string;
  listenIpv6: string;
}

export interface SiteHttpsConfig {
  https: boolean;
  http2: boolean;
  http3: boolean;
  forceHttps: boolean;
  hsts: boolean;
  hstsSubdomains: boolean;
  hstsPreload: boolean;
  certType: 'letsEncrypt' | 'custom';
  letsEncryptEmail: string;
  sslCertificate: string;
  sslCertificateKey: string;
}

export interface SitePhpConfig {
  php: boolean;
  phpServer: PhpFpmTarget;
  phpServerCustom: string;
  phpBackupServer: PhpFpmTarget | "";
  phpBackupServerCustom: string;
  wordPressRules: boolean;
  drupalRules: boolean;
  magentoRules: boolean;
  joomlaRules: boolean;
}

export interface SitePythonConfig {
  python: boolean;
  djangoRules: boolean;
}

export interface SiteReverseProxyConfig {
  reverseProxy: boolean;
  path: string;
  proxyPass: string;
  proxyHostHeader: string;
}

export interface SiteRoutingConfig {
  root: boolean;
  index: string;
  fallbackHtml: boolean;
  fallbackPhp: boolean;
  fallbackPhpPath: string;
  legacyPhpRouting: boolean;
}

export interface SiteLoggingConfig {
  accessLogEnabled: boolean;
  accessLogPath: string;
  accessLogParameters: string;
  redirectAccessLog: boolean;
  errorLogEnabled: boolean;
  errorLogPath: string;
  errorLogLevel: SiteErrorLogLevel;
  redirectErrorLog: boolean;
}

export interface SiteRestrictConfig {
  getMethod: boolean;
  postMethod: boolean;
  putMethod: boolean;
  patchMethod: boolean;
  deleteMethod: boolean;
  headMethod: boolean;
  connectMethod: boolean;
  optionsMethod: boolean;
  traceMethod: boolean;
  responseCode: number;
}

export interface SiteOnionConfig {
  onionLocation: string;
}

export interface Site {
  id: string;
  server: SiteServerConfig;
  https: SiteHttpsConfig;
  php: SitePhpConfig;
  python: SitePythonConfig;
  reverseProxy: SiteReverseProxyConfig;
  routing: SiteRoutingConfig;
  logging: SiteLoggingConfig;
  restrict: SiteRestrictConfig;
  onion: SiteOnionConfig;
}

export interface GlobalConfigState {
  // HTTPS section
  reuseport: boolean;
  sslProfile: "modern" | "intermediate" | "old";
  ocspCloudflare: boolean;
  ocspCloudflareType: "ipv4" | "ipv6" | "both" | undefined;
  ocspGoogle: boolean;
  ocspGoogleType: "ipv4" | "ipv6" | "both" | undefined;
  ocspOpenDns: boolean;
  ocspOpenDnsType: "ipv4" | "ipv6" | "both" | undefined;
  ocspQuad9: boolean;
  ocspQuad9Type: "ipv4" | "ipv6" | "both" | undefined;
  ocspVerisign: boolean;
  ocspVerisignType: "ipv4" | "ipv6" | "both" | undefined;
  letsEncryptRoot: string;
  letsEncryptCertRoot: string;

  // Security section
  referrerPolicy: ReferrerPolicy;
  contentSecurityPolicy: string;
  permissionsPolicy: string;
  serverTokens: boolean;
  limitReq: boolean;
  securityTxt: boolean;
  securityTxtPath: string;

  // Python section
  pythonSocket: string;

  // Reverse Proxy section
  proxyConnectTimeout: number;
  proxySendTimeout: number;
  proxyReadTimeout: number;
  proxyCoexistenceXForwarded: "passOn" | "remove";

  // Performance section
  disableHtmlCaching: boolean;
  gzipCompression: boolean;
  brotliCompression: boolean;
  assetsExpiration: string;
  mediaExpiration: string;
  svgExpiration: string;
  fontsExpiration: string;

  // Logging section
  errorLogEnabled: boolean;
  errorLogPath: string;
  errorLogLevel: ErrorLogLevel;
  logNotFound: boolean;
  cloudflare: boolean;
  cfRay: boolean;
  cfConnectingIp: boolean;
  xForwardedFor: boolean;
  xForwardedProto: boolean;
  trueClientIp: boolean;
  cfIpCountry: boolean;
  cfVisitor: boolean;
  cdnLoop: boolean;

  // NGINX section
  nginxConfigDirectory: string;
  workerProcesses: string;
  user: string;
  pid: string;
  clientMaxBodySize: number;
  typesHashMaxSize: number;
  typesHashBucketSize: number;

  // Docker section
  dockerTweaks: boolean;
  dockerfile: boolean;
  dockerCompose: boolean;

  // Tools section
  modularizedStructure: boolean;
  symlinkVhost: boolean;

  // Sites configuration
  sites: Site[];
}

export interface GlobalConfigActions {
  updateField: (
    field: keyof GlobalConfigState,
    value: string | number | boolean | unknown,
  ) => void;
  resetToDefaults: () => void;
  addSite: (site?: Partial<Site>) => void;
  removeSite: (siteId: string) => void;
  updateSiteField: (
    siteId: string,
    field: keyof Site | string,
    value: string | number | boolean | unknown,
  ) => void;
}
