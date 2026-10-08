# CONTEXT.md — Application Context (authoritative)

Read this file first. It is the handoff state. If a fact here is wrong, fix it in the
same change that makes it wrong. A session that cannot rebuild the app from this file
alone has failed its main duty.

Last verified: 2026-10-08, branch `implementation` @ `e143fcc`.

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
                            plus NginxConfigReference.md and design.md — VISUAL BASELINE
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
- Actions: `updateField`, `resetToDefaults`, `addSite`, `removeSite`,
  `updateSiteField` (supports dotted paths like `"https.certType"`)
- `defaults.ts` holds `DEFAULT_STATE` with one `site-1` / `example.com` seed.

**The gap:** the form store never produces nginx text, and `rawConfig` never flows
into the form. `CodeConfigPage` renders its own hardcoded string; `setParsedConfig`,
`setSyntaxErrors`, `setSecurityAudits`, `setHealthScore` are **defined but called
nowhere**. There is no parser in this tree at all. This is the core missing wiring
of the entire product.

---

## 6. Nginx config model / parser entry points

**None exist on this branch.** `NginxConfig { raw, ast }` in `useAppStore.ts` types
`ast` as `unknown`. Nothing populates it.

`origin/main` has `src/Workers/nginxParser.worker.ts` (327 lines): a hand-rolled
tokenizer → `NginxDirective` tree → ReactFlow nodes/edges + a health score. **It is
broken** — see §7. Treat it as a design sketch, not a source of truth.

Directive reference for building the parser lives in `docs/NginxConfigReference.md`.

---

## 7. Known-bad areas — do not assume these work

**Build and lint are red right now.** Do not report a change as verified without
running them, and do not be alarmed by pre-existing failures:

- `npx tsc -b` → **34 errors**.
  - `src/pages/UIConfigPage/store/store.ts:35` — `TS2448`/`TS2454`: `newSite` is
    referenced inside the object literal that declares it; `TS2339`: `site.domain`
    does not exist on `Partial<Site>` (the domain lives at `site.server.domain`).
  - `src/pages/UIConfigPage/store/defaults.ts:163` — `TS2322`: `certType` widens to
    `string`, needs `as const` or an explicit literal type.
  - The remainder are the shadcn `ui/` primitives and path-alias resolution noise.
- `npm run lint` → **13 errors**: ~11 are
  `react-refresh/only-export-components` inside generated `src/Components/ui/*`
  files, plus `react-hooks/set-state-in-effect` in `src/hooks/use-mobile.ts`.

**Placeholder UI (looks finished, is not wired):** `CodeConfigPage` (hardcoded config,
`isValid` frozen `true`, Format/Save buttons do nothing), `VisualConfigPage`
(hand-drawn SVG paths, no data), `AnalyticsPage` (`const healthScore = 85`), every
`global-config/*` and `per-website-config/*` section (they bind to the generator
store, which nothing reads).

**`origin/main`'s parser is not salvageable as-is.** Its tokenizer drops `;` without
emitting a token, but `parseBlock`/`parseConfig` loop on
`tokens[i].type !== 'SEMICOLON'` — always true, so every simple directive consumes the
remainder of the file. Needs a rewrite if we want it.

**Case-sensitivity:** `src/Components` (capital C) vs the `@components` alias
(`./src/components`). Fine on Windows, breaks on Linux CI.

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

**Next three tasks, in order:**

1. **Unbreak the build.** Fix the 4 real type errors in
   `src/pages/UIConfigPage/store/{store,defaults}.ts` so `tsc -b` passes, then scope an
   eslint override for the 11 `react-refresh` errors in generated `ui/` files (correct
   — they're generated code, do not edit them). Issued as 3 phases in
   `agent-docs/instructions/slave.md`. Nothing else is verifiable until this is green.
2. **Generate nginx text from the form store.** One pure function,
   `Site[] + global state → nginx.conf string`, living next to the UIConfig store,
   with one assert-based self-check. This is the "Generator" pillar and the thing that
   makes `updateField`/`updateSiteField` mean anything.
3. **Parser worker, written fresh.** Tokenizer that emits `SEMICOLON`, directive tree,
   feeding `setParsedConfig` + `setSyntaxErrors`. Then wire `CodeConfigPage` to
   `rawConfig` so editing the file and editing the form are the same state.

Milestone 5 (`reactflow`) and Milestone 6 (audit rules) come after the parser exists —
both need parsed input, and both are currently hardcoded fakes that will have to be
replaced rather than extended.