# Response — Agent — context rebuild + branch divergence analysis
Date: 2026-10-08
Status: DONE

## User request
1. Create `agent-docs/` folder.
2. Check how `main` differs from the current branch (`implementation`).
3. Compare `main`'s `PLAN.md` / `CHECKLIST.md` / `docs/` against this branch.
4. If nothing unusual, build the context file from the current branch.

## Plan approved
Create `agent-docs/{CONTEXT,TASKS,BLOCKERS}.md`; analysis first, then the context file.
Stated explicitly that the plan was: report the divergence, recommend against merging,
then write `CONTEXT.md`. User answered "go ahead".

## What I did
- `agent-docs/CONTEXT.md` — new. 9 sections: what the app is, stack from
  `package.json`, directory map, verified commands, the two-store state model and
  the missing bridge between them, "no parser exists on this branch", known-bad
  areas, 8 invariants, current state + next three tasks.
- `agent-docs/TASKS.md` — new. Task table (T1–T10), `## DECISIONS` (A-D1..A-D3),
  `## ISSUES OPEN` (I1..I9), `## ISSUES FIXED`.
- `agent-docs/BLOCKERS.md` — new. B1–B5 open, none answered.
- Read-only git throughout. No mutating git command was run.

### Branch findings
- Split point `0f4042b` (2026-06-18). `main` ahead by `75ea5fc`, `871dbae`,
  `4a676f7`; `implementation` ahead by `d103c11`, `cdf2b57`, `e143fcc`.
- `git diff origin/main HEAD -- PLAN.md CHECKLIST.md README.md docs/` → **empty**.
  The planning docs are byte-identical on both branches.
- `main`'s extra code: `src/Workers/nginxParser.worker.ts` (327 lines),
  `src/Views/*` (4 views), `src/Stores/useAppStore.ts`, `src/ui/*` (shadcn),
  `SideNavBar.tsx`, `tailwind.config.ts`, `src/App.tsx` rewrite. ~1838 insertions.
- `main`'s App.tsx routes to its own `Views` shell; this branch routes to
  `Workspace`/`LandingPage`. Competing architectures, not a superset.

### Verification
- `git status --short` → clean before and after (no files modified outside
  `agent-docs/`, which is untracked-new).
- `git diff origin/main HEAD -- PLAN.md CHECKLIST.md README.md docs/` → 0 lines.
- `npx tsc -b` → **34 errors** (exit 2). Real ones: `store.ts:35` TS2448/TS2454
  (`newSite` used inside its own initializer) + TS2339 (`site.domain` not on
  `Partial<Site>`), `defaults.ts:163` TS2322 (`certType` widens to `string`).
- `npm run lint` → **13 errors**. ~11 `react-refresh/only-export-components` in
  generated `src/Components/ui/*`, plus `react-hooks/set-state-in-effect` at
  `hooks/use-mobile.ts:14`.
- No test runner exists (no `test` script, no vitest/jest in `package.json`).
- grep for parser/reactflow: `monaco` used only in `CodeConfigPage.tsx`;
  `reactflow` used nowhere despite being installed.

## Self-review (Absolute Rule 6)
- **Broke existing behavior?** Nothing outside `agent-docs/` was touched. Verified
  with `git status --short` (empty tracked changes). Docs are additive.
- **Renders correctly at target widths?** N/A — no UI change. I did re-check that
  `CONTEXT.md` §3 documents the `src/Components` capital-C vs `@components` alias
  mismatch, which is a real responsiveness-adjacent portability bug (fails on
  case-sensitive CI). Logged as I8 rather than silently dropped.
- **Empty/loading/error path present?** CONTEXT.md §7 states plainly that
  `CodeConfigPage.isValid` is frozen `true` and its Format/Save buttons are inert,
  so nobody reads "Valid" as a working validator. Logged as I3/I5.
- **Dead/duplicated/redundant code found:** 4 setters with zero callers
  (`setParsedConfig`, `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore`) —
  logged I7, deliberately not deleted since T4 needs them. `reactflow`, `recharts`
  installed but only faked — logged I9, not removed, since T7/T8 need them.
- **UI/UX standard held (Rule 5)?** No UI touched. CONTEXT.md §9 points at
  `docs/*/code.html` as the baseline and B5 asks whether `docs/design.md` or
  `src/index.css` is authoritative — that ambiguity is flagged, not decided.

## Ponytail audit
- **Skipped:** fixing the 34 TS / 13 lint errors inline. They are a separate
  deliberate task (T2) — bundling a 34-error cleanup into a docs session hides signal.
- **Skipped:** adding a test runner for the context work. Zero logic written.
- **Skipped:** rewriting the parser now. Logged as T4 with the specific defect named.
- **Skipped:** restructuring `agent-docs/instructions/` + `responses/`. Empty dirs
  are pre-decided paths from `AGENTS.md`; no `slave-N.md` files invented.
- **CONTEXT.md updates needed:** none right now — this session created it.

## New issues / edge cases noticed (not in scope now)
- **A-I1** `vite.config.ts` aliases `@components` → `./src/components` (lowercase)
  but the directory is `src/Components`. Resolves on Windows, fails on
  Linux/Vercel. Tracked I8.
- **A-I2** `src/index.css`, `src/store/useAppStore.ts` and `Workspace.tsx` contain
  mojibake in comments — `�"?` where an em-dash/arrow was meant, and
  `"0�?"100"` inside a real *code comment* in the store. Cosmetic, but the encoding
  damage is committed. Worth a sweep when T2 touches these files.
- **A-I3** `src/Components/ui/` holds ~60 shadcn primitives that no app screen
  imports, while the actual screens (`pages/*`) hand-roll their own markup against
  `index.css` tokens. Two UI systems coexist. Worth deciding before M3/M7 grow.
- **A-I4** `AnalyticsPage` hardcodes `const healthScore = 85` and `circumference =
  282.7` — a real dashboard that displays a fiction. Highest-trust risk in the app.
- **A-I5** `PLAN.md` says "Parsing: nginx-config-parser (browser-compatible)" but no
  such dependency is installed and `main`'s hand-rolled worker was abandoned. The
  plan's technical-stack section is stale relative to reality.
- **A-I6** Last real code activity was 2026-06-18; the 3.5 months since are docs
  only. Worth noting so the milestone plan doesn't assume momentum that isn't there.

## Decisions taken
- **A-D1** Do not merge `origin/main` into `implementation`. It is a parallel
  scaffold duplicating `src/pages/*` + `src/store/*`, and it rewrites `App.tsx` to
  its own shell. `main` stays put; nothing is lost.
- **A-D2** `main`'s `nginxParser.worker.ts` is a design sketch, not reusable code.
  Its tokenizer drops `;` without emitting a token while both parse loops test for
  `SEMICOLON` — so every simple directive eats the rest of the file. Reuse the shape,
  rewrite the body.
- **A-D3** Record the 34 TS / 13 lint errors as the known baseline in CONTEXT.md §7
  rather than fixing them opportunistically. Dedicated task T2.

All three are in `agent-docs/TASKS.md` `## DECISIONS`.

## Follow-up session — single-slave protocol + consolidated instruction
User challenged the 3-slave split. Correct — the phases are a dependency chain, not
parallel work, so the split bought sequencing overhead and zero concurrency. Changes:
- `AGENTS.md` rewritten for **one slave**. `Folder of Record` now lists only
  `instructions/slave.md` + `responses/slave.md` + `responses/agent.md`. Roster is
  `M / S / A` with short hands, `SLAVE` reads `instructions/slave.md`.
- Added a "phases, not files" rule to the MASTER section: a single instruction may hold
  numbered phases; each keeps its own acceptance criteria; a phase that hits a blocker
  ends the pass. The test for deserving its own pass is whether it can run concurrently
  without invalidating another pass's verification.
- SLAVE checklist gains step 4 (work phases in order, confirm the gate before a
  dependent phase) and step 8 (one response section per phase, including NOT REACHED).
- Consolidated the three instruction files into `agent-docs/instructions/slave.md`
  (3 phases) and deleted `slave-1/2/3.md`.
- Fixed a pre-existing bug in the AGENT checklist: two steps numbered `5.`
  (`AGENTS.md` → AGENT role, steps 5/6, now 5/6/7/8).

Decisions: A-D4 (one slave, phases not files, order P1→P2→P3), A-B2 in `BLOCKERS.md`.

## Questions
Five in `agent-docs/BLOCKERS.md` — B1 answered, B2 half-answered, B3/B4/B5 open:
- **B1** Override the `react-refresh` rule for generated `src/Components/ui/**`, or
  leave lint red?
- **B2** Build the generator (T3, makes the existing form live) or the parser
  (T4, makes the mockup tabs real) first? Two front ends, one missing middle.
- **B3** Parser in a Web Worker (as `main` attempted) or sync on the main thread for
  configs up to 2000 lines?
- **B4** Pin the `NginxConfig.ast` type before T4, or let T4 define it?
- **B5** Is `docs/design.md` or `src/index.css` authoritative for the palette?