# TASKS.md — Tracker (master-owned)

Status of implementation work. `PLAN.md` / `CHECKLIST.md` are the original plan and
have never diverged between branches; this file is the working tracker.
Context lives in `CONTEXT.md`. Open questions live in `BLOCKERS.md`.

---

## TASK STATUS

| id | Task | Milestone | Status |
|---|---|---|---|
| T1 | Landing page + 4-tab shell + reset + zustand store | 1 | DONE |
| **T2** | **Build + lint green** | — | **IN PROGRESS** — reissued, 3 phases |
| T2a | Casing fix: `src/Components` → `src/components` (21 of 34 TS errors) | — | → Phase 1 |
| T2b | Fix the 13 real TS errors across 6 files | — | → Phase 1 |
| T2c | Lint green: scoped `ui/**` override + `use-mobile.ts` | — | → Phase 2 |
| T3 | Nest `GlobalConfigState` + close enum types + fix default drift | 7 | TODO (next) |
| T4 | Presets — **collapsible panel**, per A-B5 | 7 | TODO |
| T4s | Presets **sample** mockup (tab-strip variant) under `docs/` | — | TODO |
| T5 | Setup sections: Download / SSL / Certbot / Go live | 8 | TODO |
| T6 | Generator writes **files into the tree** (not one string), per A-B6 | 7 | TODO |
| T7 | Parser worker → `setParsedConfig` / `setSyntaxErrors` | 3 | TODO |
| T8 | `CodeConfigPage` bound to the store | 3 | TODO |
| T9 | Reverse map parsed config → form values | 4 | TODO |
| T10 | ReactFlow real canvas (replace hardcoded SVG) | 5 | TODO |
| T11 | Security audit rules + real health score | 6 | TODO |
| T12 | ZIP export + Go Live checklist | 8 | TODO |
| T13 | Monetization (donate / hosting / sponsorship) | 8 | TODO |
| — | Auth / users / database | — | **OUT OF SCOPE — see A-D5** |

Milestone 2 (`FileTree`, `/etc/nginx` tree, `createNewConfig`, `importFiles`) and
Milestone 7 (`UIConfigPage` sections) are physically present but untracked by
`CHECKLIST.md`. Treat as partial: present, not yet wired to anything downstream.

### Sequence change, 2026-10-08 (second session)

The competitive-parity audit (`docs/competitive-options.md`) re-sequenced the middle of
the roadmap. **T3 (nest the global state) now sits ahead of T6 (the generator)** because
the generator reads that flat 60-field bag directly — writing it against the flat shape
means writing it twice. T4 (presets) and T5 (setup) are new, extracted from the audit;
they were previously invisible because we believed the UI tab already covered the
competitors.

---

## DECISIONS

### A-D1 — 2026-10-08 — Do not merge `origin/main` into `implementation`
**Question:** the branches diverged at `0f4042b`; `main` carries ~1838 lines of app
code (parser worker, `Views/`, `src/ui/`, shadcn integration). Merge it?

**Decision:** no merge. `main`'s two code commits are a parallel scaffold, not a
superset — they duplicate the existing `src/pages/*` + `src/store/*` architecture and
rewrite `App.tsx` to route to their own `Views` shell. Reconciling two competing
architectures across ~27 files is exactly the cost we refuse to pay.

**Why:** `main` stays where it is (nothing is lost). If the parser is wanted later,
copy the single worker file in and rewrite it — see A-D2. Merging also violates
Absolute Rule 1 (no git mutations).

### A-D2 — 2026-10-08 — `main`'s parser worker is a sketch, not a lift
**Question:** can `src/Workers/nginxParser.worker.ts` from `main` be reused as-is?

**Decision:** no. Its tokenizer consumes `;` without emitting a `SEMICOLON` token,
while `parseBlock`/`parseConfig` both loop `while (tokens[i].type !== 'SEMICOLON')` —
always true. Every simple directive swallows the rest of the file.

**Why:** it will look like free progress and silently produce garbage ASTs. Reuse the
*shape* (tokenizer → directive tree → flow nodes → health score), rewrite the body.

### A-D4 — 2026-10-08 — One slave, phases not files; order P1 → P2
**Decision:** single `instructions/slave.md` with numbered phases, re-verifying against
each other's real output rather than re-deriving context.
**Why:** the work is a dependency chain, not parallel work. Phase 2's acceptance is
"still green", which is only meaningful if Phase 1 produced that green. Splitting into
files would buy cold reads of `CONTEXT.md` and re-derivations of established context,
for zero concurrency. Phases preserve the ordering guarantee while keeping per-phase
acceptance criteria separate, so Phase 2 is not "done" merely because Phase 3 is. The
test for deserving its own pass: can it run at the same time as another pass without
invalidating its verification? Nothing in the current tree passes that.

The old third phase (mojibake) was **removed** — its premise was false, see I10.

### A-D3 — 2026-10-08 — Build/lint red is pre-existing, not a regression
**Decision:** record the 34 TS errors and 13 lint errors in `CONTEXT.md` §7 as the
known baseline rather than fixing them opportunistically inside an unrelated task.
**Why:** mixing an unrelated 34-error cleanup into a feature diff hides the feature's
own signal. T2 exists to do it deliberately.

### A-D5 — 2026-10-08 — No auth, ever. NPM's user model is a competitive loss.
**Question:** the investigation asked whether the app supports auth and whether the
folder structure needed tidying for SOLID/DRY/KISS/modularity. Should we add auth?

**Decision:** no auth, and do not copy Nginx Proxy Manager's users / permissions /
audit log / database.

**Why:** SRS §4 makes "100% client-side, no config data sent to a server" a headline
competitive advantage, and §2's comparison table scores NPM *down* for needing a DB. We
have zero `fetch`/`axios`/`XMLHttpRequest` in `src/` and zero network calls of any kind.
Adding accounts would trade away the pitch. Auth only becomes relevant if SRS §7
monetization needs optional login, and even then it must never gate the tool.

### A-D6 — 2026-10-08 — Do not reorganise the folder tree
**Question:** should `src/` be tidied for readability, SOLID, DRY, KISS and modularity?

**Decision:** no reorganisation. Three real defects exist and none of them are layout:
(1) the `src/Components` casing bug, (2) `GlobalConfigState` being flat where `Site` is
nested, (3) DRY debt in the 18 section files. Fix those three; leave the tree alone.

**Why specifically:** the 47 unused shadcn primitives in `components/ui/` must NOT be
deleted. They are one directory, tree-shaken out of the bundle, and they *are* the
design system — deleting them means `npx shadcn add dialog` is needed again. Likewise
`pages/UIConfigPage/store/` nesting is odd but moving it is churn against a file that
does not exist yet. Churn before the generator lands is how you lose track of which
change broke what.

### A-D7 — 2026-10-08 — Hold two dependency majors; `npm update` the rest later
**Decision:** do not bump `typescript` to 7.0.2 or `@babel/core` to 8.0.7. Everything
else in `npm outdated` is a semver-compatible `npm update` and can wait.

**Why:** TypeScript 7 is the native-port line and will churn every error T2 is about to
spend a pass fixing; Babel 8 arrives transitively via `@rolldown/plugin-babel` and would
change React Compiler output under us. Both get revisited once `tsc -b` is green. Full
audit in `CONTEXT.md` §6c. Also recorded there: 10 packages in `dependencies` have zero
imports in `src/`, and `reactflow` is not actually imported (its only hit is the string
`"ReactFlow"` inside a comment).

### A-D9 — 2026-10-08 — The file tree is the single source of truth; one AST, two consumers
**Question (B8):** with the target layout being 5 global files + 3 per site, is the flat
`rawConfig` string in `useAppStore` the right shape?

**Decision:** no. The tree is the source of truth; `rawConfig` is a derived mirror of the
active file's `content`, kept only so an editor has one string to bind to. The generator
writes **files into the tree**. The parser consumes the whole tree. **The visualizer reads
the same AST the parser produces** — explicitly, per the user: one AST, two consumers
(code view + logic map), no second representation.

**Why:** the rejected alternative was keeping a combined `nginx.conf` for display plus
modular files for export. Two representations of one config drift. The tree is already
what `FileTree.tsx` renders, so it is the shape the app is built around. And routing the
visualizer off the parser's AST is what stops T10 from inventing its own data model.

**Free now, expensive later:** measured — `rawConfig` and `parsedConfig` have **zero
readers** in `src/` outside `useAppStore.ts`. `CodeConfigPage.tsx:35` still runs its own
`useState(defaultNginxConfig)` with a frozen `isValid = true`. Nothing consumes the
current shape, so nothing can break when it changes.

**Blocks T6, T7, T8.** Recorded in `BLOCKERS.md` as A-B6.

### A-D10 — 2026-10-08 — Presets ship as the upstream collapsible panel; tab strip is the sample
**Question (B6):** collapsible panel above the per-site tabs (upstream), or preset
buttons in the site tab strip?

**Decision:** the **panel is primary and ships**. The tab-strip variant becomes a static
mockup under `docs/` — hardcoded markup, no store import, no live state.

**Why:** nine presets are a **set, not a choice**. Nine checkboxes read as a scannable
matrix with active state visible; nine buttons cannot show that PHP is already applied.
The site tab strip is the most crowded region on screen (domain names, Add, close ✕ per
site), so nine more items there is the worst available placement. Decisively, the panel
surfaces the mutual-exclusion conflict — Frontend, PHP, Django and WordPress are
competing options for the same site slot, and a site cannot be PHP and Python and
reverse-proxy at once. Checkboxes make that legible while choosing; scattered buttons
defer it to a wrong generated config.

**Superseded reasoning, kept for the record:** the first version of this decision picked
the tab strip on the rationale that "a preset is an action, so it belongs beside the
thing it acts on". That held for a single discrete action, but these are closer to a
*profile* — "this is a WordPress site" — which is why upstream ships a column showing
what each toggle sets. The original blocker also asked the user to choose without
stating a preference, so "make yours main" had no referent and the rationale was fitted
after the fact. **When asking a question, lead with the recommendation.**

**Blocks T4 only.** Recorded in `BLOCKERS.md` as A-B5.

### A-D8 — 2026-10-08 — Serverion is not a third source; treat DO as canonical
**Question:** the SRS names three competitors. Does the UI need to cover all three?

**Decision:** no three-way matrix. Serverion *is* `digitalocean/nginxconfig.io` — its
footer reads "Lovingly made by Billiard Sockers and maintained by **DigitalOcean**",
verified against a screenshot of the live tool. It is an **older** fork: it lacks
per-site Restrict and Onion, lacks global Reverse proxy and Docker, and still carries a
global PHP tab DigitalOcean dropped. We are not behind it.

**Why:** a three-way matrix would imply an independence that does not exist and cost
maintenance for nothing. DigitalOcean's `templates/{global,domain}_sections/*.vue` is
the canonical generator vocabulary; Nginx Proxy Manager is the only additive source.
Full audit in `docs/competitive-options.md`. Consequence: our per-site field coverage
(HTTPS 11/11, PHP 9/9, Routing 6/6, Restrict 10/10, Logging 9/9, Server 8/8) is already
complete — the gaps are Presets, Setup, and the NPM-only entities.

---

## ISSUES OPEN

| id | Symptom | Where | Status |
|---|---|---|---|
| I1 | `npm run build` fails, 34 TS errors | 21 are casing, 13 real | open → T2a/T2b |
| I2 | `npm run lint` fails, 13 errors | `components/ui/*` (currently `Components/`), `hooks/use-mobile.ts` | open → T2c |
| I3 | `CodeConfigPage` hardcodes its config; Format/Save do nothing | `pages/CodeConfigPage.tsx` | open → T8 |
| I4 | `VisualConfigPage` is hand-drawn SVG, no data | `pages/VisualConfigPage.tsx` | open → T10 |
| I5 | `AnalyticsPage` health score is `const 85` | `pages/AnalyticsPage.tsx` | open → T11 |
| I6 | Form store and app store are disconnected — nothing generates or parses nginx | `src/store` ↔ `pages/UIConfigPage/store` | open → T6/T7 |
| I7 | 4 unused setters: `setParsedConfig`, `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore` | `store/useAppStore.ts` | open → T7 |
| I8 | `GlobalConfigState` is a flat 60-field bag; `Site` is nested | `UIConfigPage/store/types.ts:100-176` | open → T3 |
| I9 | Enum types bare `string` or truncated; `phpServer` holds fake keys not socket paths | `types.ts`, `php-section.tsx` | open → T3 |
| I10 | ~~Committed mojibake in 3 files~~ | — | **CLOSED — never existed** |
| I11 | 9 dependency packages have zero imports in `src/`; `reactflow` never imported | `package.json` | open → T10 |
| I12 | No gating and no mutual exclusion between PHP / Python / reverse proxy | 18 section files | open → T6 |
| I13 | 14 documented conditional dependencies unenforced (CF log fields, `symlinkVhost`, …) | 18 section files | open → T6 |

**I10 was a false alarm and its removal changed the work.** A previous instruction
carried a phase to "fix mojibake in `src/index.css`, `src/store/useAppStore.ts`,
`src/Components/Workspace.tsx`". Measured on 2026-10-08: the repository contains
**zero U+FFFD replacement characters**. The `��` seen in terminal output is the console
failing to render `─` (U+2500) and `→` (U+2192), which are legitimate box-drawing and
arrow characters in comments. `README.md`'s "dYs?" headings are real emoji
(🚀 🎨 ⚡ 🛤️) rendering as `?` in a non-UTF-8 console, and the file is valid UTF-8. The
phase was deleted rather than left to burn a pass chasing a phantom.

## ISSUES FIXED

_None yet. First fix lands with T2._

---

## INSTRUCTIONS ISSUED

| slot | title | status | structure |
|---|---|---|---|
| `instructions/slave.md` | build hygiene (reissued) | OPEN | 2 sequential phases |

Reissued 2026-10-08 (second session). Same goal as the previous issue, but the phase
list changed materially after measurement:

- **Phase 1 grew.** It previously named 2 files and 4 errors. It now covers 6 files and
  all 34 errors, because 21 of them are one casing bug that was misfiled as "shadcn
  primitives and path-alias resolution noise" in the old `CONTEXT.md` §7. That
  misdiagnosis is what let it survive as low-priority issue I8.
- **Phase 3 was deleted.** Its premise (mojibake) is false — see I10. Two phases remain.
- **The casing fix is now specified as a filesystem rename, not `git mv`.** Measured:
  the git index already spells all 62 paths `src/components/` (lowercase) while the
  working tree is `src/Components`. So the *disk* is the thing that is wrong, the index
  is already right, and a plain directory rename makes them agree with **zero git
  churn**. This also means it needs no commit from the human — Absolute Rule 1 is
  satisfied by not using `git mv` at all.
