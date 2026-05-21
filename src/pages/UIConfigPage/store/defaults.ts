import type { GlobalConfigState } from "./types";

const DEFAULT_SITE = {
  id: "site-1",
  domain: "example.com",
  root: "/var/www/example.com/html",
  index: "index.html index.php",
  https: {
    certType: "none" as const,
    http2: false,
    forceHttps: false,
    wwwRedirect: false,
    hsts: false,
  },
  php: {
    enabled: false,
    wordpress: false,
    drupal: false,
    magento: false,
    joomla: false,
  },
  python: {
    django: false,
    gunicornSocket: "unix:/run/gunicorn.sock",
  },
  reverseProxy: {
    proxyPass: "",
    websockets: false,
    xForwardedProto: false,
    xForwardedHost: false,
  },
  routing: {
    fallbackRoute: "",
  },
  logging: {
    accessLogPath: "/var/log/nginx/example.com.access.log",
    errorLogPath: "/var/log/nginx/example.com.error.log",
  },
  restrict: {
    allowList: "",
    denyList: "",
    basicAuth: false,
  },
  onion: {
    enabled: false,
    location: "",
  },
};

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

  // Sites configuration
  sites: [DEFAULT_SITE],
};
