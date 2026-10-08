# Competitive option inventory — merged from DO, NPM, Serverion

**Purpose:** the SRS (`Nginx Config Visualizer.md` §2, §3.2) promises *"feature parity +
unique value"* against DigitalOcean, Nginx Proxy Manager and Serverion, and specifically
claims "**Superior (more presets)**" for Config Generation. This file is the audit of
what those three tools actually expose, so the UI tab can be made to cover the union
instead of the subset we guessed at.

**Date researched:** 2026-10-08.

---

## 1. Provenance of each option set

| Source | What it really is | How it was read |
| --- | --- | --- |
| DigitalOcean | `digitalocean/nginxconfig.io`, Vue app, MIT. The tool behind `do.co/nginxconfig`. | Option definitions read from `src/nginxconfig/templates/{global,domain}_sections/*.vue` and the `i18n/en/**` label files. Full inventory in §3. |
| Serverion | `serverion.com/nginx-config` is a **JS app with no server-rendered HTML** — `webfetch` returns the bare title. Its surface was recovered from the mirrored instance at `nginx.des.capital` and then **confirmed against a user-supplied screenshot of the live tool.** | Screenshot, 2026-10-08. Conclusion, now **verified not inferred: Serverion is nginxconfig.io, unmodified.** Its own footer reads *"Lovingly made by **Billiard Sockers** and maintained by **DigitalOcean**"* — the same credit line as the upstream project. |

### 1a. Serverion is an *older* fork — the exact delta

Confirmed tab-by-tab against the live screenshot:

| | Serverion (verified) | nginxconfig.io master |
| --- | --- | --- |
| Per-Website tabs | Presets, Server, HTTPS, PHP, Python, Reverse proxy, Routing, Logging — **8** | + **Restrict**, **Onion** — 10 |
| Global tabs | HTTPS, Security, **PHP**, Python, Performance, Logging, NGINX, Tools — **8** | HTTPS, Security, Python, **Reverse proxy**, Performance, Logging, NGINX, **Docker**, Tools — 9 |
| Setup tabs | Download, **SSL init**, Certbot, **Go Live!** — 4 | same four |

So Serverion **lacks** per-site Restrict and Onion, **lacks** global Reverse proxy and
Docker, and still carries a **global PHP tab** that DigitalOcean dropped upstream.

**This settles the open question from the previous session: Serverion has not diverged
in any way that matters, and it contributes nothing we have not already catalogued from
DigitalOcean.** Tracking nginxconfig.io is sufficient. No standing watch needed. It also
confirms we are *not* behind Serverion — we have Restrict, Onion and global Reverse proxy
that it does not, and our per-site field coverage beats it.

The screenshot also independently validated three defaults we had recorded as suspect:
`Redirect subdomains` renders **checked** (ours is `false`), `client_max_body_size` is
**16M** (ours is `1`), and the OCSP resolver group shows Cloudflare / Google / OpenDNS
checked with Quad9 and Verisign present-but-off.
| Nginx Proxy Manager | A **different product shape** — a Dockerised reverse-proxy manager with a database and users, not a pure config generator. Per-host entities: Proxy Hosts, Redirection Hosts, Streams, 404 Hosts, Access Lists, Certificates, plus 12 custom-snippet injection points. | `nginxproxymanager.com` guide / setup / advanced-config / certbot / faq, plus the screenshot index which enumerates the entity list. |

**The single most important finding:** DigitalOcean and Serverion share one option
vocabulary — Serverion *is* DigitalOcean's tool, credited as such in its own footer.
Only Nginx Proxy Manager contributes anything new. So the union below is
"nginxconfig.io ∪ NPM-only additions" — not three-way.

### 1b. New: the emitted file tree is now known

The screenshot shows Serverion's generated output tree, which is nginxconfig.io's layout
verbatim. **This is the concrete contract for Task 4's generator** — it was previously
guesswork:

```
/etc/nginx/nginx.conf                                  # user, pid, worker_processes,
                                                      #   worker_rlimit_nofile, events,
                                                      #   http: sendfile/tcp_nopush/tcp_nodelay,
                                                      #   charset, server_tokens, log_not_found,
                                                      #   types_hash_max_size, client_max_body_size,
                                                      #   SSL block, OCSP resolver, DH params,
                                                      #   HSTS, then include conf.d/*.conf + sites-enabled/*
/etc/nginx/nginxconfig.io/general.conf                 # error_log, gzip, open_file_cache,
                                                      #   location ~ /\. for robots/favicon, access_log
/etc/nginx/nginxconfig.io/security.conf                # the map{} for Referrer-Policy,
                                                      #   X-Frame-Options / X-XSS-Protection /
                                                      #   X-Content-Type-Options, HSTS
/etc/nginx/nginxconfig.io/php_fastcgi.conf             # fastcgi_pass unix:/var/run/php/phpX.Y-fpm.sock,
                                                      #   SCRIPT_FILENAME, open_basedir
/etc/nginx/nginxconfig.io/letsencrypt.conf             # ACME challenge location, root /var/www/_letsencrypt/
/etc/nginx/sites-available/example.com.conf            # the main server block + include chain
/etc/nginx/sites-enabled/                              # symlinks into sites-available/
```

Three details worth pinning down before writing the generator:

1. **`worker_rlimit_nofile 65535` and `multi_accept on` / `worker_connections 65535`
   are emitted but have no UI field** — in upstream too. So this is *not* a gap in our
   form; it is a fixed preamble the generator should always write. **This answers the
   open question in the previous session's response: keep emitting them fixed.**
2. **Per-site output is three files, not one** — the main `server` block, plus a
   redirect `server` (port 80 → 301 `https://$host$request_uri`) and a request `server`
   (port 80 for `www`/`cdn` subdomains, including a per-domain `request.conf`). Our
   generator must emit the redirect sibling, or `redirectSubdomains` has nowhere to go.
3. **`fastcgi_pass unix:/var/run/php/php7.2-fpm.sock`** — concrete proof of the
   `phpServer` enum problem in §5 item 4. Our `<option value="php8.2-sock">` cannot
   produce this string.

Also visible: `map $uri $ref_policy { ~^/(wp-admin|wp-login|xmlrpc\.php) "always";
default "no-referrer-when-downgrade"; }` — the `referrerPolicy` enum is emitted as a
`map` keyed on URI, not as a plain `add_header`. That is why it must be a closed enum
in our store.

---

## 2. Dependency audit (2026-10-08, `npm outdated`)

Node v22.19.0, npm 11.6.0. Nothing is broken by being out of date; this is hygiene.

**Two majors are available and both are deliberate no's right now:**

| Package | Installed | Wanted | Latest | Call |
| --- | --- | --- | --- | --- |
| `typescript` | 6.0.3 | 6.0.3 | **7.0.2** | **Hold.** TS 7 is the native-port line; it will churn every `tsc -b` error we are about to spend a pass fixing. Revisit once the build is green. |
| `@babel/core` | 7.29.0 | 7.29.7 | **8.0.7** | **Hold.** Only pulled in transitively by `@rolldown/plugin-babel` for the React Compiler preset. Bumping Babel majors will move the compiler output under us. |

Everything else is a semver-compatible bump reachable with `npm update`, no
`package.json` edit needed: `vite` 8.0.12→8.3.4, `react`/`react-dom` 19.2.6→19.3.0,
`tailwindcss` + `@tailwindcss/vite` 4.3.0→4.3.3, `eslint` 10.3.0→10.12.0,
`typescript-eslint` 8.59.3→8.71.1, `zustand` 5.0.13→5.0.15, `lucide-react` 1.14.0→1.53.0,
`radix-ui` 1.4.3→1.7.0 plus every `@radix-ui/react-*` package, `recharts` 3.8.0→3.10.1,
`react-resizable-panels` 4.11.0→4.14.3, `shadcn` 4.7.0→4.21.4, `tailwind-merge` 3.6.0→3.7.0,
`@types/node` 24.12.4→**26.6.4** (major, but types-only and low risk).

**Already current, do not touch:** `@monaco-editor/react` 4.7, `reactflow` 11.11.4.

**Installed but unused — dead weight in `dependencies`:**

| Package | Imports in `src/` | Note |
| --- | --- | --- |
| `@phosphor-icons/react` | 0 | Nothing imports it. Icons are `lucide-react`. |
| `date-fns` | 0 | Only `react-day-picker` would want it, and that component is unused. |
| `embla-carousel-react`, `vaul`, `cmdk`, `input-otp`, `react-day-picker`, `sonner`, `next-themes` | 0 in app code (all pulled in by generated `ui/` primitives we don't render) | Keep only while the matching unused primitive is kept. |

`reactflow` is imported once but only as the string `"ReactFlow"` inside a comment in
`VisualConfigPage.tsx:199` — the real import does not exist. Same for `recharts`
(11 hits are all inside unused `ui/chart.tsx`) and `@monaco-editor/react`'s single real
use.

---

## 3. DigitalOcean / nginxconfig.io — the canonical generator surface

Full inventory. `[x]` = we already have a field for it. `[ ]` = **missing from our UI**.

### 3.1 Global sections (tab order matches our `global-config/index.tsx`)

**HTTPS** — `portReuse` [x] · `sslProfile` modern|intermediate|old, default
`intermediate` [x] · OCSP resolvers `ocspCloudflare` / `ocspGoogle` / `ocspOpenDns` /
`ocspQuad9` / `ocspVerisign`, each with a paired `…Type` ipv4|ipv6|both [x] ·
`letsEncryptRoot` `/var/www/_letsencrypt/` [x] · `letsEncryptCertRoot`
`/etc/letsencrypt/live/` [x].
*Gating we lack:* the whole tab is inert unless some site has HTTPS on.

**Security** — `referrerPolicy` (8-value enum) [x but typed as bare `string`] ·
`contentSecurityPolicy` [x] · `permissionsPolicy` [x] · `serverTokens` [x] ·
`limitReq` [x] · `securityTxt` [x] · `securityTxtPath` [x].
*Missing:* the CSP/Referrer-Policy/Permissions-Policy **enums** — we store free text
where they are closed sets. `limit_req` also has `zone` + burst/rate fields upstream
that we have never modelled at all.

**Python** — `pythonServer` default `/tmp/uwsgi.sock` [x as `pythonSocket`, default
`unix:/run/gunicorn.sock`]. Single field; ours differs only in name and default.

**Reverse proxy** — `proxyConnectTimeout` / `proxySendTimeout` / `proxyReadTimeout`,
default 60, rendered with an `s` suffix [x] · `proxyCoexistenceXForwarded`
passOn|remove [x]. Gated on some site enabling reverse proxy.

**Performance** — `disableHtmlCaching` [x] · `gzipCompression` [x] ·
`brotliCompression` [x] · `assetsExpiration` / `mediaExpiration` / `svgExpiration` /
`fontsExpiration`, all `7d` upstream, all `max` in our defaults [x].

**Logging** — `errorLogEnabled` [x] · `errorLogPath` [x] · `errorLogLevel` (upstream
enum `debug|info|notice|warn|error|crit|alert|emerg`; our type allows only
`debug|info|notice|warn|error`) [x but **truncated enum**] · `logNotFound` [x] ·
`cloudflare` master toggle [x] · `cfRay` `cfConnectingIp` `xForwardedFor`
`xForwardedProto` `trueClientIp` `cfIpCountry` `cfVisitor` `cdnLoop` [x] — the last nine
gate on `cloudflare`, which we do not enforce.

**NGINX** — `nginxConfigDirectory` `/etc/nginx/` [x] · `workerProcesses` enum
auto|1..16 [x] · `user` `www-data` [x] · `pid` `/run/nginx.pid` [x] ·
`clientMaxBodySize` default 16 MB (ours defaults to **1**) [x] ·
`typesHashMaxSize` [x] · `typesHashBucketSize` [x].
*Missing:* `worker_rlimit_nofile` and `multi_accept` are emitted in their generated
`nginx.conf` but have no UI field.

**Docker** — `dockerfile` [x] · `dockerCompose` [x, upstream gated on dockerfile].
Our extra `dockerTweaks` boolean has no upstream counterpart — upstream exposes it as a
**button**, "Apply Docker tweaks", that mutates `nginx.user=nginx`,
`nginx.pid=/var/run/nginx.pid`, `dockerfile=true`. Ours is a dead checkbox.

**Tools** — `modularizedStructure` (upstream default **true**, ours **false**) [x] ·
`symlinkVhost` (upstream default true, gated on modularized, ours false) [x].
*Missing:* "Share configuration" (URL-encoded state) and the reset/remove actions.

### 3.2 Per-site sections

**Presets** — upstream renders this as a collapsible panel *above* the tabs, not a tab.
Nine booleans: `frontend`, `php`, `django`, `nodejs`, `singlePageApplication`,
`wordPress`, `drupal`, `magento`, `joomla`. **[ ] ENTIRELY MISSING.** This is the SRS's
headline "more presets" claim — we have nothing.

**We ship this layout as-is** (decision A-D10). The alternative — preset buttons in the
site tab strip — was considered and rejected: nine presets are a *set*, not a choice, so
nine checkboxes read as a scannable matrix with active state visible, and the panel makes
the mutual-exclusion conflict (Frontend / PHP / Django / WordPress compete for the same
site slot) legible at the moment of choosing. The site tab strip is also the most
crowded region on screen. That alternative is kept as a static mockup under `docs/`
for comparison only.

**Server** — `domain` [x] · `path` (computed `/var/www/<domain>` upstream; ours is a
stored string) [x] · `documentRoot` `/public` [x] · `wwwSubdomain` [x] ·
`cdnSubdomain` (gated on wwwSubdomain) [x] · `redirectSubdomains` (upstream default
**true**, ours false) [x] · `listenIpv4` `*` [x] · `listenIpv6` `::` [x].

**HTTPS** — `https` `http2` `http3` `forceHttps` `hsts` `hstsSubdomains` `hstsPreload`
`certType` letsEncrypt|custom `letsEncryptEmail` (computed `info@<domain>` upstream)
`sslCertificate` `sslCertificateKey` — **all 11 present** [x]. This section is complete.

**PHP** — `php` `phpServer` `phpServerCustom` `phpBackupServer` `phpBackupServerCustom`
`wordPressRules` `drupalRules` `magentoRules` `joomlaRules` — all 9 present [x], but our
`<option>` values are invented short keys (`php8.2-sock`, `hhvm`, `tcp`) rather than the
real socket paths upstream emits. The generator will not know how to expand them.

**Python** — `python` `djangoRules` [x].

**Reverse proxy** — `reverseProxy` `path` `proxyPass` `proxyHostHeader` [x].

**Routing** — `root` `index` (index.html|index.php) `fallbackHtml` `fallbackPhp`
`fallbackPhpPath` `legacyPhpRouting` — all 6 present [x].

**Logging** — `accessLogEnabled` `accessLogPath` `accessLogParameters` (upstream
`buffer=512k flush=1m`, ours `combined`) `redirectAccessLog` `errorLogEnabled`
`errorLogPath` `errorLogLevel` (**upstream enum includes `none|crit|alert|emerg`**;
ours is truncated) `redirectErrorLog` — all 9 present [x].

**Restrict** — nine HTTP methods + `responseCode` (upstream validated
`/^[1-5][0-9][0-9]$/`) — all 10 present [x].

**Onion** — `onionLocation` [x].

### 3.3 Setup sections — entirely missing

Four tabs with **no config fields**; they render instructions and terminal commands.
This maps directly onto SRS §3.4's "Go Live Checklist", so it is in scope.

| Section | Content |
| --- | --- |
| Download | Zip of the generated tree; also "Copy as base64" |
| SSL | Certificate paths, LE instructions |
| Certbot | `certbot` command lines, consuming `letsEncryptRoot`, `modularizedStructure`, `symlinkVhost`, per-site `certType` / `letsEncryptEmail` / `wwwSubdomain` / `cdnSubdomain` |
| Go live | tar backup, unzip, `nginx -t`, `systemctl reload nginx` |

Our `CodeConfigPage` has non-functional "Format" and "Save" buttons where this belongs.

---

## 4. Nginx Proxy Manager — the only genuinely additive surface

Not a generator; a runtime proxy manager. Its value to us is **coverage of hosting
concerns nginxconfig.io ignores entirely**.

| NPM capability | Do we have it? | Notes for our model |
| --- | --- | --- |
| Proxy Hosts | partial | we have per-site reverse proxy, single upstream, no named upstream blocks or load balancing |
| **Redirection Hosts** | **[ ]** | First-class domain→domain 301/302 with "preserve path". We only have `redirectSubdomains` inside a site. |
| **404 Hosts** | **[ ]** | Custom error document server blocks. Nothing in our model. |
| **Streams** (TCP/UDP) | **[ ]** | `stream{}` block, `proxy_pass` on a port. nginxconfig.io never does this. |
| **Access Lists** | **[ ]** | Per-host IP allow/deny + HTTP basic auth (`auth_basic` + `auth_basic_user_file`). SRS §6 says "Rate Limits" under Security; we have a bare `limitReq` boolean and no IP ACL at all. |
| **Certificates as an entity** | **[ ]** | We store cert *paths* per site. NPM manages certs: Let's Encrypt (HTTP-01 or **DNS challenge with a per-provider plugin**), or custom, with expiry tracking. |
| **12 custom snippet injection points** | **[ ]** | `root_top`, `root`, `http_top`, `http`, `events`, `stream`, `server_proxy`, `server_redirect`, `server_stream`, `server_stream_tcp`, `server_stream_udp`, `server_dead`. A "raw advanced config" escape hatch. |
| Per-host toggles: websockets, force SSL, block common exploits | **[ ]** | Force SSL and HSTS we have; websockets and exploit-blocking we do not. |
| IPv6 disable flag | **[ ]** | |
| geoip2 module opt-in | **[ ]** | `load_module` snippet. |
| Multiple users, permissions, audit log | n/a | We have no auth by design (SRS §4 privacy). Do not add. |

---

## 5. Gap list, ordered by what unblocks the product

**Blockers — the generator cannot be written without these:**

1. **Presets panel** (9 booleans). The SRS's competitive claim; also the cheapest way to
   demo multi-site.
2. **`GlobalConfigState` is flat while `Site` is nested.** 60 sibling fields vs 10 nested
   objects. The generator function will read like a spreadsheet. Nest it to mirror
   `Site`, then `updateField("https.sslProfile", …)` gets dotted paths for free.
3. **Missing enum types.** `referrerPolicy`, `errorLogLevel` (both levels),
   `sslProfile`, `phpServer`, `index`, `workerProcesses`, `typesHash*` are either bare
   `string` or truncated. This is what the 38 `as boolean` / `as string` casts in the
   section components are papering over.
4. **`phpServer` values are fake keys.** They must become real `fastcgi_pass` targets.

**Correctness — wrong output or dead UI:**

5. Default drift: `modularizedStructure` / `symlinkVhost` false (upstream true),
   `clientMaxBodySize` 1 (16), `redirectSubdomains` false (true), expiries `max` (`7d`),
   `accessLogParameters` `combined` (`buffer=512k flush=1m`).
6. `dockerTweaks` is a dead checkbox; upstream makes it a button that mutates three fields.
7. No gating. Nine CF log fields gate on `cloudflare`; `symlinkVhost` on
   `modularizedStructure`; `cdnSubdomain` on `wwwSubdomain`; three global tabs gate on a
   site enabling the feature; `securityTxtPath` on `securityTxt`. None enforced.
8. No mutual exclusion. Upstream force-disables PHP when reverse proxy or Python is on
   (and vice versa). Ours lets a site be all three at once.
9. `limit_req` has no zone/rate/burst fields.

**Coverage — SRS §3.3/§3.4 requirements with no UI at all:**

10. **Setup sections**: Download (zip + base64), SSL, Certbot, Go live. SRS §3.4.
11. **Redirection hosts, 404 hosts, TCP/UDP streams, access lists, custom-advanced-config
    snippets.** All from NPM; all absent.
12. **No `worker_rlimit_nofile` / `multi_accept` fields** though their output exists.
13. Warnings/alerts upstream renders and we don't: duplicate domain, invalid
    `responseCode`, non-`.onion` location, WordPress CSP missing `unsafe-eval`,
    non-standard-module notices for HTTP/3 and Brotli.

---

## 6. What not to copy

- **NPM's users / permissions / audit log.** We are 100% client-side by spec (SRS §4).
  Auth is a competitive *disadvantage* for us, not a gap.
- **NPM's database.** Same reason.
- **`reactflow` 11.** Superseded upstream by `@xyflow/react`; it is a dependency we
  have not actually imported. Decide before Milestone 5 adds the real logic map.
