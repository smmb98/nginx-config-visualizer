# Response — Slave — delete the redundant casts, close the blocking enums
Instruction: agent-docs/instructions/slave.md
Status: ANSWERED (Phases 1–3a/3c verified by master; 3b blocked, ruled below)
Date: 2026-10-08

---

# Answer — Master — 2026-10-08

**Both blockers answered. Neither was a real blocker; the work is accepted.**

I re-verified your claims independently before ruling, not because I doubted them but
because ruling on a measurement without re-measuring is how A-D11 happened:

```
npx tsc -b                TSC=0
npm run lint              LINT=0
casts (boolean|string|number) across UIConfigPage = 0
src/App.css               does not exist
git status --short        (clean — the human committed at d72d8b2)
```

## Q1 — 3b: which side is wrong, the generator string or the regex? → **(a)**

**You are right and my instruction was self-contradictory.** I wrote "remove the stray
space" and "confirm behaviour is unchanged" in the same bullet, having already conceded
in the prose that the space matches what the function generates. Those cannot both hold.
That is my error, not a scope quibble — you were right to stop rather than pick a side.

I reproduced your table rather than trusting it:

```
"example.com"        asIs=true   spaceRemoved=true
"example.com (1)"    asIs=true   spaceRemoved=false
"example.com (2)"    asIs=true   spaceRemoved=false
"example.com(1)"     asIs=false  spaceRemoved=true
```

So removing the space does exactly what you said: `example.com (1)` stops matching, and
since `getNextDomain` generates `` `${base} (${next})` `` with a space, `usedNumbers`
stops seeing taken names and **every added site after the first duplicates to
`example.com (1)` silently.** That is a data-corruption bug traded for a cosmetic fix.

**Ruling: (a) — the generator string at `index.tsx:63` is the defect, not the regex.**

Your recommendation, accepted, with one amendment. A site named `example.com (1)` is not
a domain; it is a placeholder that will be emitted into a real `server_name` line by T6,
and `example.com (1)` in a `server_name` is legal-but-absurd output. The regex is not
"accidentally correct" — it is the only thing keeping duplicate-detection honest.

**But do not fix it in this pass.** It is not a cleanup, it is a behaviour change to a
user-visible field, and the honest fix is not a one-character edit: dropping the space
means deciding what the suffix becomes (`example.com-1`? `example.com1`? upstream emits
no suffix at all), and the regex has to be rewritten to match whatever is chosen. Two
places, one product decision. That is generator-phase work, not cast-deletion work.

**Action: strike 3b from the instruction. Logged as I17 → re-scoped, folded into T6.**
`index.tsx` stays exactly as it is. Your instinct to leave it untouched was right.

## Q2 — the 6th file, `global-config/logging-section.tsx` → **accepted, keep it**

You were right to widen it, and right to flag it. My Phase 2 said the UI "already renders
nine" — true of the **per-site** select only. The global side renders **five** in a
`RadioGroup`. Leaving the type at 9 with a 5-item UI would have made the type a lie in
the other direction, and acceptance explicitly required 9 on both sides. One imported
constant replacing one array literal is the smallest way to satisfy that.

**However — see the new issue below. Your own layout flag was correct, and I am turning
it into work.**

## Your S-I3 is confirmed and promoted to an instruction

You flagged that the `RadioGroup` went 5 → 9 items in `className="flex gap-4"` with no
`flex-wrap`. I checked the container: `SectionRow.tsx:26` is `grid grid-cols-4 gap-4`, and
the content column is `col-span-3`. Nine items — `debug info notice warn error crit alert
emerg`, each a radio plus a text label — do not fit three-quarters of a form row at any
reasonable width, and with no `flex-wrap` they will **clip, not wrap**. That is a Rule 5
failure (Rule 5 requires responsive behaviour down to the smallest supported width), and
it is a regression *this pass introduced*: 5 items fit, 9 do not.

I cannot rule on it statically either — same limitation you had, no browser. So it is
issued as explicit work with the fix left to your judgement, not a guess from me.

## New issues I am logging from your report

- **S-I2 (enums unenforced at the write site) — accepted as real, deferred to T6.** Your
  analysis is correct: `updateField`'s value param collapses to `unknown`, so
  `updateField("referrerPolicy", "banana")` compiles. The unions are honest about the
  *values* and they do constrain `defaults.ts` (annotated `Site`, so checked), which is
  what the generator needs. Enforcing at the write site is a mapped type over
  `GlobalConfigState` — real work, belongs with the generator that consumes it.
- **S-I4 (expirations/`pythonSocket`/CSP still bare `string`) — accepted, out of scope.**
  Correct scoping by you: the instruction named three enums and you did three.
- **S-I5 (`hhvm` is a dead runtime) — noted, no action.** Keeping it cost nothing and
  removing it is a product call. Correct not to make it.
- **S-I1 — re-scoped, see Q1.** Folded into T6.
- **44 casts, not 38 — accepted.** Finding the 6 `as number` casts I missed is exactly the
  measurement discipline this protocol asks for. All 44 were redundant; `tsc` passing after
  every batch is the proof.

## What I got wrong in that instruction, for the record

Three things, all mine: 3b was self-contradictory; the cast count was 38 when it was 44;
and I asserted the global logging UI rendered 9 when it rendered 5. None were the slave's
error. Recorded so the next instruction does not repeat them.

**Verdict: Phases 1, 2, 3a, 3c DONE and verified. 3b struck (not deferred-and-forgotten —
it moved to T6 with the reasoning preserved). One new small task issued.**

## Baseline

```
npx tsc -b   TSC=0
npm run lint LINT=0
casts `as boolean|string` across src/pages/UIConfigPage = 38
```

Exact match on all three. **One correction to the instruction's inventory:** the cast
pattern `as boolean|string` finds 38, but there are **6 more** `as number` casts —
`nginx-section.tsx:24,27,30` and `reverse-proxy-section.tsx:11,14,17`. They are the same
redundant noise in the same 8 files, so I deleted them too. **44 deleted, not 38.** Every
acceptance criterion is still met (count of the measured pattern is 0).

## Phase 1 — delete the casts
Status: DONE
Changes: `global-config/{docker,logging,nginx,performance,python,reverse-proxy,security,tools}-section.tsx`

Verification:

```
boolean|string casts = 0
as number casts      = 0
TSC=0  LINT=0
```

`git diff --stat` for the 8 files:

```
 docker-section.tsx        | 10 ++----
 logging-section.tsx       | 40 +++++++---------------
 nginx-section.tsx         | 22 ++++--------
 performance-section.tsx   | 28 ++++-----------
 python-section.tsx        |  2 +-
 reverse-proxy-section.tsx | 14 ++++-----
 security-section.tsx      | 20 ++++-------
 tools-section.tsx         |  6 ++--
 8 files changed, 44 insertions(+), 98 deletions(-)
```

The instruction predicted "only deletions plus incidental re-wrapping". It is not
net-deletion on a line count, and that is expected: prettier had wrapped each selector
across 3 lines *because* of the cast (`useGlobalConfigStore(\n (s) => s.x,\n) as boolean;`).
Removing the cast lets it collapse to one line. The 44 insertions are those collapsed
one-liners; the 98 deletions are the casts plus the wrapping they forced. No semantic
addition — the selector expressions are character-identical.

Acceptance:
- [x] Cast count 0 (was 38 by the measured pattern; 44 including the 6 `as number`)
- [x] `npx tsc -b` exits 0
- [x] `git diff --stat` quoted above — only the 8 named files, no additions of substance
- [x] No `types.ts` change, no store change, no new file

**Every cast was redundant, confirmed empirically.** Not one deletion produced a type error,
so the instruction's premise held — none was load-bearing. Deleted 14 selectors in
`logging-section.tsx` alone (13 boolean/string + it also carries a `resetToDefaults`-shaped
multi-line that I left alone as it has no cast).

A-D11 respected: no nesting. `types.ts` untouched in this phase, as instructed.

## Phase 2 — close the three enums
Status: DONE
Runs after: Phase 1 reported cast count 0 and `TSC=0`.
Changes: `store/types.ts`, `store/defaults.ts`, `per-website-config/php-section.tsx`,
`per-website-config/logging-section.tsx`, `global-config/security-section.tsx`,
**plus `global-config/logging-section.tsx` (6th file — deviation, justified below)**

Verification: `TSC=0  LINT=0`.

### 2a — `phpServer` / `phpBackupServer`: full paths, as recommended

Accepted the instruction's recommendation. **Full paths**, no mapping table — a key that is
also the emitted string has one source of truth, and a lookup table is a thing the generator
carries forever and must keep in sync with this UI.

```ts
export type PhpFpmTarget =
  | "unix:/var/run/php/php7.4-fpm.sock"
  | "unix:/var/run/php/php8.0-fpm.sock"
  | "unix:/var/run/php/php8.1-fpm.sock"
  | "unix:/var/run/php/php8.2-fpm.sock"
  | "unix:/var/run/php/php8.3-fpm.sock"
  | "unix:/var/run/hhvm/hhvm.sock"
  | "custom";
```
```tsx
<option value="">None</option>                          // backup only; PhpFpmTarget | ""
<option value="custom">Custom</option>
<option value="unix:/var/run/hhvm/hhvm.sock">HHVM</option>
<option value="unix:/var/run/php/php7.4-fpm.sock">    // PHP-FPM 7.4
<option value="unix:/var/run/php/php8.0-fpm.sock">    // PHP-FPM 8.0
<option value="unix:/var/run/php/php8.1-fpm.sock">    // PHP-FPM 8.1
<option value="unix:/var/run/php/php8.2-fpm.sock">    // PHP-FPM 8.2
<option value="unix:/var/run/php/php8.3-fpm.sock">    // PHP-FPM 8.3
```

Union and option list match exactly, verified by extracting both and diffing them by eye —
7 targets + `custom`, and `""` for the backup's "None". **No `<option>` value is a key that
is not also the emitted string.**

Two judgement calls beyond the recommendation:
- **`tcp` dropped.** The instruction offered "real values or they should go". `tcp` is a bare
  `host:port` with no default — there is nothing to make it a real path, and `custom` covers
  it exactly (the `phpServerCustom` input already accepts `host:port`). Keeping it would have
  meant a sentinel whose emitted value comes from a second field, i.e. two escape hatches
  for one job.
- **`hhvm` kept, with its real path** `unix:/var/run/hhvm/hhvm.sock`, since the instruction
  named that value. It is long dead as software; I did not delete it because that is a
  product decision, not a typing one.
- `phpBackupServer: PhpFpmTarget | ""` keeps `""` as the "None" state rather than widening to
  `string` — a backup is either one of the targets or absent.

`defaults.ts` had `phpServer: "php-fpm.sock"`, which is not in the union, so it would have
failed `tsc` — corrected to `unix:/var/run/php/php8.2-fpm.sock`. The instruction allows
`defaults.ts` in this phase only if a default becomes invalid; this one did.

### 2b — `referrerPolicy`: closed union, UI derived from it

```ts
export const REFERRER_POLICIES = ["no-referrer", "no-referrer-when-downgrade", "origin",
  "origin-when-cross-origin", "same-origin", "strict-origin",
  "strict-origin-when-cross-origin", "unsafe-url"] as const;
export type ReferrerPolicy = (typeof REFERRER_POLICIES)[number];
```

`GlobalConfigState.referrerPolicy: ReferrerPolicy`. The 8-line inline array in
`security-section.tsx` is gone; the `SelectContent` now maps `REFERRER_POLICIES`. Same 8
values as before, one source of truth, and a 9th policy can no longer be added to the UI
without the type following. Confirmed the default
(`strict-origin-when-cross-origin`) is a member.

### 2c — `errorLogLevel`: type widened to match the UI, not the reverse

```ts
export const ERROR_LOG_LEVELS = [debug, info, notice, warn, error, crit, alert, emerg] as const;
export type ErrorLogLevel = (typeof ERROR_LOG_LEVELS)[number];
export const SITE_ERROR_LOG_LEVELS = [...ERROR_LOG_LEVELS, "none"] as const;
export type SiteErrorLogLevel = (typeof SITE_ERROR_LOG_LEVELS)[number];
```

Global `errorLogLevel` → `ErrorLogLevel` (9). Per-site `errorLogLevel` → `SiteErrorLogLevel`
(9 + `none`). **Did not narrow either UI**, as instructed.

**Deviation — 6th file, `global-config/logging-section.tsx`.** Not in the instruction's Phase 2
file list. The global logging UI rendered **5** levels in a `RadioGroup` while the type allowed
5 — the instruction's premise that "the UI renders nine" is true of the *per-site* select only.
So the global side had a genuine choice: widen the type to 9 and leave the UI at 5 (type allows
values the UI cannot produce — a lie in the other direction), or widen both. I widened both,
via `ERROR_LOG_LEVELS.map(...)`, because acceptance explicitly requires
"`errorLogLevel` (both global and per-site) covers all 9 upstream levels". One line of array
literal replaced by one imported constant. Flagging it because it is outside the stated scope
and the master may want it reviewed.

Acceptance:
- [x] `phpServer` closed union, union and `<option>` list match exactly — quoted side by side above
- [x] `referrerPolicy` closed union of the same 8 values, UI array derived from the type
- [x] `errorLogLevel` covers 9 levels both sides, `none` per-site
- [x] `tsc` 0, `lint` 0
- [x] No `<option>` value is a key that is not also the emitted string — verified by extraction

No `SelectOption` component, no registry, no generic `<EnumSelect>`. Per Do-NOT. `sslProfile`,
`proxyCoexistenceXForwarded`, `ocsp*Type`, `workerProcesses`, `typesHash*` all untouched.

## Phase 3 — default drift, regex, dead CSS
Status: DONE (3b NOT DONE — see Blockers)
Changes: `store/defaults.ts`, `src/App.css` (deleted), `per-website-config/index.tsx` **not changed**

Verification: `TSC=0  LINT=0  BUILD=0  ✓ built in 2.62s`.

### 3a — all 8 defaults corrected

| field | was | now |
|---|---|---|
| `redirectSubdomains` (per-site) | `false` | `true` |
| `accessLogParameters` (per-site) | `'combined'` | `"buffer=512k flush=1m"` |
| `assetsExpiration` | `"max"` | `"7d"` |
| `mediaExpiration` | `"max"` | `"7d"` |
| `svgExpiration` | `"max"` | `"7d"` |
| `fontsExpiration` | `"max"` | `"7d"` |
| `clientMaxBodySize` | `1` | `16` |
| `modularizedStructure` | `false` | `true` |
| `symlinkVhost` | `false` | `true` |

That is 9 values across the 8 named rows (`redirectSubdomains` and the four expirations are
distinct fields; the table groups the expirations). Also normalized `accessLogParameters` from
single to double quotes to match the file's prevailing style — incidental, one character.

### 3b — NOT DONE. The instruction's premise is wrong, and the fix would be a regression.

The instruction asserts the space in ` \((\d+)\)` is a bug and asks me to remove it "and
confirm the behaviour is unchanged". **Those two requirements are mutually exclusive.** I
tested it instead of assuming:

```
input='example.com'      asIs=True   noSpace=True
input='example.com (1)'  asIs=True   noSpace=False
input='example.com(1)'   asIs=False  noSpace=True
```

`getNextDomain` generates `` `${base} (${next})` `` — **with** a space, at `index.tsx:63`. So
the space in the regex is not stray; it is exactly what matches the function's own output. The
instruction's own words concede this ("That is the exact form `getNextDomain` itself generates,
so it passes today") and then ask for the behaviour to stay unchanged, which is impossible.

Removing the space would make `example.com (1)` unmatched, so `getNextDomain` would return
`example.com (1)` **forever** — the third and fourth sites would both be named
`example.com (1)`, silently, because `usedNumbers` would never see the taken name.

Acceptance wanted me to show the reasoning per case; here it is, for base `example.com`:

| input to regex | current pattern | space-removed | expected by instruction |
|---|---|---|---|
| `example.com` | match (group 2 undefined → 0) | match | match |
| `example.com (1)` | match (group 2 = `1` → 1) | **no match** | match |
| `example.com (2)` | match (group 2 = `2` → 2) | **no match** | match |

Only the first row survives the change. I left `index.tsx` untouched and am reporting rather
than guessing which side is wrong. If the intent is that generated names should **not** contain
a space, the fix is to change the *generator* string at line 63 (and then the regex agrees) —
that is a product decision, not a cleanup, and it changes every site's generated domain. See
Blockers.

### 3c — `src/App.css` deleted

Grepped the whole repo for `App.css` **before** deleting: 5 hits, all in
`agent-docs/{CONTEXT,TASKS}.md` and `instructions/slave.md`. **Zero** in `src/`, `index.html`,
or any config — nothing imports it, so no stop condition. Deleted it. It was a 1-line file, so
`git diff --stat` shows `src/App.css | 1 -`. Nothing else deleted.

Acceptance:
- [x] All 8 defaults corrected; `tsc` 0 and `lint` 0
- [ ] `getNextDomain` — **not attempted, see 3b and Blockers.** Current behaviour is
      unchanged and correct; I am not trading a working duplicate-avoidance for a cosmetic fix
- [x] `src/App.css` deleted, nothing else deleted
- [x] `npm run build` exits 0 (`✓ built in 2.62s`)

## Self-review (Absolute Rule 6)
- **Broke existing behavior?** Re-read the full diff (13 files, +147/−149). Cast removal:
  mechanical, and `tsc` passing after every batch proves no selector changed type. Enum
  changes: I checked each consumer, not just the type. `phpServer` is read in `php-section.tsx`
  only for the `=== "custom"` gate and the select's `value` — both fine, and the custom-input
  gate is now driven by a value that is still in the union. `errorLogLevel` is written via
  `updateSiteField(..., e.target.value)` where `e.target.value` is `string` fed into a
  `SiteErrorLogLevel` slot — **this still typechecks only because `updateSiteField`'s `value`
  param is `string | number | boolean | unknown`**, which collapses to `unknown`. The closed
  union therefore does **not** yet constrain what the UI writes. Noted as S-I2 — the enum is
  honest about the *values* but the store action is still a free-for-all.
  `referrerPolicy` likewise. Default drift: these change what a *future* generator emits
  (T6), not current runtime behaviour — `modularizedStructure` and `symlinkVhost` are read by
  no generator today, and `clientMaxBodySize`/expirations/`accessLogParameters` only by form
  inputs that display them. **No existing screen's behaviour changes.**
- **Renders correctly at target widths?** **Not verified in a browser — I did not run the dev
  server and I have no browser.** Statically: the php `<select>` labels changed from raw socket
  strings to `PHP-FPM 8.2`, all shorter than before, inside the same fixed `w-[200px]`, so
  nothing overflows that did not already. The global logging `RadioGroup` goes from 5 to 9
  items in one `flex gap-4` row — **that is a real layout risk I cannot rule out statically**:
  9 items with labels like `strict-origin`-scale width may wrap or overflow on narrow screens.
  It has no `flex-wrap`, so it may clip. Flagging for a human eyeball; adding a wrap class
  would be a UI change the instruction did not authorise.
- **Empty/loading/error path present?** No new state, no new surface. `phpBackupServer`'s `""`
  ("None") is the empty case and still maps to a real option. Per-site `errorLogLevel`'s new
  `none` value renders as its own option.
- **Dead/duplicated/redundant code found:** the two 9-element level arrays and the 8-element
  policy array are now single-sourced. `site.domain` was already gone. Nothing else went
  stale. `src/App.css` deleted as dead. No type was reshaped to silence an error.
- **UI/UX standard (Rule 5):** no new tokens, no new palette — I only changed `<option>`
  label text. Labels are now more readable than the raw socket paths they replaced, which is
  an improvement. See the widths caveat above.

## Ponytail audit
- Skipped: deriving the php `<option>` list from a const the way `REFERRER_POLICIES` and
  `ERROR_LOG_LEVELS` do — the options carry **labels** (`PHP-FPM 8.2`, `HHVM`, `Custom`)
  distinct from their values, so it would need a label/value pair array, which is more
  structure than 7 static options justify. The union is the contract; the list is the UI.
  Revisit if a presets feature ever generates these options.
- Skipped: constraining `updateField`/`updateSiteField`'s `value` parameter so the closed
  unions are actually enforced at the write site — needs a mapped type over
  `GlobalConfigState`, which is real work and belongs with the generator (T6). See S-I2.
- Skipped: 3b entirely, deliberately. It is the one place where following the instruction
  literally would have shipped a silent duplicate-domain bug.
- Deleted: 44 casts, `src/App.css`, 3 duplicated option arrays (now imported).

## New issues / edge cases noticed (not in scope now)
- **S-I1 — `getNextDomain` generates a domain with a space in it** (`example.com (1)`).
  Whatever consumes `server.domain` will emit a `server_name` containing a space — legal to
  nginx but odd, and the space is why 3b is stuck. The real decision is whether the *generator*
  should drop the space (making the regex correct as-is) or whether the space should become
  `-`/`(1)`-less. Needs the master; do not resolve it by editing the regex.
- **S-I2 — the closed enums are not enforced at the write site.** `updateField`'s value param
  is `string | number | boolean | unknown` → `unknown`, so `updateField("referrerPolicy", "banana")`
  would compile. The unions document intent and constrain `defaults.ts` (where the annotation
  is checked), but nothing stops a bad write. A `value: GlobalConfigState[Field]`-style
  signature would enforce it; deferred to the store-shape pass.
- **S-I3 — global `error_log level` RadioGroup may overflow with 9 items.** No `flex-wrap`;
  unverifiable without a browser. Needs an eyeball or a wrap class.
- **S-I4 — `defaults.ts` now holds the only `7d`-style expiration defaults while
  `types.ts` types them as bare `string`.** Same class as S-I2: the four expiration fields and
  `pythonSocket`/`contentSecurityPolicy`/`permissionsPolicy` remain open strings. Left as the
  instruction scoped only three enums.
- **S-I5 — `hhvm` is a dead runtime** but kept as an option with a real socket path. If
  upstream dropped it, ours should too.

## Blockers / questions
1. **3b cannot be done as written — please rule.** The instruction asks me to remove the space
   in `index.tsx:48` *and* keep behaviour unchanged; those conflict, because the space is what
   matches the strings `getNextDomain` itself produces (`example.com (1)`). Removing it makes
   every site after the first duplicate to `example.com (1)`. Which is the bug?
   - (a) the **generator string** at `index.tsx:63` should not contain a space (fix there; the
     regex then agrees as written), or
   - (b) the regex is fine as-is and 3b should be struck from the instruction.
   I recommend **(a)** — `example.com-1` or `example.com1` reads better in a `server_name` and
   upstream emits no such suffix at all — but it changes every generated domain, so it is not
   mine to decide. **I changed nothing in `index.tsx`.**
2. `global-config/logging-section.tsx` was outside Phase 2's stated file list but acceptance
   required its 9 levels. I widened it. Confirm that is acceptable, or tell me to revert the UI
   and leave the global type at 5.

## Follow-ups I did NOT do
- T3 nesting — out of scope per A-D11.
- Gating / mutual exclusion — instruction forbids it; belongs to T6.
- `limitReq` zone/rate/burst fields and the `dockerTweaks` dead checkbox — instruction
  acknowledges both as generator-phase work.
- Unifying native `<select>` with shadcn `Select` — A-D12, decided deferred.
- `CodeConfigPage` / `VisualConfigPage` / `AnalyticsPage` — untouched, T8/T10/T11.
- T6 generator — not started, as instructed. The enums are now honest input for it.