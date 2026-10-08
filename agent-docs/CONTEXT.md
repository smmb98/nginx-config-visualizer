# CONTEXT.md — Application Context (authoritative)

Read this file first. It is the handoff state. If a fact here is wrong, fix it in the
same change that makes it wrong. A session that cannot rebuild the app from this file
alone has failed its main duty.

Last verified: 2026-10-08, branch `implementation` @ `61204fe`. **Build, lint and
typecheck are all green** — see §4. This corrects §3/§4/§7/§9, which still described
T2 as unfinished.

---

## 1. What the app is

**Nginx Config Visualizer & Intelligent Auditor** — a 100% client-side web tool that
lets a developer configure nginx visually, see the generated `.conf`, inspect the
request flow as a diagram, and get a security audit — without a server, a database,
or uploading their config anywhere.

The three-pillar pitch that beats DigitalOcean / Nginx Proxy Manager / Serverion:
1. **Generator** — form-driven config builder with per-site + global sections.
2. **Reverse-engineering** — upload an existing `.conf`, parse it, flip the UI toggles
   to match. (Nobody else does this.)
3. **Auditing** — health score, missing security headers, shadowed `location` blocks.

Privacy is the product: nothing leaves the machine. Source of truth for the spec is
`Nginx Config Visualizer.md` at the repo root.

---

## 2. Stack (from `package.json`, not aspirational)

- **React 19.2** + **TypeScript ~6.0.2**, **Vite 8.0.12** (rolldown-based)
- **Tailwind CSS 4.3** via `@tailwindcss/vite`, plus `shadcn/tailwind.css` and
  `tw-animate-css`. No `tailwind.config.ts` — v4 config lives in CSS.
- **Zustand 5.0.13** + `persist` middleware — two separate stores (see §5).
- **@monaco-editor/react 4.7** — the code editor (currently a hardcoded demo).
- **reactflow 11.11**, **recharts 3.8**, **react-resizable-panels 4.11** — installed,
  used only as mockups (hardcoded SVG / hardcoded numbers).
- **shadcn/ui** on **radix-ui 1.4** + **@base-ui/react 1.4** — primitives in
  `src/Components/ui/` (~60 components, generated, largely unused by app screens).
- **lucide-react** for icons, **Geist Variable** + **JetBrains Mono Variable** fonts.
- **Babel + `reactCompilerPreset`** is wired into `vite.config.ts`.

No test framework is installed. No `test` script exists.

---

## 3. Directory map

```
docs/                       design mockups (code.html + screen.png per direction),
                            plus NginxConfigReference.md and design.md — VISUAL BASELINE,
                            plus competitive-options.md — the DO/NPM/Serverion option
                            audit; READ BEFORE adding any UI option (see §6b)
public/                     static assets
src/
  main.tsx                  React entry
  App.tsx                   10 lines. isInitialized ? <Workspace/> : <LandingPage/>
  index.css                 ALL design tokens + .glass-panel/.dot-grid/typography utils
  assets/                   hero.png, svgs
  Components/
    LandingPage.tsx         entry screen: create new / import
    Workspace.tsx           app shell: Header + FileTree + tab content + Footer,
                            resizable left panel (persisted % width)
    Header.tsx              4 tabs (ui/code/visual/analytics), reset button
    Footer.tsx              status strip
    FileTree.tsx            recursive virtual /etc/nginx tree from the store
    SectionRow.tsx          label + description + control row (form primitive)
    TabSelector.tsx
    ui/                     ~60 shadcn primitives (GENERATED — do not hand-edit)
  pages/
    UIConfigPage/           the generator form
      index.tsx             composes PerWebsite + Global sections
      global-config/        10 sections: nginx, performance, security, https,
                            logging, reverse-proxy, docker, python, tools
      per-website-config/   11 sections: server, https, php, python, routing,
                            logging, restrict, reverse-proxy, onion
      store/                types.ts, defaults.ts, store.ts (the generator's state)
    CodeConfigPage.tsx      Monaco editor — HARDCODED default config, local useState
    VisualConfigPage.tsx    hardcoded SVG flowchart — no real data
    AnalyticsPage.tsx       health gauge with hardcoded 85, NL summary, static tables
  store/
    useAppStore.ts          the app store: file tree, raw config, parse results
  hooks/use-mobile.ts       shadcn mobile breakpoint hook
  lib/utils.ts              `cn()` clsx + tailwind-merge
```

Import alias: `@` → `src` (also `@components`, `@lib`, `@hooks`, `@shadcn-ui`).
**The casing bug is fixed:** the directory is `src/components` (lowercase), matching the
alias and the git index. The rename was done on disk only (`Rename-Item`, two-step —
a one-step case-only rename is a no-op on a case-insensitive filesystem) and produced
**zero git churn**, which is the proof the index was already correct. Never use
`git mv` for this.

---

## 4. Commands (verified, copy-pasteable)

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build   -- GREEN (verified 2026-10-08, exit 0)
npm run lint      # eslint .               -- GREEN (verified 2026-10-08, exit 0)
npx tsc -b        # typecheck only         -- GREEN (verified 2026-10-08, exit 0)
npm run preview   # serve the production build
```

`dist/` is gitignored — a successful build adds nothing to `git status`, which is
expected, not a missing artifact.

There is no test command and no test runner. If a task needs a check, the cheapest
honest option today is a single assert-based script; do not add Vitest for one test.

---

## 5. State: two stores, no bridge

This is the single most important thing to understand. They are **completely
disconnected** today.

**`src/store/useAppStore.ts`** — the app/shell store, persisted to localStorage under
`nginx-visualizer-storage`:
- `fileSystem: FileSystemNode[]` — recursive tree `{ id, name, type, content?, children?, parentId? }`
- `activeFileId`, `rawConfig`, `parsedConfig`
- `activeTab: "ui" | "code" | "visual" | "analytics"`, `sidebarCollapsed`,
  `sidebarSizePct`, `expandedDirs`, `isInitialized`
- `syntaxErrors: SyntaxError[]`, `securityAudits: SecurityAuditResult[]`, `healthScore`
- Actions: `initializeWorkspace`, `importFiles`, `createNewConfig`, `selectFile`,
  `updateConfig`, `switchTab`, `toggleSidebar`, `setSidebarSizePct`,
  `setExpandedDirs`, `resetWorkspace`, and 4 setters for parse results
  (`setParsedConfig`, `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore`)
- `partialize` persists only the shell/file state — parse results are intentionally
  not persisted.

**`src/pages/UIConfigPage/store/store.ts`** — the generator store, **not persisted**:
- `sites: Site[]`, where each `Site` is a nested typed config: `server`, `https`,
  `php`, `python`, `reverseProxy`, `routing`, `logging`, `restrict`, `onion`
- **plus ~60 FLAT global fields** (`reuseport`, `sslProfile`, `gzipCompression`,
  `workerProcesses`, …) at the top level, grouped only by comments — see §7 for why
  this is the one real modularity defect in the codebase.
- Actions: `updateField`, `resetToDefaults`, `addSite`, `removeSite`,
  `updateSiteField` (supports dotted paths like `"https.certType"`)
- `defaults.ts` holds `DEFAULT_STATE` with one `site-1` / `example.com` seed.
  Note `DEFAULT_SITE` also carries a stray top-level `domain` key that is not on the
  `Site` type — a leftover from the pre-nesting shape.

**The gap:** the form store never produces nginx text, and `rawConfig` never flows
into the form. `CodeConfigPage` renders its own hardcoded string; `setParsedConfig`,
`setSyntaxErrors`, `setSecurityAudits`, `setHealthScore` are **defined but called
nowhere**. There is no parser in this tree at all. This is the core missing wiring
of the entire product.

**Binding decision A-D9 — the tree is the source of truth; one AST, two consumers.**
Measured: `rawConfig` and `parsedConfig` have **zero readers** in `src/` outside
`useAppStore.ts`. `CodeConfigPage.tsx:35` still holds its own
`useState(defaultNginxConfig)` with a frozen `isValid = true`. So the current shape costs
nothing to change and everything to change later. Three rules, binding on the generator
(T6), the parser (T7) and the code view (T8):

1. **The generator writes files into the tree.** It does not return one string — the
   target layout is 5 global + 3 per-site files (§6b-i).
2. **The parser consumes the whole tree.**
3. **One AST, two consumers.** The visualizer (T10) reads exactly what the parser
   produces. Do not build a second representation for the logic map — that is what would
   otherwise stop it from having its own data model.

`rawConfig` survives only as a derived mirror of the active node's `content`, because an
editor needs one string to bind to. Never edit it directly; `updateConfig` writes through
to the tree by id. Rejected alternative: a combined `nginx.conf` for display plus
modular files for export — two representations of one config will drift.

**Binding decision A-D10 — presets ship as the upstream collapsible panel.** Nine
presets are a *set*, not a choice: nine checkboxes read as a scannable matrix with active
state visible, and the panel surfaces the mutual-exclusion conflict (Frontend / PHP /
Django / WordPress compete for the same site slot) while you are choosing. The site tab
strip is the most crowded region on screen and cannot show active state. The tab-strip
variant is kept only as a static sample under `docs/` — no store import, no live state.

---

## 6. Nginx config model / parser entry points

**None exist on this branch.** `NginxConfig { raw, ast }` in `useAppStore.ts` types
`ast` as `unknown`. Nothing populates it.

`origin/main` has `src/Workers/nginxParser.worker.ts` (327 lines): a hand-rolled
tokenizer → `NginxDirective` tree → ReactFlow nodes/edges + a health score. **It is
broken** — see §7. Treat it as a design sketch, not a source of truth.

Directive reference for building the parser lives in `docs/NginxConfigReference.md`.

---

## 6b. Competitive parity — required reading before touching the UI tab

**Full audit lives in `docs/competitive-options.md`.** Read that file before adding any
option to `UIConfigPage`. Summary of what it establishes:

- **Serverion is nginxconfig.io, verified — not a third source.** Confirmed against a
  screenshot of the live tool on 2026-10-08: its footer reads *"Lovingly made by
  Billiard Sockers and maintained by **DigitalOcean**"*. It is an **older** fork — it
  lacks per-site Restrict and Onion, lacks global Reverse proxy and Docker, and still
  carries a global PHP tab that DigitalOcean dropped. It contributes nothing
  DigitalOcean's source does not already define. **We are not behind Serverion**; we
  already ship three sections it lacks. Tracking nginxconfig.io alone is sufficient —
  no standing watch on Serverion.
- **Our per-site HTTPS (11/11), PHP (9/9), Routing (6/6), Restrict (10/10), Logging
  (9/9) and Server (8/8) field coverage is already complete** vs nginxconfig.io. The
  gaps are not "missing fields" in those sections.
- **Presets are entirely missing** — the nine bundles (`frontend`, `php`, `django`,
  `nodejs`, `singlePageApplication`, `wordPress`, `drupal`, `magento`, `joomla`). SRS §2
  sells "Superior (more presets)"; we currently have none. Placement decided: the
  collapsible panel above the per-site tabs, matching upstream — see §5, A-D10.
- **Setup sections are entirely missing** — Download (zip + base64), SSL, Certbot,
  Go live. SRS §3.4's "Go Live Checklist" lives here. `CodeConfigPage`'s Format/Save
  buttons are where it belongs.
- **NPM-only capabilities we have zero UI for:** redirection hosts, 404 hosts,
  TCP/UDP streams, access lists (IP allow/deny + HTTP basic auth), certificates as a
  managed entity (LE DNS challenge per provider), and the 12 custom-snippet injection
  points (`root_top`, `root`, `http_top`, `http`, `events`, `stream`, `server_proxy`,
  `server_redirect`, `server_stream{,_tcp,_udp}`, `server_dead`).
- **Do not copy from NPM:** users, permissions, audit log, database. SRS §4 makes
  client-side-only a competitive advantage. There is no auth and there must never be any.

**Auth: confirmed absent and confirmed correct.** No user model, no route guard, no
`react-router` dependency, and zero `fetch`/`axios`/`XMLHttpRequest` in `src/`. Persistence
is `zustand/persist` → localStorage only (`nginx-visualizer-storage`). Do not add auth.

### 6b-i. The generator's target file tree is now known

Do not guess this. `docs/competitive-options.md` §1b records nginxconfig.io's emitted
layout, confirmed from generated output: `nginx.conf` (globals + `events` + `http`
preamble, ending in `include conf.d/*.conf` and `include sites-enabled/*`) plus
`nginxconfig.io/{general,security,php_fastcgi,letsencrypt}.conf`, then per site
**three** files under `sites-available/` — the main `server` block, a redirect `server`
(port 80 → 301), and a `www`/`cdn` request `server` — symlinked from `sites-enabled/`.

Three consequences for Task 4:
- `worker_rlimit_nofile 65535`, `multi_accept on`, `worker_connections 65535` are
  emitted with **no UI field upstream either**. Fixed preamble, not a gap. Closed.
- Per-site output is three files, so the generator must emit the redirect sibling or
  `redirectSubdomains` has nowhere to land.
- `fastcgi_pass unix:/var/run/php/php7.2-fpm.sock` is the real output shape — proof the
  `phpServer` enum must hold socket paths, not our invented `php8.2-sock` keys.
- `referrerPolicy` is emitted as a `map $uri $ref_policy { … }` keyed on
  `wp-admin|wp-login|xmlrpc.php`, not as a plain `add_header`. Closed enum required.

## 6c. Dependency state

`npm outdated` run 2026-10-08 (Node 22.19.0, npm 11.6.0). Nothing is stale enough to
break anything.

- **Deliberately held at current major:** `typescript` 6.0.3 (7.0.2 exists — the
  native-port line; bumping it will churn every error we are about to fix) and
  `@babel/core` 7.29.0 (8.0.7 exists — transitive via `@rolldown/plugin-babel` for the
  React Compiler preset; a major move changes compiler output under us). Revisit both
  once `tsc -b` is green.
- **`npm update` is safe and needs no `package.json` edit:** `vite` 8.0.12→8.3.4,
  `react`/`react-dom` 19.2.6→19.3.0, `tailwindcss` + `@tailwindcss/vite` 4.3.0→4.3.3,
  `eslint` 10.3.0→10.12.0, `typescript-eslint` 8.59.3→8.71.1, `zustand` 5.0.13→5.0.15,
  `lucide-react` 1.14.0→1.53.0, `radix-ui` 1.4.3→1.7.0 + every `@radix-ui/react-*`,
  `recharts` 3.8.0→3.10.1, `react-resizable-panels` 4.11.0→4.14.3,
  `shadcn` 4.7.0→4.21.4, `tailwind-merge` 3.6.0→3.7.0, `@types/node` 24→26.
- **Already current:** `@monaco-editor/react` 4.7, `reactflow` 11.11.4.
- **Dead in `dependencies` (zero imports in `src/`):** `@phosphor-icons/react`,
  `date-fns`, plus `embla-carousel-react`, `vaul`, `cmdk`, `input-otp`,
  `react-day-picker`, `sonner`, `next-themes` — the last eight are only reachable from
  generated `ui/` primitives we never render.
- **`reactflow` is not actually imported.** Its one textual hit is the string
  `"ReactFlow"` inside a comment at `src/pages/VisualConfigPage.tsx:199`. `recharts`' 11
  hits are all inside the unused `ui/chart.tsx`. Milestone 5 must decide: `reactflow` 11
  is superseded by `@xyflow/react`. Decide *before* writing the logic map, not after.

## 7. Known-bad areas — do not assume these work

**Build, lint and typecheck are GREEN.** Re-verified independently by master on
2026-10-08 @ `61204fe`: `npx tsc -b` → 0, `npm run lint` → 0, `npm run build` → 0.
Do not re-report these as broken. What T2 actually changed:

- **The casing rename** `src/Components` → `src/components`, disk-only via
  `Rename-Item` (two-step; a single case-only rename is a no-op on Windows). Cleared
  21 of the 34 TS errors and produced **zero git churn** — the index already spelled
  the paths lowercase, so the *disk* was the thing that was wrong.
- **`store/store.ts`** — removed a self-referencing `newSite`, hoisted a repeated
  `DEFAULT_STATE.sites[0]` seed, and dropped the duplicate flat-`domain` parameter.
  `addSite` now takes a plain `Partial<Site>`.
- **`store/defaults.ts`** — deleted the stray top-level `domain` key (grep-verified zero
  readers; every real read is `site.server.domain`) and annotated `const DEFAULT_SITE:
  Site` so the compiler checks the whole literal.
- **4 `Select` sites in `per-website-config/{php,routing,logging}-section.tsx`** were
  **native `<select>` with `<option>` children typed as the shadcn `Select`**. The
  slave chose native (rung 4 over rung 2 — a static list of 5–9 strings does not need
  a radix composite) and styled them to the same `h-8` / `border-input` tokens so they
  match the neighbouring shadcn selects in height.
- **`eslint.config.js`** — one scoped override: `files: ['src/components/ui/**']`,
  turning off `react-refresh/only-export-components` and
  `react-hooks/set-state-in-effect`. Nothing under `ui/**` was edited. Correct per
  decision A-B1: they are generated files.
- **`hooks/use-mobile.ts`** — rewritten on `useSyncExternalStore` (it is a media-query
  subscription, not local state). Side benefit: correct on the first paint, so no
  desktop-first-paint `false` flash.
- **`components/FileTree.tsx:15`** — ternary-used-as-statement rewritten as `if/else`.
  This file was **not** in the instruction; it was a real lint error no config override
  could honestly absorb.

**Leftovers still open** (all recorded in `TASKS.md`):

- **4 native `<select>` vs shadcn `Select` across the form.** `global-config/{nginx,
  security}-section.tsx` use the radix composite; `per-website-config/{php,routing,
  logging}-section.tsx` use native. Consistent *within* each screen, not across the app.
  **Deferred by decision A-D12** — not a felt defect; decide when the next section is
  written, when matching costs one file instead of five.
- **`addSite` needs a whole `SiteServerConfig` to change one field.** `Partial<Site>` is
  shallow, so the single call site spreads `DEFAULT_STATE.sites[0].server`. Works today.
  **Deferred by A-D13** until presets are the second caller.
- **`getNextDomain` emits domains containing a space** — `` `${base} (${next})` `` at
  `per-website-config/index.tsx:63`, with the regex at `:48` deliberately matching that
  exact form. **This is not a stray space** (ruled, I17): deleting it makes every site
  after the first silently duplicate. T6 will emit this into a real `server_name`, so the
  *generator string* is the defect — moved to T6 as a product decision, not a cleanup.
- **`ui/carousel.tsx:96` still calls `setState` synchronously in an effect**, hidden by
  the override. Correct today (`carousel` is unrendered); would be a real cascading
  render if someone renders it.

**Placeholder UI (looks finished, is not wired):** `CodeConfigPage` (hardcoded config,
`isValid` frozen `true`, Format/Save buttons do nothing), `VisualConfigPage`
(hand-drawn SVG paths, no data), `AnalyticsPage` (`const healthScore = 85`), every
`global-config/*` and `per-website-config/*` section (they bind to the generator
store, which nothing reads).

**State-shape defect — RE-SCOPED, the old framing was wrong.**
`GlobalConfigState` (`store/types.ts:100-179`) **is** a flat 60-field bag while `Site`
in the same file is nested into 10 objects. That much is real. But master re-measured
the two justifications on 2026-10-08 and **both failed**:

1. *"Nesting deletes the 38 casts."* It does not. All 38 are
   `useGlobalConfigStore((s) => s.someField) as boolean` — casts on selectors reading
   fields that are **already correctly typed** (`dockerfile: boolean`, `gzipCompression:
   boolean`). Grep-verified: **zero** casts sit on a union-typed field. The casts are
   redundant today, flat or nested. **They can be deleted right now for free.**
   **Proven, not argued:** T3 deleted **44** (38 measured + 6 `as number` missed) and
   `tsc` stayed green after every batch. Under nesting, `as boolean` on a `boolean` is
   still legal — **all 44 would have survived.** The causal link did not exist.
2. *"The generator needs dotted paths."* It does not. `updateField` is called **189
   times** across the 9 `global-config` sections, every one a flat key. Dotted paths
   would require editing all 189 call sites to buy nothing the generator needs — it
   *reads* the state object, it does not write it field-by-field.

So nesting is **not** a generator prerequisite and is **not** free. It is a large,
high-churn diff whose only real benefit is symmetry with `Site`. Decision A-D11 splits
T3: the casts and enums (cheap, genuinely blocking) go now; the nesting (cosmetic,
touching 189 call sites) is **deferred until something actually needs it**.

**What the generator genuinely cannot do yet — the real T3 blockers. NOW FIXED (`d72d8b2`):**
- `phpServer` held invented keys (`php8.2-sock`, `hhvm`, `tcp`), not real `fastcgi_pass`
  targets, so no generator could expand them. **Now `PhpFpmTarget`** (`types.ts:7-14`) —
  a union whose every member is *exactly* the emitted string, so "a key that is not also
  the output" is unrepresentable. `tcp` dropped (`phpServerCustom` already covers a
  `host:port`); `hhvm` kept with its real path.
- `referrerPolicy` was a bare `string`. **Now `REFERRER_POLICIES`** (`types.ts:34-43`), an
  `as const` array with `ReferrerPolicy` derived from it, and the UI maps the same
  constant — so a 9th value cannot be added to the UI without the type following.
  Upstream still emits this as a **`map $uri $ref_policy`** keyed on
  `wp-admin|wp-login|xmlrpc.php`, not a plain `add_header` — generator work, T6.
- `errorLogLevel` was typed to 5 levels while its own UI rendered 9. **Now
  `ERROR_LOG_LEVELS`** (`types.ts:16-25`, 8 upstream levels) + `SITE_ERROR_LOG_LEVELS`
  (adds `none`). Both UIs map the constant.

**Remaining, deliberately deferred to T6 (I21, I23):** the unions are **not enforced at
the write site** — `updateField`'s value param is `string | number | boolean | unknown`,
which collapses to `unknown`, so `updateField("referrerPolicy", "banana")` compiles. They
do constrain `defaults.ts`, which is annotated and therefore checked, and that is what the
generator reads. The four expiration fields, `pythonSocket`, `contentSecurityPolicy` and
`permissionsPolicy` remain bare `string`.

**Live defect introduced by T3 (I22 / T14):** the global `error_log level` RadioGroup is
8 items in `className="flex gap-4"` with **no `flex-wrap`** (`global-config/
logging-section.tsx:61`), inside a `SectionRow` that is `grid-cols-4` with the control in
`col-span-3`. Measured over CDP: content is a flat **568px**, so it overflows below
1024 — at 1024 `alert`/`emerg` are clipped, at 768 four of eight are. The page itself does
not overflow, so the clipped options are **unreachable, not merely off-screen**.

**The app does not support the declared 360px floor at all (I24 / T15).** Measured at
360px: Workspace left panel is a fixed **200px**, leaving a 156px content panel; minus the
glass-panel's `p-6` that is ~108px; `SectionRow`'s `grid-cols-4` then splits it into an
**8px label and a 32px control**. The Header's children (`w-36` + `w-36` + a 500px nav)
total **788px** in a 360px bar. All 12 field rows are affected and 4 already clip in
sections no task touches. A `flex-wrap` class cannot rescue a 32px cell — verified by
injecting it at the DOM level and re-measuring. See decision A-D17.

**Enum drift — the generator cannot be written honestly until these are fixed.**
`referrerPolicy`, `errorLogLevel` (both global and per-site), `sslProfile`, `phpServer`,
`routing.index`, `workerProcesses`, `typesHashMaxSize`, `typesHashBucketSize` are either
bare `string` or **truncated**: our `errorLogLevel` allows
`debug|info|notice|warn|error`, upstream is `debug|info|notice|warn|error|crit|alert|emerg`
(per-site also has `none`). `phpServer`'s `<option>` values are invented short keys
(`php8.2-sock`, `hhvm`, `tcp`), not the real `fastcgi_pass` socket paths — the generator
has no way to expand them. See `docs/competitive-options.md` §5.

**Default-value drift vs nginxconfig.io** (our defaults are wrong, not just different):
`modularizedStructure` and `symlinkVhost` are `false` (upstream `true`),
`clientMaxBodySize` is `1` (16), `redirectSubdomains` is `false` (`true`), all four cache
expirations are `max` (`7d`), `accessLogParameters` is `combined`
(`buffer=512k flush=1m`). `dockerTweaks` is a dead checkbox — upstream exposes it as an
"Apply Docker tweaks" button that mutates `nginx.user`, `nginx.pid` and `dockerfile`.

**No gating and no mutual exclusion.** Nine Cloudflare log fields gate on `cloudflare`;
`symlinkVhost` on `modularizedStructure`; `cdnSubdomain` on `wwwSubdomain`;
`securityTxtPath` on `securityTxt`; the global HTTPS / Python / reverse-proxy tabs gate
on a site enabling that feature. None of this is enforced. Upstream also force-disables
PHP when reverse proxy or Python is on (and vice versa); we let a site be all three at
once. `limitReq` is a bare boolean — there are no zone/rate/burst fields at all.

**`origin/main`'s parser is not salvageable as-is.** Its tokenizer drops `;` without
emitting a token, but `parseBlock`/`parseConfig` loop on
`tokens[i].type !== 'SEMICOLON'` — always true, so every simple directive consumes the
remainder of the file. Needs a rewrite if we want it.

---

## 8. Invariants

1. **Never mutate git.** No commit/merge/rebase/push/checkout/stash/config. Read-only
   `git status` / `git log` / `git diff` / `git show` are fine.
2. **Never force implementation.** Blocker → stop, write it in your response file.
3. **All coordination artifacts are `.md`.** No JSON/YAML sidecars.
4. **Ponytail always.** The ladder: don't build it → already in the repo → stdlib →
   native platform → installed dep → one line → minimum code. Deletion over addition.
   Fewest files. Mark deliberate corners `# ponytail: <ceiling> — upgrade when <…>`.
5. **Clean, breathable UI/UX.** Reuse the tokens in `src/index.css` — do not
   introduce a parallel palette. `docs/*/code.html` is the visual baseline.
6. **Self-review before `DONE`.** Run lint + typecheck, then re-read your diff against
   the four checks in `AGENTS.md`. Leftovers go in `## New issues / edge cases`.
7. **Privacy is the product.** No network calls, no telemetry, no config leaves the
   browser. Nothing may add a backend.
8. Answer the role question (`M` / `S` / `A`) before doing anything — **unless the human
   already named the role in their prompt, which is itself the answer.** If the prompt
   opens with "master" / "slave" / "agent" (or `M` / `S` / `A`), print no roster, ask no
   question, state the role in one line and begin. Inferring the role from the prompt's
   *content* is still forbidden — "fix the lint errors" still gets the roster. Full rule
   and its one exception (naming `SLAVE` with no open instruction) in `AGENTS.md`
   § Role Roster. There is one slave; sequential work is expressed as numbered **phases**
   inside the single `agent-docs/instructions/slave.md`, never as extra instruction files.

---

## 9. Current state and next tasks

`PLAN.md` / `CHECKLIST.md` claim **Milestone 1 complete, Milestones 2–8 untouched.**
The docs are identical on both branches — never diverged.

Reality check against the tree: Milestone 1 is genuinely there, and pieces of
Milestone 2 (`FileTree`, `/etc/nginx` tree, `createNewConfig`, `importFiles`,
`selectFile`) and Milestone 7 (`UIConfigPage` sections) also exist beyond what the
checklist credits. Milestones 3–6 are mockups. Nothing generates nginx text and
nothing parses it.

**Next tasks, in order.** Tasks 1 and 2 were re-sequenced on 2026-10-08 after the
competitive-parity audit (`docs/competitive-options.md`): the flat-vs-nested store fix
moved *ahead* of the generator because the generator reads that bag directly, and
writing it against the flat shape means writing it twice.

**T2 is DONE and verified** (`61204fe`: `tsc -b` 0, `lint` 0, `build` 0). Nothing
below is blocked on it any more.

**T3 is DONE and verified** (`d72d8b2`: `tsc -b` 0, `lint` 0, 0 casts remaining,
`App.css` deleted, 9 defaults corrected, 3 enums closed). Its 3b sub-task — the
`getNextDomain` space — was **ruled a product decision and moved to T6**; see I17 in
`TASKS.md`. One regression it introduced is now the next task.

**Next tasks, in order.**

1. **T14 — fix the `error_log level` RadioGroup regression.** T3 widened the global
   logging UI from 5 levels to 9 in `className="flex gap-4"` with no `flex-wrap`, inside
   a `grid-cols-4` `SectionRow` whose control column is `col-span-3`
   (`global-config/logging-section.tsx:61`). Nine radio+label pairs do not fit that width
   and will **clip, not wrap**. Needs a browser to verify — master has not seen it
   rendered. Small, self-contained, and it is a live Rule 5 failure, so it goes first
   rather than being buried under feature work.
2. **Add the missing option surface: Presets, then Setup.** Presets = the nine bundles
   in `docs/competitive-options.md` §3.2, in a **collapsible panel above the per-site
   tabs** per A-D10, with the tab-strip variant kept as a static sample under `docs/`.
   Setup = Download (zip + base64), SSL, Certbot, Go live — SRS §3.4's "Go Live
   Checklist", which is also where `CodeConfigPage`'s dead Format/Save buttons belong.
   Presets will be the second caller of `addSite`, which is the trigger for fixing its
   shallow-`Partial` signature (§7, A-D13).
3. **Generate nginx files from the form store** (T6). One pure function,
   `Site[] + global state → files`, living next to the UIConfig store, with one
   assert-based self-check. **It writes files into the file tree, it does not return one
   string** — see the A-D9 rules in §5. It reads the (flat, fine) state object directly.
   T6 also inherits three things T3 deliberately left: the `getNextDomain` space
   (I17), write-site enforcement of the closed enums (I21), and the remaining bare
   `string` fields (I23).
4. **Parser worker, written fresh** (T7). Tokenizer that emits `SEMICOLON`, directive
   tree, feeding `setParsedConfig` + `setSyntaxErrors`. **It consumes the whole file
   tree**, and its AST is the single input to both the code view and the visualizer
   (A-D9). Then wire `CodeConfigPage` to the store so editing the file and editing the
   form are the same state.

**Answers to questions left open by T3** (ruled by master, 2026-10-08 — recorded in
`TASKS.md` as A-D11 through A-D14):

- **Do not nest `GlobalConfigState`.** Not a generator prerequisite (measured), and not
  free (189 call sites). Proved empirically: all 44 casts were redundant and are now
  deleted; nesting would have left every one of them standing. Revisit only if a second
  writer appears that needs dotted paths.
- **`getNextDomain`'s space is not stray** — the generator string is the defect. Ruled,
  verified, and moved to T6 rather than "fixed" into a silent duplicate-domain bug.
- **The global logging UI widening stays** (6th file, outside the stated scope) — leaving
  the type at 9 with a 5-item UI would make the type lie in the other direction.
- **The closed enums are not enforced at the write site.** `updateField`'s value param is
  `string | number | boolean | unknown` → `unknown`, so `updateField("referrerPolicy",
  "banana")` compiles. The unions constrain `defaults.ts` (annotated, therefore checked),
  which is what the generator needs. Write-site enforcement is a mapped type, deferred to
  T6 (I21).
2. **Add the missing option surface: Presets, then Setup.** Presets = the nine bundles
   in `docs/competitive-options.md` §3.2, in a **collapsible panel above the per-site
   tabs** per A-D10, with the tab-strip variant kept as a static sample under `docs/`.
   Setup = Download (zip + base64), SSL, Certbot, Go live — SRS §3.4's "Go Live
   Checklist", which is also where `CodeConfigPage`'s dead Format/Save buttons belong.
   Note: presets will be the second caller of `addSite`, which is the trigger for
   fixing its shallow-`Partial` signature (§7).
3. **Generate nginx files from the form store** (T6). One pure function,
   `Site[] + global state → files`, living next to the UIConfig store, with one
   assert-based self-check. **It writes files into the file tree, it does not return one
   string** — see the A-D9 rules in §5. It reads the (flat, fine) state object directly.
4. **Parser worker, written fresh** (T7). Tokenizer that emits `SEMICOLON`, directive
   tree, feeding `setParsedConfig` + `setSyntaxErrors`. **It consumes the whole file
   tree**, and its AST is the single input to both the code view and the visualizer
   (A-D9). Then wire `CodeConfigPage` to the store so editing the file and editing the
   form are the same state.

**Answers to questions left open by T2** (ruled by master, 2026-10-08 — recorded in
`TASKS.md` as A-D11/A-D12):

- **Do not nest `GlobalConfigState`.** Not a generator prerequisite (measured), and not
  free (189 call sites). Revisit only if a second writer appears that needs dotted paths.
- **`addSite`'s shallow `Partial<Site>` is fine until presets land.** One call site
  today, and it works. Presets will be the second caller; that is when it gets fixed.
- **Leave the native-vs-shadcn `Select` split for now** (A-D12). It is internally
  consistent per screen. It becomes a real problem the moment a *new* section has to
  pick one — decide then, and decide once.
- **Delete `src/App.css`** — dead, zero references. Fold into task 1; it is a deletion.

Milestone 5 (`reactflow`) and Milestone 6 (audit rules) come after the parser exists —
both need parsed input, and both are currently hardcoded fakes that will have to be
replaced rather than extended. The visualizer **reads the parser's AST** rather than
building its own model (A-D9), so Milestone 5 is a rendering task, not a data-modelling
one. Decide `@xyflow/react` vs `reactflow` 11 before task 5 of Milestone 5 begins (§6c).

**Deliberately deferred, do not "fix":** the 47 unused shadcn files in
`components/ui/`. They are one directory, tree-shaken out of the bundle, and they are
the design system — `npx shadcn add dialog` would be needed again. Also
`pages/UIConfigPage/store/` nesting: a store inside a page folder is odd, but moving it
is churn against a file that hasn't been written yet. Both recorded as decision A-D6.