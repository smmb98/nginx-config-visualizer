# Instruction — Slave — delete the redundant casts, close the blocking enums
Status: OPEN
Issued: 2026-10-08
Supersedes: build hygiene (DONE @ `61204fe`)

## Goal
Make the generator's input honest: delete 38 casts that are pure noise, and fix the
three enums whose **values** are wrong so a generator can actually emit nginx text.

## Read first
- `agent-docs/CONTEXT.md` §4 (commands), §5 (state shape), §7 (known-bad — your worklist)
- `agent-docs/TASKS.md` A-D11 (why the nesting is NOT in this instruction), A-D13, I9,
  I17, I19
- `src/pages/UIConfigPage/store/types.ts`
- `src/pages/UIConfigPage/store/defaults.ts`
- `src/pages/UIConfigPage/store/store.ts`
- all 9 files in `src/pages/UIConfigPage/global-config/`
- `src/pages/UIConfigPage/per-website-config/php-section.tsx`
- `src/pages/UIConfigPage/per-website-config/logging-section.tsx`
- `src/pages/UIConfigPage/per-website-config/index.tsx` (Phase 3 only)

**Three phases, strictly in order.** Phase 2's gate is Phase 1's deletions; Phase 3's
gate is Phase 2's enums. If a phase blocks, **stop there** — do not skip ahead.

**Establish your own baseline first.** Run `npx tsc -b`, `npm run lint`, and count the
casts:

```
npx tsc -b ; "TSC=$LASTEXITCODE"
npm run lint ; "LINT=$LASTEXITCODE"
(Get-ChildItem -Recurse src\pages\UIConfigPage -Filter *.tsx |
  Select-String -Pattern '\bas (boolean|string)\b' -AllMatches).Count
```

Expect `TSC=0`, `LINT=0`, and **38**. Master re-verified the two exit codes and the
count 38 on 2026-10-08. If any differ, say so in your response and work from what you
actually observe.

---

## Phase 1 — delete the 38 casts

**They are all redundant.** Every one is `useGlobalConfigStore((s) => s.field) as
boolean` (or `as string`) where `field` is **already correctly typed** in `types.ts`.
Grep-verified: **zero** casts sit on a union-typed field, so not one of them is doing
any work.

Change (only these files):
- the 8 `global-config/*.tsx` files that contain them — `docker-section.tsx` (3),
  `logging-section.tsx` (13), `nginx-section.tsx` (4), `performance-section.tsx` (7),
  `python-section.tsx` (1), `reverse-proxy-section.tsx` (1), `security-section.tsx` (7),
  `tools-section.tsx` (2)

Do NOT:
- **Do not nest anything.** Decision A-D11: the old plan said nesting would delete these
  casts. That is false — `as boolean` on a `boolean` is legal whether or not the parent
  is nested, so all 38 would survive a nest. They go because they are redundant, and the
  diff is a pure deletion.
- Do not touch `types.ts` in this phase. If deleting a cast makes `tsc` red, that cast
  was load-bearing — report which field and stop, because that is a real typing bug.
- Do not reformat. Many are on their own line after prettier wrapped the selector; a
  collapsed one-liner is a natural consequence of deleting the cast, not a style pass.

Acceptance:
- [ ] Cast count is **0** across `src/pages/UIConfigPage` (it is 38 before you start)
- [ ] `npx tsc -b` exits 0
- [ ] `git diff --stat` shows **only deletions** in those 8 files plus incidental
      re-wrapping — quote it
- [ ] No `types.ts` change, no store change, no new file

Ponytail check — rung 1, the whole phase: 38 lines of code that do nothing, deleted.
No new types, no helpers, no nesting. This is the cheapest phase in the instruction.

---

## Phase 2 — close the three enums the generator cannot expand

Runs after: Phase 1 reports cast count 0 and `tsc -b` exit 0. **These are value bugs,
not typing bugs** — a closed type is worthless if the values behind it are wrong.

**2a — `phpServer` / `phpBackupServer` hold invented keys, not socket paths.**
`per-website-config/php-section.tsx:47-55` and `:82-90` offer
`php-fpm.sock`, `php7.4-sock` … `php8.3-sock`, `custom`, `hhvm`, `tcp`. Upstream emits
`fastcgi_pass unix:/var/run/php/php7.2-fpm.sock` (see `docs/competitive-options.md`
§1b item 3). **A generator cannot expand `php8.2-sock` into that string.** The option
values must become real `fastcgi_pass` targets. Both `phpServer` and `phpBackupServer`
are bare `string` at `types.ts:28,30`.

  Decide and state: do the `<option>` values become full paths
  (`unix:/var/run/php/php7.2-fpm.sock`) or short keys plus a mapping? **Recommend full
  paths** — a mapping is a lookup table the generator must carry forever, and a key that
  is *also* the emitted string has one source of truth. Then give `phpServer` a closed
  union type matching whatever the options actually are. `hhvm` and `tcp` do not name
  socket paths — if you keep them, they need real values (`hhvm` is
  `unix:/var/run/hhvm/hhvm.sock`; `tcp` is a `host:port`, not a path) or they should go.
  `phpServerCustom` already exists for the escape hatch — use it rather than inventing a
  new mechanism.

**2b — `referrerPolicy` is a bare `string`.** `types.ts:118`.
`global-config/security-section.tsx:44-52` renders 8 values from an inline array.
Give it a closed union of exactly those 8, and **export the union** so the array and
the type cannot drift apart. Note for the generator (do not implement it): upstream
emits this as a `map $uri $ref_policy { … }` keyed on `wp-admin|wp-login|xmlrpc.php`,
**not** as a plain `add_header` — `docs/competitive-options.md` §1b item 3.

**2c — `errorLogLevel`'s type is behind its own UI.** `types.ts:147` says
`debug|info|notice|warn|error`. `per-website-config/logging-section.tsx:116-123` already
renders **nine** options — it includes `crit`, `alert`, `emerg`. The per-site
`errorLogLevel` (`types.ts:66`) also needs `none` per upstream. Widen both to the full
upstream set; do not narrow the UI to match the weaker type.

Change (only these files): `store/types.ts`, `store/defaults.ts` (only if a default
becomes invalid), `per-website-config/php-section.tsx`,
`per-website-config/logging-section.tsx`, `global-config/security-section.tsx`.

Do NOT:
- Do not touch `sslProfile`, `proxyCoexistenceXForwarded`, or the `ocsp*Type` fields —
  those are already closed unions. Verified.
- Do not touch `workerProcesses` / `typesHashMaxSize` / `typesHashBucketSize`. CONTEXT.md
  and `docs/competitive-options.md` list them as bare `string`; they are typed `string` /
  `number` at `types.ts:161,167,168` and are **not** blocking anything. Leave them.
- Do not nest `GlobalConfigState` (A-D11).
- Do not add a `SelectOption` component, an enum-to-options registry, or a generic
  `<EnumSelect>`. One shared union per enum, referenced from both sides, is enough.

Acceptance:
- [ ] `phpServer` is a closed union whose every member is a literal the generator could
      emit into `fastcgi_pass` — quote the union and the `<option>` list side by side
      and confirm they match exactly
- [ ] `referrerPolicy` is a closed union of the same 8 values the UI renders, and the
      UI's array is derived from the type rather than restating it
- [ ] `errorLogLevel` (both global and per-site) covers all 9 upstream levels, plus
      `none` per-site
- [ ] `npx tsc -b` exits 0, `npm run lint` exits 0
- [ ] No `<option>` value anywhere is a key that is not also the emitted string

Ponytail check — rung 2 (reuse what's here): every one of these is a type annotation on
a field that already exists, plus correcting values in option lists already on screen.
No new files, no new components. The one thing that could turn this into over-building
is a generic enum-select abstraction — resisted deliberately.

---

## Phase 3 — fix the default drift, and delete the dead CSS file

Runs after: Phase 2 reports `tsc -b` exit 0 and both enums closed.

**3a — defaults in `store/defaults.ts` are wrong, not merely different** (issue I9,
`docs/competitive-options.md` §5 item 5). Correct them to upstream:

| field | ours | upstream |
|---|---|---|
| `modularizedStructure` | `false` | `true` |
| `symlinkVhost` | `false` | `true` |
| `clientMaxBodySize` | `1` | `16` |
| `redirectSubdomains` (per-site, `defaults.ts`) | `false` | `true` |
| `assetsExpiration` / `mediaExpiration` / `svgExpiration` / `fontsExpiration` | `max` | `7d` |
| `accessLogParameters` (per-site) | `combined` | `buffer=512k flush=1m` |

**3b — `getNextDomain`'s regex works by accident** (issue I17,
`per-website-config/index.tsx:48`):
`` new RegExp(`^${base}( \\((\\d+)\\))?$`) `` — the `( \\(` is "space, then a literal
open-paren", so it only matches `example.com (1)` **with the leading space**. That is
the exact form `getNextDomain` itself generates, so it passes today. Fix the stray
space. Confirm the behaviour is unchanged for the strings it actually produces, and say
in your response what you checked.

**3c — delete `src/App.css`** (issue I19). Grep-verify first that nothing imports it
(`src/main.tsx`, `index.html`, anywhere in `src/`) — master found zero references, but
confirm. If anything *does* reference it, stop and report instead of deleting.

Acceptance:
- [ ] All 8 defaults above corrected, and `tsc -b` + `lint` still exit 0
- [ ] `getNextDomain` still returns `example.com (1)`, `(2)`, … for base `example.com` —
         show the reasoning (one regex, one expected output per case)
- [ ] `src/App.css` deleted, nothing else deleted
- [ ] `npm run build` exits 0

Ponytail check — rung 1: 3a is 8 wrong values corrected in place, 3b deletes one
character of accidental escaping, 3c deletes a file. Net strongly negative. No new file.

---

## Do NOT (applies to every phase)

- **Never run a mutating git command.** No commit, merge, rebase, pull, push, stash,
  checkout, tag, or `git mv`. Read-only `git status` / `git diff` / `git show` are fine.
- **Do not nest `GlobalConfigState`.** A-D11. It would touch 189 `updateField` call
  sites and delete none of the 38 casts. If you think the nesting is genuinely required,
  that is a **blocker** — write it up and stop, do not do it.
- Do not edit anything under `src/components/ui/**`.
- Do not add a test runner. If you want a check, the cheapest honest option is one
  `console.assert` block you delete before finishing, or a throwaway script under the
  temp dir — not a Vitest dependency.
- Do not enforce the gating or mutual exclusion (CF fields gate on `cloudflare`,
  `symlinkVhost` on `modularizedStructure`, PHP vs Python vs reverse-proxy exclusion).
  That is real work and belongs to the generator task (T6), which is blocked on this one.
- Do not run `npm update`, `npm install`, or bump any dependency. A-D7 holds
  `typescript` and `@babel/core` at their current majors.
- Do not unify the native `<select>` and the shadcn `Select`. A-D12 — decided deferred.
- Do not touch `CodeConfigPage`, `VisualConfigPage` or `AnalyticsPage`. They are
  hardcoded placeholders; rewiring them is T8/T10/T11.
- Do not reformat or reorder code you pass through. This is three small corrections, not
  a style pass.
- Do not start the generator (T6). This instruction only makes its *input* honest.

## New issues you may find

Write them in your response's `## New issues / edge cases` section. Do not fix them.
Two already known and deliberately left: `limitReq` is a bare boolean with no
zone/rate/burst fields at all, and `dockerTweaks` is a dead checkbox (upstream makes it a
button that mutates three fields). Both are generator-phase work.