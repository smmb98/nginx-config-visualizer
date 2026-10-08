# Instruction — Slave — fix the `error_log level` RadioGroup clipping
Status: OPEN
Issued: 2026-10-08
Supersedes: delete the redundant casts / close the enums (ANSWERED @ `d72d8b2`)

## Goal
The T3 pass widened the global `error_log level` control from 5 options to 9 and left it
in a `flex` row with no wrap. Nine radio+label pairs cannot fit the space they are given,
so they clip. Make it lay out correctly at every supported width.

## Read first
- `agent-docs/CONTEXT.md` §4 (commands), §7 (known-bad areas — the regression is at the
  end), §5 (Rule 5 is binding: *responsive down to the smallest supported width*)
- `agent-docs/TASKS.md` A-D14 (why this is a task and not a rounding error), I22
- `src/pages/UIConfigPage/global-config/logging-section.tsx` — the control is at line 55-72
- `src/components/SectionRow.tsx` — the container it sits in
- `src/pages/UIConfigPage/per-website-config/logging-section.tsx:112-122` — the per-site
  control for the same 9 values, for contrast

**One phase. No phases after it. This is the whole instruction.**

## The measured situation

**Measured, not estimated.** Master drove the running dev server over CDP (Chrome
headless, `Emulation.setDeviceMetricsOverride`) and read real geometry. Do not
re-derive these numbers, and do not argue with them — they are `getBoundingClientRect`
output.

`global-config/logging-section.tsx:55-72`:

```tsx
<SectionRow label="error_log level">
  <RadioGroup
    value={errorLogLevel}
    onValueChange={(v) => updateField("errorLogLevel", v)}
    className="flex gap-4"
  >
    {ERROR_LOG_LEVELS.map((lvl) => (
      <div key={lvl} className="flex items-center gap-2">
        <RadioGroupItem value={lvl} id={`err-lvl-${lvl}`} />
        <Label htmlFor={`err-lvl-${lvl}`} className="text-sm">{lvl}</Label>
      </div>
    ))}
  </RadioGroup>
</SectionRow>
```

| viewport | available width in the grid cell | content width | overflows? | clipped options |
|---|---|---|---|---|
| 1440 | 699 | 568 | no | — |
| 1280 | 611 | 568 | no | — |
| 1024 | 469 | 568 | **yes** | `alert`, `emerg` |
| 768 | 328 | 568 | **yes** | `error`, `crit`, `alert`, `emerg` |

Two corrections to master's earlier estimate, both from measurement:

1. **It is 8 options, not 9.** `ERROR_LOG_LEVELS` (global) is the 8 upstream levels.
   The 9th, `none`, belongs to `SITE_ERROR_LOG_LEVELS` (per-site only). The previous 5-item
   version of this control was the upstream subset `debug…error`; `crit`, `alert` and
   `emerg` are what the T3 pass added. The value set is **correct** — only the layout is
   wrong.
2. **It is worse than "may clip".** At 768 four of eight options are unreachable. The
   page itself does *not* scroll (`documentElement.scrollWidth === window.innerWidth` at
   every width tested), so the excess is contained inside the `RadioGroup`, which has no
   `overflow` rule of its own. **The clipped options are not merely off-screen — they are
   clipped with no way to reach them.** That is a functional defect, not a cosmetic one.

Content width is a flat **568px** (8 pairs plus 7 × `gap-4`), so the control overflows
whenever the grid cell drops below 568. The cell is `SectionRow.tsx:26`
`grid grid-cols-4 gap-4 w-full` with the control in `FieldContent className="col-span-3
w-full"` (`:53`) — three-quarters of the form width.

Verified while measuring: `logging-section.tsx:61` is the **only** `className="flex
gap-…"` row in all of `global-config/`, so this is isolated, not a repeated pattern.

## What to change

Change (only this file):
- `src/pages/UIConfigPage/global-config/logging-section.tsx` — the `RadioGroup`
  `className` at line 61.

**Recommended fix: add `flex-wrap`.** One class. It is the smallest change that makes the
control honest at narrow widths, introduces no new tokens, and matches how the rest of the
form behaves.

**Do not** switch the control type. The per-site equivalent
(`per-website-config/logging-section.tsx:115`) is a native `<select>`, which cannot
overflow at all — and swapping the global one to match would be the "right" answer to a
question decision A-D12 explicitly deferred (native vs shadcn vs radio as the product
standard). One decision, made once, when someone writes the next section. Not here, and
not silently inside a layout fix.

**But `flex-wrap` is *not* sufficient at phone widths — measured, and do not try to make it
be.** The smallest supported width is now defined (decision A-D16): **a standard small
smartphone, 360px CSS viewport.** Master injected `flex-wrap` at the DOM level and
re-measured:

| width | cell width | content | result with `flex-wrap` |
|---|---|---|---|
| 1024 | 469 | 568 | 2 rows — **fixed** |
| 768 | 328 | 568 | 2 rows — **fixed** |
| 390 | 46 | 568 | 8 rows, **still clipped** |
| 360 | 32 | 568 | 8 rows, **still clipped** |

At phone widths the *cell itself* is 32px, so one 66px option cannot fit no matter how it
wraps. The cause is upstream of this file: the Workspace left panel is a fixed 200px, the
Header's children total 788px, and `SectionRow`'s `grid-cols-4` then splits ~108px into an
8px label and a 32px control. **All 12** field rows are affected and 4 are already clipped
in sections you are not touching.

That shell problem is **T15**, a separate task, and it is not yours. Do not fix it, do not
open `Workspace.tsx`, `Header.tsx` or `SectionRow.tsx`, and do not add a breakpoint or a
media query to compensate for it here.

**Your job is exactly this:** stop the `error_log level` row clipping from 1024 down to
768, which is where this defect actually lives and where one class is the whole fix.

## Verification

Run and report:

```
npx tsc -b ; "TSC=$LASTEXITCODE"
npm run lint ; "LINT=$LASTEXITCODE"
npm run build ; "BUILD=$LASTEXITCODE"
git diff --stat
```

All three must exit 0.

**A headless Chrome is available and master has already used it.** The dev server is at
`http://localhost:5173/`. Do the same rather than reporting the layout as unverifiable —
it is verifiable, and a pass that leaves it unverified when the tooling exists is a weaker
deliverable. Zero-dependency route, ~30 lines, throwaway file in the temp dir:

```
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList '--headless=new','--disable-gpu','--remote-debugging-port=9222',`
                '--user-data-dir=<temp>\chrome-prof','about:blank'
```

Then over the DevTools Protocol using Node 22's **built-in `WebSocket`** (no `ws` package,
no Playwright — adding a dependency to answer a one-line CSS question is the wrong trade):
fetch `http://127.0.0.1:9222/json/list` for the page target's `webSocketDebuggerUrl`,
connect, then `Page.enable`, `Page.navigate`, `Emulation.setDeviceMetricsOverride` per
width, and `Runtime.evaluate` the geometry probe.

**Navigation, since it cost master a wasted round trip:** `TabSelector.tsx:35` renders
`<li onClick>` with **no `role="tab"`**, so `[role=tab]` finds nothing and a helper that
only searches `button, a, [role=tab], span, div` will report `Logging` as not found.
Search `li` too. Click path: landing → button whose text is `Create New Config` →
`UI Config` (Header) → `Logging` (global tab strip). Both `PerWebsiteConfigSection` and
`GlobalConfigSection` render together at `UIConfigPage/index.tsx:19-20`.

Assert numerically, not visually — clip is a geometry problem, so measure it:

```js
const first = document.querySelector('#err-lvl-debug');
const group = first.closest('[role=radiogroup]') || first.parentElement;
const g = group.getBoundingClientRect();
const kids = [...group.children].map(k => k.getBoundingClientRect());
// PASS when: no kid.right > g.right + 1, and group.scrollWidth <= group.clientWidth + 1
```

Screenshots are useful evidence to *attach*; they are not the assertion. Report the numbers.

## Acceptance

- [ ] No option is clipped at **1024 and 768** — **measured**, with the numbers quoted
- [ ] Report the 360/390 numbers too, and state plainly that they are **still broken** and
      why (the 32px cell is T15's problem, not yours). Do not claim the control is fixed
      at phone widths; it is not, and saying so is part of the deliverable.
- [ ] `npx tsc -b`, `npm run lint`, `npm run build` all exit 0
- [ ] `git diff --stat` shows **one file, one line** (plus incidental diff noise). Quote it
- [ ] `Workspace.tsx`, `Header.tsx`, `SectionRow.tsx` untouched — T15 owns those
- [ ] No file under `src/components/ui/**` touched
- [ ] No new dependency, no new file **in the repo**, no new token
- [ ] Layout re-verified **after** the change, not before it

Ponytail check — rung 6, one line before fifty: this is one CSS class. It is worth a pass
only because it is a live Rule 5 failure and it needed measuring. If you find yourself
adding a wrapper div, a container query, or a responsive breakpoint to solve this, stop —
the fix is one class and your solution is now more complex than the problem.

## Do NOT

- **Never run a mutating git command.** No commit, merge, rebase, pull, push, stash,
  checkout, tag, or `git mv`. Read-only `git status` / `git diff` / `git show` are fine.
- Do not edit anything under `src/components/ui/**`.
- Do not change the control type, the option list, `ERROR_LOG_LEVELS`, or the number of
  levels. The 9 levels are correct — upstream has 8 plus per-site `none`, and the type and
  the UI were deliberately brought into agreement in T3 (A-D14). **The value set is right;
  only its layout is wrong.**
- Do not touch `per-website-config/logging-section.tsx`. It is a `<select>`; it cannot
  overflow and it is not broken.
- Do not add a dependency or a screenshot/browser tool.
- Do not "improve" the neighbouring Cloudflare checkbox rows while you are in the file.
- Do not start feature work. T14 exists because a real defect outranks the feature queue.