# CONTEXT.md — Application Context (authoritative)

Read this file first. It is the handoff state. If a fact here is wrong, fix it in the
same change that makes it wrong. A session that cannot rebuild the app from this file
alone has failed its main duty.

Last verified: 2026-10-08, branch `implementation` @ `b835b0d`.

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
Note the **capital-C `Components`** directory while the alias points at lowercase
`./src/components` — works on Windows, will break a case-sensitive CI. Flagged as a
known issue, not yet fixed.

---

## 4. Commands (verified, copy-pasteable)

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build   -- CURRENTLY FAILS, see §7
npm run lint      # eslint .               -- CURRENTLY FAILS, see §7
npx tsc -b        # typecheck only
npm run preview   # serve the production build
```

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

**Build and lint are red right now.** Do not report a change as verified without
running them, and do not be alarmed by pre-existing failures:

- `npx tsc -b` → **34 errors**, and the distribution matters:
  - **21 of 34 are `TS1261`/`TS1149` — one bug.** The working tree has `src/Components`
    (capital C); git tracks `src/components`, and `vite.config.ts` aliases `@components`
    → `./src/components`. `tsconfig.app.json` includes `src`, so both spellings enter the
    program and tsc reports each file twice. This is **red on Windows right now**, not a
    "will break on Linux CI" nit as previously recorded. One
    `git mv src/Components src/components` (git is human-run; we never touch git) clears
    21 errors.
  - `src/pages/UIConfigPage/store/store.ts:35` — `TS2448`/`TS2454`: `newSite` is
    referenced inside the object literal that declares it; `TS2339` ×2: `site.domain`
    does not exist on `Partial<Site>` (the domain lives at `site.server.domain`).
  - `src/pages/UIConfigPage/per-website-config/index.tsx:70` — `TS2353`: same
    `domain`-on-`Partial<Site>` mistake at the `addSite` call site.
  - `src/pages/UIConfigPage/store/defaults.ts:163` — `TS2322`: `certType` widens to
    `string`, needs `as const` or an explicit literal type.
  - `src/pages/UIConfigPage/per-website-config/logging-section.tsx:111,124` — `TS2552`:
    `Select` is used but never imported; `:113` `TS7006` implicit `any` follows from it.
  - `per-website-config/{php-section,routing-section}.tsx` — `TS2322` ×3 on
    `onValueChange={(v) => …}` against a `Select` whose children carry no `value` prop.
  - The remainder are shadcn `ui/` primitive noise.
- `npm run lint` → **13 errors**: ~11 are
  `react-refresh/only-export-components` inside generated `src/Components/ui/*`
  files, plus `react-hooks/set-state-in-effect` in `src/hooks/use-mobile.ts`.

**Placeholder UI (looks finished, is not wired):** `CodeConfigPage` (hardcoded config,
`isValid` frozen `true`, Format/Save buttons do nothing), `VisualConfigPage`
(hand-drawn SVG paths, no data), `AnalyticsPage` (`const healthScore = 85`), every
`global-config/*` and `per-website-config/*` section (they bind to the generator
store, which nothing reads).

**State-shape defect (the one that matters for modularity/SOLID):**
`GlobalConfigState` (`store/types.ts:100-176`) is a **flat 60-field bag** — HTTPS,
Security, Logging, NGINX, Docker and Tools fields all sit at the same level, separated
only by `// HTTPS section` comments — while `Site` in the same file is properly nested
into 10 objects. Two consequences already visible in the tree: 38 `as boolean` /
`as string` casts across the section components (22 + 16), and `updateSiteField` supports
dotted paths (`"https.certType"`) while `updateField` does not. The generator function
(Task 2) reads this bag directly, so nesting it is a prerequisite, not a cleanup.

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
8. Answer the role question (`M` / `S` / `A`) before doing anything. There is one
   slave; sequential work is expressed as numbered **phases** inside the single
   `agent-docs/instructions/slave.md`, never as extra instruction files.

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

1. **Unbreak the build.** 21 of 34 `tsc` errors are one `src/Components` vs
   `src/components` casing bug (§7) — that fix is a `git mv`, which is human-run.
   The remaining 13 are real and ours: 4 in `store/{store,defaults}.ts`, 1 at the
   `addSite` call site in `per-website-config/index.tsx:70`, 2 `Select` imports +
   1 implicit `any` in `per-website-config/logging-section.tsx`, 3 `Select` `value`
   prop errors in `php-section.tsx` / `routing-section.tsx`. Then scope an eslint
   override for the 11 `react-refresh` errors in generated `ui/` files (correct —
   they're generated code, do not edit them) and the one `set-state-in-effect` in
   `hooks/use-mobile.ts`. Nothing else is verifiable until this is green.
2. **Nest `GlobalConfigState`, fix the enum types and default drift.** Make the global
   state mirror `Site`'s nested shape (`https: {…}`, `security: {…}`, …) so
   `updateField` gets dotted paths. Close the enum types (`errorLogLevel`,
   `referrerPolicy`, `sslProfile`, `phpServer`, `index`, `workerProcesses`,
   `typesHash*`) and correct the drifted defaults listed in §7. This deletes the 38
   `as boolean`/`as string` casts as a side effect rather than as a chore.
3. **Add the missing option surface: Presets, then Setup.** Presets = the nine bundles
   in `docs/competitive-options.md` §3.2, in a **collapsible panel above the per-site
   tabs** per A-D10, with the tab-strip variant kept as a static sample under `docs/`.
   Setup = Download (zip + base64), SSL, Certbot, Go live — SRS §3.4's "Go Live
   Checklist", which is also where `CodeConfigPage`'s dead Format/Save buttons belong.
4. **Generate nginx files from the form store** (T6). One pure function,
   `Site[] + global state → files`, living next to the UIConfig store, with one
   assert-based self-check. **It writes files into the file tree, it does not return one
   string** — see the A-D9 rules in §5. Only sensible *after* task 2.
5. **Parser worker, written fresh** (T7). Tokenizer that emits `SEMICOLON`, directive
   tree, feeding `setParsedConfig` + `setSyntaxErrors`. **It consumes the whole file
   tree**, and its AST is the single input to both the code view and the visualizer
   (A-D9). Then wire `CodeConfigPage` to the store so editing the file and editing the
   form are the same state.

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