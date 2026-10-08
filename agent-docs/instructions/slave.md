# Instruction — Slave — build hygiene
Status: OPEN
Issued: 2026-10-08

## Goal
Make `npm run build` and `npm run lint` both exit 0, then fix the two committed
defects that only bite on other machines.

## Read first
- `agent-docs/CONTEXT.md` §3 (the alias mismatch) and §7 (known-bad areas)
- `agent-docs/instructions/slave.md`
- `src/pages/UIConfigPage/store/types.ts`
- `src/pages/UIConfigPage/store/defaults.ts`
- `src/pages/UIConfigPage/store/store.ts`
- `src/hooks/use-mobile.ts`
- `eslint.config.js`
- `vite.config.ts`

Three phases, strictly in order. Each verifies against the previous phase's real
output. If a phase blocks, stop there — do not skip ahead.

---

## Phase 1 — make `tsc -b` green

Change (only these files):
- `src/pages/UIConfigPage/store/store.ts` — `addSite`, ~line 35. Three errors in one
  spot: `newSite` is referenced inside the object literal that declares it
  (TS2448/TS2454), and `site.domain` does not exist on `Partial<Site>` (TS2339) — the
  domain lives at `site.server.domain`. Restructure so `newSite` is built, then the
  domain override applied. Do not silence with `any` or `as`.
- `src/pages/UIConfigPage/store/defaults.ts` — ~line 163, `DEFAULT_STATE` fails TS2322
  because `certType` widens to `string`. Narrowest fix that keeps `DEFAULT_STATE`
  assignable to `GlobalConfigState`.

Acceptance:
- [ ] `npx tsc -b` exits 0 with no output
- [ ] `git status --short` shows changes only in those two files
- [ ] The errors are fixed at the source, not suppressed

Ponytail check — rung 2 (already in the repo): both fixes are narrowing/ordering
changes inside files that already exist. No new files, no new types, no new
abstractions. The `store.ts` bug is a self-reference in an existing object literal;
deleting it is a deletion, not an addition.

---

## Phase 2 — make `npm run lint` green

Runs after: Phase 1 reports `npx tsc -b` exit 0. Re-run `tsc -b` yourself first — a red
typecheck makes your own verification unreadable.

Change (only these files):
- `eslint.config.js` — add a scoped override for `src/Components/ui/**` turning off
  `react-refresh/only-export-components`. Those ~11 errors are all inside generated
  shadcn primitives; hand-editing generated files to satisfy an HMR lint rule is
  backwards. This answers `BLOCKERS.md` B1: **override, do not edit the primitives.**
- `src/hooks/use-mobile.ts` — the one real error, `react-hooks/set-state-in-effect` at
  ~line 14. Pick the smallest correct fix. `useSyncExternalStore` against the
  `matchMedia` query is idiomatic for a media-query subscription; a lazy
  `useState(() => …)` initializer plus event subscription also works. Justify your
  choice in the response. Grep first — something outside may import the hook.

Acceptance:
- [ ] `npm run lint` exits 0, no warnings printed
- [ ] `npx tsc -b` still exits 0
- [ ] You read back `git diff eslint.config.js` and confirm it is only a scoped
      override; quote the diff in your response
- [ ] No file under `src/Components/ui/` appears in `git status --short`

Ponytail check — rung 1: 11 of 13 errors are the linter complaining about generated
files that were never going to satisfy it. The fix is config, not code, roughly five
lines. Rung 3: `useSyncExternalStore` is React's own primitive, already available.

---

## Phase 3 — fix portability and encoding damage

Runs after: Phase 2 reports `npm run lint` exit 0. File-wise this phase is independent
of the others; it goes last so its "still green" acceptance check means something.

Change (only these files):
- `vite.config.ts` — the `@components` alias points at `./src/components` (lowercase)
  while the directory is `src/Components` (capital C). Windows resolves this; a
  case-sensitive Linux CI or Vercel build will not. Decide and **state which way you
  fix it** — rename the directory, or fix the alias string. Renaming every import
  across the app is a large diff; fixing one alias is one line. Prefer the one line
  unless you find a concrete reason not to, and say why.
- `src/index.css`, `src/store/useAppStore.ts`, `src/Components/Workspace.tsx` —
  mojibake in comments. You will see replacement-character sequences where an em-dash
  or arrow was meant. The important one is in `useAppStore.ts`, inside a **code
  comment** that reads `"0…100"`. Replace with plain ASCII (`->`, `to`) so the damage
  cannot recur. Touch nothing else in these files.

Acceptance:
- [ ] `npm run lint` exits 0 and `npx tsc -b` exits 0 (both green from Phases 1–2)
- [ ] Every alias in `vite.config.ts` matches the real on-disk casing exactly
- [ ] A grep for the replacement character in the three files you touched returns
      nothing — report the exact command and its output
- [ ] `npm run build` succeeds
- [ ] Total diff under ~20 lines. If it is bigger, you have done too much — stop and
      report instead of continuing

Ponytail check — rung 6 (one line): the alias fix is one string, the mojibake is
find-and-replace in comments. No new file, no encoding config, no `.editorconfig`, no
re-save-everything pass. A repo-wide encoding sweep is the over-engineered version of
this task.

---

## Do NOT (applies to every phase)

- **Never run a mutating git command.** No commit, merge, rebase, pull, push, stash,
  checkout, or tag. Read-only `git status` / `git diff` / `git show` are fine.
- Do not edit any file under `src/Components/ui/**` — not for lint, not for types, not
  to reorder exports. Next phase's config override handles it.
- Do not reshape a type in `src/pages/UIConfigPage/store/types.ts` to make an error
  disappear. If a type is genuinely wrong, report it as a blocker instead.
- Do not delete the 4 unused setters in `src/store/useAppStore.ts` (`setParsedConfig`,
  `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore`). Task T4 needs them.
- Do not reformat, reorder, or "improve" code you pass through. This instruction is
  about making the build green, not about tidying style.
- Do not fix the mojibake in `PLAN.md` or `Nginx Config Visualizer.md` — report it.
- Do not add a test runner, an eslint cache, `--quiet`, or `--max-warnings`.
- Do not start feature work. Nothing here generates or parses nginx — that is T3/T4,
  blocked on this instruction.