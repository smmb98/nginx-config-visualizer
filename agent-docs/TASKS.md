# TASKS.md — Tracker (master-owned)

Status of implementation work. `PLAN.md` / `CHECKLIST.md` are the original plan and
have never diverged between branches; this file is the working tracker.
Context lives in `CONTEXT.md`. Open questions live in `BLOCKERS.md`.

---

## TASK STATUS

| id | Task | Milestone | Status |
|---|---|---|---|
| T1 | Landing page + 4-tab shell + reset + zustand store | 1 | DONE |
| T2 | Build/typecheck green | — | **IN PROGRESS** — 3 phases, one instruction |
| T2a | Fix 4 real TS errors (`UIConfigPage/store/`) | — | → Phase 1 |
| T2b | Lint green: scoped override + `use-mobile.ts` | — | → Phase 2 |
| T2c | Fix alias casing (breaks case-sensitive CI) | — | → Phase 3 |
| T2d | Fix committed mojibake in 3 files | — | → Phase 3 |
| T3 | Generate `nginx.conf` text from `useGlobalConfigStore` | 7 | TODO (next) |
| T4 | Parser worker → `setParsedConfig` / `setSyntaxErrors` | 3 | TODO |
| T5 | `CodeConfigPage` bound to `rawConfig` | 3 | TODO |
| T6 | Reverse map parsed config → form values | 4 | TODO |
| T7 | ReactFlow real canvas (replace hardcoded SVG) | 5 | TODO |
| T8 | Security audit rules + real health score | 6 | TODO |
| T9 | ZIP export + Go Live checklist | 8 | TODO |
| T10 | Monetization (donate / hosting / sponsorship) | 8 | TODO |

Milestone 2 (`FileTree`, `/etc/nginx` tree, `createNewConfig`, `importFiles`) and
Milestone 7 (`UIConfigPage` sections) are physically present but untracked by
`CHECKLIST.md`. Treat as partial: present, not yet wired to anything downstream.

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

### A-D4 — 2026-10-08 — One slave, phases not files; order P1 → P2 → P3
**Decision:** single `instructions/slave.md` with 3 numbered phases. Typecheck first,
then lint, then portability/encoding. Three parallel instruction files are deleted.
**Why:** the work is a dependency chain, not parallel work. Phase 2 verifies by running
`tsc -b`; Phase 3 verifies with both green. Splitting into files would buy three cold
reads of `CONTEXT.md` and three re-derivations of established context, for zero
concurrency. Phases preserve the ordering guarantee; the per-phase acceptance criteria
are kept separate so Phase 2 is not "done" merely because Phase 3 is. The test for
deserving its own pass: can it run at the same time as another pass without
invalidating its verification? Nothing in the current tree passes that.

### A-D3 — 2026-10-08 — Build/lint red is pre-existing, not a regression
**Decision:** record the 34 TS errors and 13 lint errors in `CONTEXT.md` §7 as the
known baseline rather than fixing them opportunistically inside an unrelated task.

**Why:** mixing an unrelated 34-error cleanup into a feature diff hides the feature's
own signal. T2 exists to do it deliberately.

---

## ISSUES OPEN

| id | Symptom | Where | Status |
|---|---|---|---|
| I1 | `npm run build` fails, 34 TS errors | `UIConfigPage/store/` + shadcn `ui/` | open → T2 |
| I2 | `npm run lint` fails, 13 errors | `Components/ui/*`, `hooks/use-mobile.ts` | open → T2 |
| I3 | `CodeConfigPage` hardcodes its config; Format/Save do nothing | `pages/CodeConfigPage.tsx` | open → T5 |
| I4 | `VisualConfigPage` is hand-drawn SVG, no data | `pages/VisualConfigPage.tsx` | open → T7 |
| I5 | `AnalyticsPage` health score is `const 85` | `pages/AnalyticsPage.tsx` | open → T8 |
| I6 | Form store and app store are disconnected — nothing generates or parses nginx | `src/store` ↔ `pages/UIConfigPage/store` | open → T3/T4 |
| I7 | 4 unused setters: `setParsedConfig`, `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore` | `store/useAppStore.ts` | open → T4 |
| I8 | `src/Components` vs `@components` alias — breaks case-sensitive CI | `vite.config.ts` | open, low |
| I9 | No test runner; `reactflow`/`recharts`/`monaco` installed but only faked | `package.json` | open → T4+ |

## INSTRUCTIONS ISSUED

| slot | title | status | structure |
|---|---|---|---|
| `instructions/slave.md` | build hygiene | OPEN | 3 sequential phases |

One instruction, three phases. The work is a dependency chain — Phase 2 verifies with
`tsc -b`, Phase 3 verifies with both — so splitting it across files would mean three
cold reads of `CONTEXT.md` and three re-derivations of what the previous pass already
established, for zero parallelism. Files are the wrong unit here; phases are the
right one. Answers A-D4 / A-B2.

## ISSUES FIXED

_None yet._