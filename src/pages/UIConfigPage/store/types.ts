export interface SiteHttpsConfig {
  certType: "none" | "self-signed" | "letsencrypt";
  http2: boolean;
  forceHttps: boolean;
  wwwRedirect: boolean;
  hsts: boolean;
}

export interface SitePhpConfig {
  enabled: boolean;
  wordpress: boolean;
  drupal: boolean;
  magento: boolean;
  joomla: boolean;
}

export interface SitePythonConfig {
  django: boolean;
  gunicornSocket: string;
}

export interface SiteReverseProxyConfig {
  proxyPass: string;
  websockets: boolean;
  xForwardedProto: boolean;
  xForwardedHost: boolean;
}

export interface SiteRoutingConfig {
  fallbackRoute: string;
}

export interface SiteLoggingConfig {
  accessLogPath: string;
  errorLogPath: string;
}

export interface SiteRestrictConfig {
  allowList: string;
  denyList: string;
  basicAuth: boolean;
}

export interface SiteOnionConfig {
  enabled: boolean;
  location: string;
}

export interface Site {
  id: string;
  domain: string;
  root: string;
  index: string;
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
  referrerPolicy: string;
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
  errorLogLevel: "debug" | "info" | "notice" | "warn" | "error";
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
