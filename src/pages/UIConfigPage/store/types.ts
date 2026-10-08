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
  phpServer: string;
  phpServerCustom: string;
  phpBackupServer: string;
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
  errorLogLevel: string;
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
