# TASKS.md — Tracker (master-owned)

Status of implementation work. `PLAN.md` / `CHECKLIST.md` are the original plan and
have never diverged between branches; this file is the working tracker.
Context lives in `CONTEXT.md`. Open questions live in `BLOCKERS.md`.

---

## TASK STATUS

| id | Task | Milestone | Status |
|---|---|---|---|
| T1 | Landing page + 4-tab shell + reset + zustand store | 1 | DONE |
| **T2** | **Build + lint green** | — | **DONE** @ `61204fe` — verified by master |
| T2a | Casing fix: `src/Components` → `src/components` (21 of 34 TS errors) | — | DONE — disk rename, zero git churn |
| T2b | Fix the 13 real TS errors across 6 files | — | DONE |
| T2c | Lint green: scoped `ui/**` override + `use-mobile.ts` | — | DONE |
| **T3** | **Delete 38 redundant casts + close the 3 blocking enums + default drift** | 7 | **TODO (next)** — re-scoped by A-D11 |
| T3x | ~~Nest `GlobalConfigState`~~ | 7 | **DEFERRED** — false premise, see A-D11 |
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

### A-D11 — 2026-10-08 — Do **not** nest `GlobalConfigState`; the old T3 rested on false premises
**Question:** CONTEXT.md and `docs/competitive-options.md` §5 item 2 both said the flat
60-field `GlobalConfigState` must be nested before the generator can be written,
because (a) it deletes the 38 `as boolean`/`as string` casts and (b) it gives
`updateField` dotted paths.

**Decision: no. Both justifications are false, measured on 2026-10-08.**

**Why (a) fails:** every one of the 38 casts is
`useGlobalConfigStore((s) => s.field) as boolean` — a cast on a selector reading a field
that is **already correctly typed**. Grep-verified: **zero** casts sit on a union-typed
field. They are pure redundancy and can be deleted today, with or without nesting.
Nesting would leave all 38 in place, because `as boolean` on a `boolean` is legal
whether or not the parent object is nested. The claimed causal link does not exist.

**Why (b) fails:** `updateField` has **189 call sites** across the 9 `global-config`
sections, every one a flat key. Dotted paths would mean editing all 189 to buy nothing:
the generator **reads** the state object, it does not write it field-by-field. Dotted
paths are a writer-side convenience this codebase does not need.

**So T3 is re-scoped** into what actually blocks the generator, and the nesting is
deferred. The real blockers are the three enums whose *values* are wrong — `phpServer`
holds invented keys (`php8.2-sock`, `hhvm`, `tcp`) that cannot expand into a real
`fastcgi_pass unix:/var/run/php/php7.2-fpm.sock`; `referrerPolicy` is a bare `string`
and upstream emits it as a `map $uri` block; `errorLogLevel` is typed to 5 levels while
its own UI already renders 9 (`crit|alert|emerg` missing). Those are data fixes, and
they are cheap. The nesting is a 189-site diff buying symmetry — not now.

**Revisit when:** a *second writer* of individual global fields appears that needs
dotted paths. Presets (T4) are the first candidate, and they write whole sections, not
individual fields, so they likely will not trigger it either.

### A-D12 — 2026-10-08 — Leave the native-vs-shadcn `Select` split; it is per-screen consistent
**Question (S-I2 from the T2 response):** `global-config/{nginx,security}-section.tsx`
use the radix `Select` composite; `per-website-config/{php,routing,logging}-section.tsx`
now use native `<select>`. Same height, same tokens, different popup. Unify?

**Decision: not now.** Unifying means rewriting working native markup into radix
composites (or vice-versa) across 5 files, and the two families are consistent *within*
each screen — a user never sees both in one view. It is not currently a defect a user
can feel.

**Why defer rather than fix:** the deciding question is "which is the product standard",
and that answer should be given once, by whoever writes the *next* section — at that
moment the cost of matching it is one file, versus five files today for no felt gain.

**Revisit when:** a new section is added, or a human reports the popups looking
inconsistent. Then pick one and make it the rule.

### A-D13 — 2026-10-08 — `addSite`'s shallow `Partial<Site>` stays until presets need it
**Question (S-I1):** `addSite(site?: Partial<Site>)` is shallow, so changing one site
field requires spreading a whole seed section. `DeepPartial` or an
`addSite({ domain })` overload?

**Decision: no change now.** One call site exists and it works — the presets pass is
the first caller that will want several overridden fields at once, and that pass is the
right place to settle the signature, with a second caller in hand.

**Why:** ponytail rung 1 — it does not need to exist yet, and a `DeepPartial` helper is
a new type used once. Rule 4's "add when the second caller appears" applies.

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
| ~~I1~~ | ~~`npm run build` fails, 34 TS errors~~ | — | **FIXED → I13** |
| ~~I2~~ | ~~`npm run lint` fails, 13 errors~~ | — | **FIXED → I14** |
| I8 | `GlobalConfigState` is a flat 60-field bag; `Site` is nested | `UIConfigPage/store/types.ts:100-179` | **DEFERRED — A-D11, false premise** |
| I9 | Enum types bare `string` or truncated; `phpServer` holds fake keys not socket paths | `types.ts`, `php-section.tsx:47-55` | open → T3 |
| I3 | `CodeConfigPage` hardcodes its config; Format/Save do nothing | `pages/CodeConfigPage.tsx` | open → T8 |
| I4 | `VisualConfigPage` is hand-drawn SVG, no data | `pages/VisualConfigPage.tsx` | open → T10 |
| I5 | `AnalyticsPage` health score is `const 85` | `pages/AnalyticsPage.tsx` | open → T11 |
| I6 | Form store and app store are disconnected — nothing generates or parses nginx | `src/store` ↔ `pages/UIConfigPage/store` | open → T6/T7 |
| I7 | 4 unused setters: `setParsedConfig`, `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore` | `store/useAppStore.ts` | open → T7 |
| I10 | ~~Committed mojibake in 3 files~~ | — | **CLOSED — never existed** |
| I15 | 4 native `<select>` vs shadcn `Select` across the form | `per-website-config/{php,routing,logging}-section.tsx` | open → **A-D12**, deferred |
| I16 | `addSite` needs a whole `SiteServerConfig` to change one field | `store/store.ts:21`, `types.ts:187` | open → **A-D13**, deferred to T4 |
| I17 | `getNextDomain` regex has a stray space; works by accident | `per-website-config/index.tsx:48` | open, trivial |
| I18 | `ui/carousel.tsx:96` calls `setState` in an effect; hidden by override | `components/ui/carousel.tsx:96` | open — correct while unrendered |
| I19 | `src/App.css` is dead — zero references | `src/App.css` | open → fold into T3 |
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

### I13 — 2026-10-08 — `tsc -b` exit 0 (was 34 errors)
**Root cause:** two causes, wildly different sizes. 21 errors were one bug — the
working tree said `src/Components` while the git index and every alias said
`src/components`, so `tsconfig.app.json`'s `include: ["src"]` pulled each file into the
program twice under two spellings (`TS1261`/`TS1149`). The other 13 were real and local:
a self-referencing object literal in `store.ts`, a stray top-level `domain` key in
`defaults.ts` masking a second `certType` widening fault, and 4 `Select` call sites
typed as the shadcn composite but written as native `<select>`/`<option>`.
**Fix:** two-step `Rename-Item` on disk (a one-step case-only rename is a no-op on a
case-insensitive filesystem) — **zero git churn, proving the index was already correct**.
Then import/ordering/narrowing fixes in 6 files, each at source. No `any`, no `as`, no
`@ts-ignore`. Verified: `npx tsc -b` → 0, `npm run build` → 0.

### I14 — 2026-10-08 — `npm run lint` exit 0 (was 13 errors)
**Root cause:** 11 of 13 were the linter complaining about **generated** shadcn
primitives (`react-refresh/only-export-components`, plus one `set-state-in-effect` in
`ui/carousel.tsx:96`) — hand-editing vendored code to satisfy an HMR rule is backwards
and the next `shadcn add` overwrites it. One was a real hook whose `useState`+effect
shape fought the rule. One (`FileTree.tsx:15`, a ternary used as a statement) was not in
the instruction at all.
**Fix:** one 8-line scoped eslint override for `src/components/ui/**` (two rules, one
glob, no code touched), `use-mobile.ts` rebuilt on `useSyncExternalStore` — which is
what the hook actually is, a media-query subscription, and which also made it correct on
the first paint — and one ternary → `if/else`. Net: +8 lines of config, −12 lines of app
code. Verified: `npm run lint` → 0, `tsc -b` still 0, `build` still 0.

---

## INSTRUCTIONS ISSUED

| slot | title | status | structure |
|---|---|---|---|
| `instructions/slave.md` | build hygiene (reissued) | **DONE** | 2 sequential phases — both green |
| `instructions/slave.md` | casts + enum closure + default drift | **OPEN** | 3 sequential phases (T3, re-scoped) |

Closed by the second issue:

- **Phase 1 grew.** It previously named 2 files and 4 errors. It now covers 6 files and
  all 34 errors, because 21 of them were one casing bug misfiled as "shadcn primitives
  and path-alias resolution noise" in the old `CONTEXT.md` §7.
- **The old third phase (mojibake) was deleted** — its premise was false, see I10.
- **The casing fix was specified as a filesystem rename, not `git mv`.** Measured: the
  git index already spelled all 62 paths `src/components/` (lowercase) while the working
  tree was `src/Components`. The *disk* was wrong, so a plain two-step rename agrees them
  with **zero git churn** — and needs no commit from the human, satisfying Rule 1 by not
  using `git mv` at all.

Issued 2026-10-08 (third session). T3 re-scoped by A-D11 — the two-phase build-hygiene
shape was kept, but the *content* of what it fixes changed: 3 phases now, and the
nesting is gone.

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
