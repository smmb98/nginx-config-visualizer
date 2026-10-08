# Instruction — Slave — build hygiene (reissued)
Status: DONE
Issued: 2026-10-08
Supersedes: the earlier "build hygiene" issue, which had a false third phase

## Goal
Make `npx tsc -b` and `npm run lint` both exit 0, and `npm run build` succeed.

## Read first
- `agent-docs/CONTEXT.md` §4 (commands), §7 (known-bad areas — this is your error list)
- `agent-docs/instructions/slave.md` (this file)
- `vite.config.ts`
- `tsconfig.app.json`
- `eslint.config.js`
- `src/hooks/use-mobile.ts`
- `src/pages/UIConfigPage/store/store.ts`
- `src/pages/UIConfigPage/store/defaults.ts`
- `src/pages/UIConfigPage/per-website-config/index.tsx`
- `src/pages/UIConfigPage/per-website-config/logging-section.tsx`
- `src/pages/UIConfigPage/per-website-config/php-section.tsx`
- `src/pages/UIConfigPage/per-website-config/routing-section.tsx`

**Two phases, strictly in order.** Phase 2's acceptance criteria are "still green",
which only means something because Phase 1 produced that green. If a phase blocks, stop
there — do not skip ahead.

**Before you start, establish your own baseline.** Run `npx tsc -b 2>&1 | Select-String
"error TS"` and `npm run lint` and record the counts. If they are not 34 and 13
respectively, say so in your response and work from what you actually observe — this
instruction was written from a measurement and the tree may have moved.

---

## Phase 1 — make `tsc -b` green

**Step 1a — the casing fix (clears 21 of 34 errors).**

Measured state: the git index already spells all 62 tracked paths under this folder as
`src/components/` (lowercase). The **working tree** is `src/Components` (capital C).
`tsconfig.app.json` has `"include": ["src"]`, so tsc discovers the directory under its
on-disk casing while every `@/components/...` import resolves to the lowercase spelling —
tsc then reports each affected file twice and emits `TS1261` / `TS1149`.

Because the index is already lowercase, **the disk is what is wrong**. Rename the
directory:

```
Rename-Item -LiteralPath src\Components -NewName Components_tmp
Rename-Item -LiteralPath src\Components_tmp -NewName components
```

The two-step rename is required on Windows — a single-step case-only rename is a no-op on
a case-insensitive filesystem. **Do not use `git mv`**; it is unnecessary (the index is
already correct) and it is a mutating git command.

Re-run `npx tsc -b` and confirm the error count dropped to roughly 13.

**Step 1b — the 13 real errors.** Six files. Fix each at its source; do not silence with
`any`, `as`, or `@ts-ignore`.

| file | error | fix |
|---|---|---|
| `store/store.ts:35` | `TS2448`/`TS2454` — `newSite` referenced inside the object literal that declares it; `TS2339` ×2 — `site.domain` does not exist on `Partial<Site>` | Build `newSite` first, then apply the domain override as a separate statement. The domain lives at `site.server.domain`, so the override is `{ ...newSite, server: { ...newSite.server, domain } }` |
| `store/defaults.ts:163` | `TS2322` — `certType` widens to `string` | Narrowest fix that keeps `DEFAULT_STATE` assignable to `GlobalConfigState` (e.g. `as const` on the literal, or an explicit annotation) |
| `per-website-config/index.tsx:70` | `TS2353` — same `domain`-on-`Partial<Site>` mistake at the `addSite` call site | Pass `{ server: { domain: newDomain } }` instead of `{ domain: newDomain }`, matching what `addSite` actually reads. If you conclude the *store* signature should accept a flat `domain`, that is a design change — report it as a blocker rather than making it |
| `per-website-config/logging-section.tsx:111,124` | `TS2552` — `Select` used but never imported | Add it to the existing `@/components/ui/select` import. Note: check whether the file imports a native `<select>` and a `Select` shim — if so, the fix is disambiguation, not a new import |
| `per-website-config/logging-section.tsx:113` | `TS7006` — implicit `any` on `v` | Follows from the `Select` fix above; likely disappears with it. If not, type the param |
| `per-website-config/php-section.tsx:46,80`, `routing-section.tsx:46` | `TS2322` ×3 — `onValueChange={(v) => …}` against a `Select` whose children carry no `value` prop | Read `ui/select.tsx` to find the real prop contract before changing anything. These three look like a genuine API mismatch (native `<select>` shape vs shadcn `Select`), not a missing annotation |

The last row is the one to be careful with. **If `php-section.tsx` and
`routing-section.tsx` are using a plain `<select>` element while typing it as the shadcn
`Select`, the fix is to use one or the other consistently — not to loosen the prop
type.** Decide, state which you chose and why in your response.

Acceptance:
- [ ] `npx tsc -b` exits 0 with no output
- [ ] `git status --short` shows changes only in the 6 files named above, plus the
      directory rename
- [ ] The rename produced **no git churn** — `git status --short` does not list 62
      deleted + 62 added files. Quote the actual output.
- [ ] Every error fixed at the source; no `any`, no `as` widening a type to silence, no
      `@ts-ignore`

Ponytail check — rung 2 (already in the repo): every fix here is an ordering, import, or
narrowing change inside files that already exist. Step 1a is a directory rename; 1b is
import and ordering surgery. No new files, no new types, no new abstractions, no test
runner. The `store.ts` bug is a self-reference in an existing literal — deleting the bug
is a deletion.

---

## Phase 2 — make `npm run lint` green

Runs after: Phase 1 reports `npx tsc -b` exit 0. Re-run `tsc -b` yourself first — a red
typecheck makes your own verification unreadable.

Change (only these files):
- `eslint.config.js` — add a scoped override for `src/components/ui/**` turning off
  `react-refresh/only-export-components`. Those ~11 errors are all inside generated
  shadcn primitives; hand-editing generated files to satisfy an HMR lint rule is
  backwards — the next `npx shadcn add` overwrites it. This answers `BLOCKERS.md` B1:
  **override, do not edit the primitives.** Note the path is now lowercase after
  Phase 1a. Answered previously as A-B1 / B1.
- `src/hooks/use-mobile.ts` — the one real error, `react-hooks/set-state-in-effect` at
  ~line 14 (`setIsMobile` called synchronously in the effect body). Pick the smallest
  correct fix. `useSyncExternalStore` against the `matchMedia` query is React's own
  primitive and is the idiomatic shape for a media-query subscription; a lazy
  `useState(() => …)` initializer plus event subscription also works. Justify your
  choice in your response. Grep first — something outside may import the hook, and if
  the hook is genuinely unused, deleting it beats fixing it.

Acceptance:
- [ ] `npm run lint` exits 0, no warnings printed
- [ ] `npx tsc -b` still exits 0
- [ ] You read back `git diff eslint.config.js` and confirm it is only a scoped
      override — quote the diff in your response
- [ ] No file under `src/components/ui/` appears in `git status --short`
- [ ] `npm run build` succeeds end to end

Ponytail check — rung 1: 11 of 13 lint errors are the linter complaining about
generated files that were never going to satisfy it. The fix is config, not code, about
five lines. Rung 3: `useSyncExternalStore` is React's own primitive, already available,
no dependency needed.

---

## Do NOT (applies to every phase)

- **Never run a mutating git command.** No commit, merge, rebase, pull, push, stash,
  checkout, tag, or `git mv`. Read-only `git status` / `git diff` / `git show` are fine.
- Do not edit any file under `src/components/ui/**` — not for lint, not for types, not to
  reorder exports. The Phase 2 config override handles it.
- Do not reshape a type in `src/pages/UIConfigPage/store/types.ts` to make an error
  disappear. If a type is genuinely wrong, report it as a blocker.
- Do not delete the 4 unused setters in `src/store/useAppStore.ts` (`setParsedConfig`,
  `setSyntaxErrors`, `setSecurityAudits`, `setHealthScore`). T7 needs them.
- **Do not chase the mojibake.** A previous version of this instruction had a phase for
  it. It does not exist. Measured 2026-10-08: the repository contains **zero U+FFFD
  replacement characters**. The `─` (U+2500) and `→` (U+2192) characters in
  `index.css` and `Workspace.tsx` comments are legitimate and render as `��` only in a
  non-UTF-8 console. `README.md` is valid UTF-8 and its emoji are real. If you see
  something that looks like damage, verify with a codepoint dump before "fixing" it, and
  report what you found instead of editing.
- Do not reformat, reorder, or "improve" code you pass through. This instruction is about
  making the build green, not tidying style.
- Do not delete the unused shadcn primitives in `src/components/ui/`. Decision A-D6:
  they are the design system and are tree-shaken out of the bundle.
- Do not reorganise the folder tree. Decision A-D6.
- Do not run `npm update`, `npm install`, or bump any dependency. Decision A-D7 holds
  `typescript` and `@babel/core` at their current majors deliberately.
- Do not add a test runner, an eslint cache, `--quiet`, or `--max-warnings`.
- Do not start feature work. Nothing here generates or parses nginx — that is T6/T7,
  blocked on this instruction.

---

## Out of scope, for your awareness only

`TASKS.md` T3 (nest `GlobalConfigState`, close the enum types, fix default drift) is the
very next task after this one, and Phase 1b touches some of the same files. **Do not
start it.** It is a separate pass because it is a state-shape change with its own
acceptance criteria, and folding it in here would hide which change broke what.
