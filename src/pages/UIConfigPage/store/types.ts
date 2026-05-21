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
}

export interface GlobalConfigActions {
  updateField: (
    field: keyof GlobalConfigState,
    value: string | number | boolean | unknown,
  ) => void;
  resetToDefaults: () => void;
}
