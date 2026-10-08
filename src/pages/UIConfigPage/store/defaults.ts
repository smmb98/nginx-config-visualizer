import type { GlobalConfigState } from "./types";

const DEFAULT_SITE = {
  id: "site-1",
  domain: "example.com",
  server: {
    domain: "example.com",
    path: "/var/www/example.com",
    documentRoot: "/public",
    wwwSubdomain: false,
    cdnSubdomain: false,
    redirectSubdomains: false,
    listenIpv4: "*",
    listenIpv6: "::",
  },
  https: {
    https: true,
    http2: true,
    http3: false,
    forceHttps: true,
    hsts: true,
    hstsSubdomains: true,
    hstsPreload: false,
    certType: "letsEncrypt",
    letsEncryptEmail: "info@example.com",
    sslCertificate: "",
    sslCertificateKey: "",
  },
  php: {
    php: false,
    phpServer: "php-fpm.sock",
    phpServerCustom: "",
    phpBackupServer: "",
    phpBackupServerCustom: "",
    wordPressRules: false,
    drupalRules: false,
    magentoRules: false,
    joomlaRules: false,
  },
  python: {
    python: false,
    djangoRules: false,
  },
  reverseProxy: {
    reverseProxy: false,
    path: "/",
    proxyPass: "http://127.0.0.1:3000",
    proxyHostHeader: "$host",
  },
  routing: {
    root: true,
    index: "index.php",
    fallbackHtml: false,
    fallbackPhp: true,
    fallbackPhpPath: "/api/",
    legacyPhpRouting: false,
  },
  logging: {
    accessLogEnabled: true,
    accessLogPath: "/var/log/nginx/example.com.access.log",
    accessLogParameters: 'combined',
    redirectAccessLog: false,
    errorLogEnabled: true,
    errorLogPath: "/var/log/nginx/example.com.error.log",
    errorLogLevel: "error",
    redirectErrorLog: false,
  },
  restrict: {
    getMethod: false,
    postMethod: false,
    putMethod: false,
    patchMethod: false,
    deleteMethod: false,
    headMethod: false,
    connectMethod: false,
    optionsMethod: false,
    traceMethod: false,
    responseCode: 405,
  },
  onion: {
    onionLocation: "",
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
