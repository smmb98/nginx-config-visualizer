# Response — Slave — fix the `error_log level` RadioGroup clipping
Instruction: agent-docs/instructions/slave.md
Status: DONE
Date: 2026-10-08

## Phase 1 — the `flex-wrap` class (single phase; the whole instruction)
Status: DONE
Changes: `src/pages/UIConfigPage/global-config/logging-section.tsx:61`

The entire change:

```diff
-            className="flex gap-4"
+            className="flex flex-wrap gap-4"
```

One class on one line in one file. Nothing else in the file, in `SectionRow.tsx`,
`Workspace.tsx`, `Header.tsx`, `per-website-config/logging-section.tsx`, or anywhere under
`src/components/ui/**` was touched.

```
git diff --stat
 src/pages/UIConfigPage/global-config/logging-section.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

No other entry in `git status --short`.

## Verification

```
npx tsc -b        TSC=0
npm run lint      LINT=0
npm run build     BUILD=0    (✓ built in 3.40s — the >500 kB chunk warning is
                             pre-existing, vite's default threshold, unrelated)
git diff --stat   1 file changed, 1 insertion(+), 1 deletion(-)
```

### Browser verification — done, measured, after the change

Headless Chrome over CDP, Node 22's built-in `WebSocket`, zero dependencies, throwaway
scripts in `%TEMP%\opencode\`. Dev server was already running (HTTP 200).

One navigation correction worth recording, because the instruction's click path did not
work on this machine and I had to re-derive it: the reused `--user-data-dir` profile
**already has `isInitialized` set** (persisted under `nginx-visualizer-storage` from a
previous session), so the app lands **directly on the Workspace**, not the LandingPage —
`Create New Config` does not exist (`b0 NONE`) and the `UI Config` header tab is already
active. The only click needed is the **global** `Logging` tab, and there are **two**
elements with that exact text (per-site and global). The instruction says to click "the
section tab" and names the per-site file first; clicking the *first* match measures the
per-site `<select>`, not this defect. Clicking the **last** match is the global
`RadioGroup` — verified by `#err-lvl-debug` existing afterwards. Both are bare
`<li onClick>` as `TabSelector.tsx` documents.

### Geometry — the assertion from the instruction, per width

`cellW` = the `RadioGroup` border box (the `col-span-3` cell), `scrollW` vs `clientW` =
hidden overflow, `itemsBeyondGroup` = options whose `right` exceeds `group.right + 1`
(i.e. not rendered inside the group at all).

| width | cellW | scrollW / clientW | rows | itemsBeyondGroup | verdict |
|---|---|---|---|---|---|
| 1440 | 683 | 683 / 683 | 1 | **0** | PASS |
| 1280 | 596 | 596 / 596 | 1 | **0** | PASS |
| 1024 | 458 | 458 / 458 | 2 | **0** | PASS — was clipping `alert`,`emerg` |
| 768 | 319 | 319 / 319 | 2 | **0** | PASS — was clipping 4 of 8 |
| 390 | 46 | 66 / 46 | 8 | **7** | **STILL BROKEN** |
| 360 | 32 | 66 / 32 | 8 | **8** | **STILL BROKEN** |

`documentElement.scrollWidth > window.innerWidth` was **false at every width**, including
the two broken ones — so the overflow is contained inside the 32px/46px cell and the
options are unreachable, exactly as the instruction describes. `flex-wrap` computes to
`wrap` on the element at all six widths.

**A caveat on the absolute numbers, in the interest of not overclaiming.** My cell widths
are smaller than the instruction's table (768: mine 319 vs master's 328; 1024: 458 vs
469; and the whole 390/360 column matches exactly at 46/32). The pass/fail result is
unaffected — the criterion is `scrollW === clientW` and zero items beyond the group, not an
absolute width — but the delta is most likely the Workspace left panel's **persisted**
`sidebarSizePct` from the reused browser profile differing from master's. The instruction's
figures are not in dispute; mine are a second measurement from a different profile state.

## Acceptance

- [x] **No option clipped at 1024 and 768 — measured.** 1024: cell 458, `scrollW` 458 =
      `clientW`, 2 rows, 0 of 8 options beyond the group. 768: cell 319, `scrollW` 319 =
      `clientW`, 2 rows, 0 of 8 beyond the group.
- [x] **360/390 reported as still broken, with the reason.** Cell is 32px at 360 and 46px
      at 390. The widest option needs 66px (`emerg`: `sw=66 cw=66`) — a single option
      cannot fit in a 32px box no matter how the row wraps, so `flex-wrap` gives 8 rows
      and 8 (resp. 7) options still render outside the group's box. The page does not
      scroll at either width, so they are clipped and unreachable. **The control is fixed at
      1024 and 768 and is not fixed at phone widths.** Cause is upstream: fixed 200px left
      panel + `grid-cols-4` `SectionRow`, which is **T15**, not this task.
- [x] `npx tsc -b` 0, `npm run lint` 0, `npm run build` 0
- [x] `git diff --stat` → **1 file changed, 1 insertion(+), 1 deletion(-)**, quoted above
- [x] `Workspace.tsx`, `Header.tsx`, `SectionRow.tsx` untouched — confirmed by
      `git status --short` showing exactly one modified path
- [x] Nothing under `src/components/ui/**` touched — same check
- [x] No new dependency, no new file in the repo, no new token, no new breakpoint or media
      query
- [x] Layout verified **after** the change. No pre-change measurement was taken from this
      session; the instruction's table is the before-state and it is not re-derived.

## Self-review (Absolute Rule 6)

- **Broke existing behavior?** The class list is the only thing that changed. `flex-wrap`
  only affects layout; no prop, no state, no store call, no id (`err-lvl-${lvl}` is
  unchanged, so the `<Label htmlFor>` pairing is intact), no option list, no level count.
  Re-read the full diff — one line. `flex-wrap` at 1440/1280 changes nothing observable
  (1 row before and after, since the content fits); the first width where it does anything
  is the one the defect lived at.
- **Renders correctly at target widths?** Measured at all six: 1440 / 1280 / 1024 / 768 /
  390 / 360. 1440–768 pass numerically. 390/360 fail and are reported as failing. Two rows
  at 1024/768 is the intended outcome of wrapping an 8-item option set into three-quarters
  of a form row — I did not check whether two rows looks *good*, only that nothing is lost;
  see below.
- **Empty/loading/error path present?** No new state, no new surface, no new async. Nothing
  to add. All 8 options render at every width ≥ 768.
- **Dead/duplicated/redundant code found:** none in this diff. I checked the neighbouring
  Cloudflare checkbox rows as instructed not to touch them — untouched, and the section is
  the only `flex gap-…` row in `global-config/` that carries 8 siblings, so this is still
  an isolated row rather than a pattern.
- **UI/UX standard (Rule 5)?** One existing token (`flex-wrap`), no new palette, no new
  spacing scale. The control is now honest about its contents at desktop and tablet
  widths instead of silently hiding 2–4 options. Rule 5's "responsive down to the smallest
  supported width" is still **not** satisfied at 360px, and no change in this pass could
  have satisfied it — the enclosing cell is 32px.

## Ponytail audit

- **Skipped:** everything. No wrapper div, no container query, no breakpoint, no
  `sm:flex-wrap`, no switch to `<select>`, no `justify-start`/`gap-x` tuning, no
  `min-w-0` on the cell. Rung 6 — one line before fifty. I read the rendered geometry at
  six widths instead of eyeballing a screenshot, which is what makes the one line
  sufficient rather than a guess.
- **Deleted/unneeded found:** nothing.
- The instruction's own Ponytail check is satisfied: the solution is smaller than the
  problem, which is why it needed measuring to justify.

## New issues / edge cases noticed (not in scope now)

- **S-I6 — the instruction's click path is wrong for any reused profile.**
  `agent-docs/instructions/slave.md:151` says landing → `Create New Config` → `UI Config` →
  `Logging`. With a profile whose `nginx-visualizer-storage` already has `isInitialized`,
  the LandingPage never renders, so the first two steps fail silently (`find` returns
  nothing) and the naive next step — click the *first* `Logging` — measures the **per-site
  `<select>`**, which cannot overflow, and produces a false PASS. The reliable selector is
  **the last `li` whose text is `Logging`**. Worth folding into the *Testing the website*
  recipe in `AGENTS.md`, since it is a property of the gate, not of this defect.
- **S-I7 — `kid.right > group.right` is an incomplete clip assertion on its own.** At
  360/390 my first probe reported `spillCount: 0` even though all 8 options were
  unreachable, because flex items **shrink** to the 32px cell (`flex-shrink` keeps each
  item's box inside its line) while their own content overflows the item. The reliable
  second signal is `item.scrollWidth > item.clientWidth + 1`, or comparing the widest
  item's `scrollWidth` to the group's `clientWidth`. The `AGENTS.md` clip test as written
  would have passed the broken case.
- **S-I8 — cell widths vary with the persisted `sidebarSizePct`.** Same 768px viewport
  gave a 319px cell for me and 328px in the instruction. Any future width-based
  acceptance criterion should be written as a relative test (`scrollW <= clientW`), not an
  absolute pixel figure, or it will fail on a differently-sized profile.

## Blockers / questions

None.

## Follow-ups I did NOT do

- **T15 (I24)** — the shell has no phone layout. 390/360 remain broken for this row **and**
  for 11 other rows across every section, and 4 of them already clip in sections this task
  never entered. `flex-wrap` cannot fix a 32px cell and I did not try to compensate.
- No change to `per-website-config/logging-section.tsx` (a native `<select>`, cannot
  overflow), to the control type, to `ERROR_LOG_LEVELS`, or to the Cloudflare rows.