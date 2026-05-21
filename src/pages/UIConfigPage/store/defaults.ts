import type { GlobalConfigState } from "./types";

export const DEFAULT_STATE: GlobalConfigState = {
  // HTTPS section
  reuseport: false,
  sslProfile: "modern",
  ocspCloudflare: false,
  ocspCloudflareType: undefined,
  ocspGoogle: false,
  ocspGoogleType: undefined,
  ocspOpenDns: false,
  ocspOpenDnsType: undefined,
  ocspQuad9: false,
  ocspQuad9Type: undefined,
  ocspVerisign: false,
  ocspVerisignType: undefined,
  letsEncryptRoot: "/var/www/certbot",
  letsEncryptCertRoot: "/etc/letsencrypt",

  // Security section
  referrerPolicy: "strict-origin-when-cross-origin",
  contentSecurityPolicy: "",
  permissionsPolicy: "",
  serverTokens: false,
  limitReq: false,
  securityTxt: false,
  securityTxtPath: "",

  // Python section
  pythonSocket: "unix:/run/gunicorn.sock",

  // Reverse Proxy section
  proxyConnectTimeout: 60,
  proxySendTimeout: 60,
  proxyReadTimeout: 60,
  proxyCoexistenceXForwarded: "passOn",

  // Performance section
  disableHtmlCaching: false,
  gzipCompression: true,
  brotliCompression: false,
  assetsExpiration: "max",
  mediaExpiration: "max",
  svgExpiration: "max",
  fontsExpiration: "max",

  // Logging section
  errorLogEnabled: true,
  errorLogPath: "/var/log/nginx/error.log",
  errorLogLevel: "error",
  logNotFound: false,
  cloudflare: false,
  cfRay: true,
  cfConnectingIp: true,
  xForwardedFor: false,
  xForwardedProto: false,
  trueClientIp: false,
  cfIpCountry: false,
  cfVisitor: false,
  cdnLoop: false,

  // NGINX section
  nginxConfigDirectory: "/etc/nginx",
  workerProcesses: "auto",
  user: "www-data",
  pid: "/run/nginx.pid",
  clientMaxBodySize: 1,
  typesHashMaxSize: 2048,
  typesHashBucketSize: 64,

  // Docker section
  dockerTweaks: false,
  dockerfile: false,
  dockerCompose: false,

  // Tools section
  modularizedStructure: false,
  symlinkVhost: false,
};
