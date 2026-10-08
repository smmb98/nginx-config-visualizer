# BLOCKERS.md — open questions awaiting a decision

Nothing proceeds past an unanswered blocker. A slave writes the question in its one
response file (`responses/slave.md` — there is only one, never `slave-N.md`); the master
answers in the same file under `## Answer` and sets the instruction's `Status: ANSWERED`.

As role **A** these get asked in the chat instead. Either way, they are not guessed.

---

## OPEN

### B1 — Shadcn `react-refresh` lint errors: override or leave? **ANSWERED**
**Decision:** override. Scoped eslint rule-off for `src/components/ui/**` only (lowercase
per the Phase 1a rename). Those
files are generated shadcn primitives; hand-editing them to satisfy an HMR lint rule
is backwards. See Phase 2 of `instructions/slave.md`.

### B2 — Milestone 7 before Milestone 3/4, or after? **DEFERRED — not blocking cleanup**
`UIConfigPage` (generator form) is the most built-out surface, but it is inert: the
form store produces no nginx text. Fixing that first (T3) makes the existing UI
functional; doing the parser first (T4) makes the mockup tabs real. The app has two
front ends pointing at one missing middle.

**Not answered, and deliberately so** — it blocks nothing in the cleanup phase. Raise
it again the moment the build-hygiene instruction reports DONE, because T3 and T4 are
the two competing candidates for the next pass.
**→ ANSWERED 2026-10-08, superseded by B2b.** The audit showed the real ordering is
T3 (nest the store) → T6 (generator), not a straight Milestone-7-vs-3/4 choice.

### B2b — Re-sequencing (raised + answered by the competitive audit, 2026-10-08)
B2 asked whether Milestone 7 (the generator form) or Milestone 3/4 (the parser) comes
next. The second session's audit answered it indirectly and differently from the
original framing: **T3 (nest `GlobalConfigState`) must precede T6 (the generator)**,
because the generator reads that flat 60-field bag directly. The flat-vs-nested fix is
neither "Milestone 7" nor "Milestone 3" — it is a prerequisite both need.

**Now closed as its own task (T3).** B2 as originally written is superseded.

### B6 — Where does the Presets panel live in the UI? **ANSWERED — A-B5 (reversed once)**
The audit found Presets is the SRS's headline "more presets" claim and we have none
(T4). nginxconfig.io renders it as a **collapsible panel above the per-site tabs**, not
as a tab of its own, because it is nine toggles that each *apply a bundle* to the
current site rather than nine independent settings.

That is a real design question, not a mechanical one: nine toggles that mutate nine
other sections need somewhere to live that does not imply they are peers of
Server/HTTPS/PHP. Options are (a) a collapsible panel above the tabs, matching upstream,
or (b) a row of preset buttons in the site tab strip itself.

**→ ANSWERED 2026-10-08, then reversed the same day. Final decision: (a), the upstream
collapsible panel above the per-site tabs. (b), preset buttons in the site tab strip, is
the comparison sample.** Recorded as A-B5.

**How this got fumbled, since the trail matters:** the first version of this blocker
presented two options and asked the user to choose without stating a preference. The
user replied "make yours main" — and there was no stated preference to refer to, so the
answer recorded the tab strip on a rationale invented to fit. That was wrong on the
merits and wrong procedurally: asking a question without a recommendation is not a
question, it is a deferral. A-B5 has been rewritten with the panel as primary.

**Why the panel wins, on the merits:**
1. Nine presets are a **set, not a choice** — nine checkboxes scannable as a matrix, with
   active state visible at a glance. Nine buttons cannot show whether PHP is already
   applied.
2. The site tab strip is **already the most crowded region on screen** — long domain
   names, an Add button, and a close ✕ per site. Nine more items there is the worst
   possible placement.
3. It **surfaces the mutual-exclusion conflict.** Frontend, PHP, Django, WordPress are
   competing options for the *same* site slot, and per `CONTEXT.md` §7 a site cannot be
   PHP and Python and reverse-proxy simultaneously. A panel showing nine checkboxes and
   their effects makes that conflict visible while choosing; scattered buttons hide it
   until the generated config is wrong.

The only real argument for the tab strip was "a preset is an action, so it belongs
beside the thing it acts on." That holds for a single discrete action but not for these:
they are closer to a *profile* — "this is a WordPress site" — which is exactly why
upstream ships a default column showing what each toggle sets.

**"Sample" now means:** a static mockup of the **tab-strip variant** under `docs/`,
matching how the other six designs are held (`code.html` + `screen.png` per direction).
Hardcoded markup only — no store import, no props, no live state. Not a second React
component; that would be dead code in the shipped bundle.

**Blocks T4 only.** T2 and T3 are unaffected.

### B7 — Scope of the Setup sections (T5)
The audit found four missing setup sections: Download (zip + base64), SSL, Certbot, Go
live. Two scope questions:

1. **Download implies ZIP export.** Our file tree is a virtual `FileSystemNode[]`, not
   real files, so "download the zip" means serialising the tree. SRS §3.4 asks for the
   Go Live Checklist specifically; the zip is a natural companion but is separate work.
   Does T5 include the zip, or just the terminal-command checklist?
2. **Certbot and SSL init are largely *static text*** — nginxconfig.io renders commands
   that interpolate a handful of store fields (`letsEncryptRoot`,
   `modularizedStructure`, `symlinkVhost`, per-site `certType` / `letsEncryptEmail`).
   That is cheap. But it depends on T6 having emitted real paths, or the instructions
   will reference files the generator does not produce.

**Blocks T5. Does not block T2, T3 or T4.**

### B11 — Does the Workspace left panel become a drawer on phones? **OPEN — blocks T15**
**Question (raised by master, 2026-10-08):** the smallest supported width is now defined
as a standard small smartphone, 360px (A-D16). Measured at that width, the shell has no
phone layout at all: the left `FileTree` panel is a fixed **200px**, leaving a 156px
content panel; minus the glass-panel's `p-6` that is ~108px; `SectionRow`'s `grid-cols-4`
then leaves every control **32px** wide with an 8px label. **All 12** field rows are
affected and 4 already clip. The Header's children total **788px** in a 360px bar.

**The decision:** at phone widths, does the left panel become an overlay/drawer (toggled
by a button, overlaying the content), or does it collapse to a thin icon rail, or does the
whole shell switch to a stacked single-column layout? These are three different products
and the choice is visual, so it is the human's — measurement cannot settle it.

**Why it is a blocker and not a detail:** T15 cannot be specified until it is answered,
and the answer determines which components change (`Workspace.tsx`, `Header.tsx`,
`SectionRow.tsx` all behave differently in each option).

**Does not block T14**, which is a one-class fix at ≥768px and is issued.

### B3 — Parser: Web Worker or main thread?
`main`'s abandoned attempt used a Worker. For configs up to 2000 lines (SRS
non-functional req) a plain sync parse is likely fast enough and is far less
plumbing. Is the Worker worth it, or do we parse on the main thread and only reach
for a Worker if a large config actually stutters?

### B8 — Where does the parser write, and does it own the file tree? **ANSWERED — A-B6**
**Question:** the app store holds a virtual `FileSystemNode[]` tree and a flat
`rawConfig` string. The target layout is **five global files plus three per site**
(`CONTEXT.md` §6b-i), so `rawConfig` as a single string is the wrong shape — the
generator produces N files, the parser consumes N files, and `CodeConfigPage`'s single
Monaco buffer can only show one of them.

**→ ANSWERED 2026-10-08. Decision: (a) — the file tree is the single source of truth,
and `rawConfig` survives only as "the content of the file currently being edited".**
Recorded as A-B6.

**The deciding measurement (worth keeping):** grepping every file in `src/` outside
`useAppStore.ts` for `rawConfig` and `parsedConfig` returns **zero hits**. Both fields
are currently write-only — nothing reads them. `CodeConfigPage.tsx:35` does not even use
the store; it holds `useState(defaultNginxConfig)` and a frozen `isValid = true`. So the
shape costs nothing to change now and everything to change later.

Consequences, all binding on T6/T7/T8:
- The generator writes **files into the tree**, it does not return one string.
- The parser consumes the whole tree, not one buffer.
- `rawConfig` is derived state (mirror of the active node's `content`), kept only because
  an editor needs a single string to bind to. It must never be edited directly.
- **The visualizer reads the same parsed AST the parser produces** — the user's explicit
  instruction. There is one AST, two consumers: the code view and the logic map. Do not
  build a second representation for the visualizer.
- Keep the multi-file tree even though a combined `nginx.conf` is more convenient to
  eyeball. Option (c) was rejected: two representations of the same config will drift,
  and the tree is already what `FileTree.tsx` renders.

**Blocks T6, T7 and T8.** T2, T3, T4 and T5 are unaffected.

### B10 — Does the global state have to be nested before the generator? **ANSWERED — NO**
**Question:** CONTEXT.md §7, `docs/competitive-options.md` §5 item 2 and BLOCKERS B2b
all asserted the flat 60-field `GlobalConfigState` must be nested before T6 could be
written, on two grounds: it deletes the 38 casts, and it gives `updateField` dotted
paths.

**→ ANSWERED 2026-10-08: no. Both grounds are false.** Measured:

- All 38 casts are on selectors reading **already-correctly-typed** fields, and zero sit
  on a union type. `as boolean` on a `boolean` is legal nested or flat, so a nest leaves
  all 38 standing.
- `updateField` has **189 call sites**, every one a flat key. Dotted paths mean editing
  all 189 to serve a generator that only *reads* state.

Recorded as A-D11; T3 re-scoped to the three enums whose values are genuinely wrong.
Reopen when a second writer of individual global fields appears.

### B5 — `docs/design.md` vs `src/index.css`: which is authoritative?
`docs/design.md` describes a palette; `src/index.css` holds the actual tokens. They
may disagree. Absolute Rule 5 says reuse existing tokens — confirm `index.css` wins
and `design.md` is reference-only.

**Partial answer from measurement (2026-10-08):** `src/index.css` is unambiguously
authoritative for *implementation* — it holds the live tokens (`--headline-md`,
`--on-surface-variant`, the `.glass-panel` utility, the typography scale the section
components actually call). Absolute Rule 5 already settles this; the only thing left to
confirm is whether `design.md` is reference-only or is meant to be updated when tokens
change. Not blocking.

### B9 — Should T4/T5 ship the NPM-only entities, or are they a later milestone?
**Question (new, from the audit):** the audit found six NPM capabilities with zero UI —
redirection hosts, 404 hosts, TCP/UDP streams, access lists, certificates-as-entity,
and the 12 custom-snippet injection points. None are in `PLAN.md` or `CHECKLIST.md`.

Are these in scope for this product at all? SRS §3.2/§3.3 do not mention streams or
access lists, but §2's comparison table claims feature parity plus unique value, and
"Access Lists" is what backs SRS §6's "Rate Limits" under Security — which we currently
model as a bare `limitReq` boolean with no zone or rate fields (issue I12).

**Does not block anything.** T4 (Presets) and T5 (Setup) are both DigitalOcean-derived
and unambiguous. This only matters when deciding what comes after T5, and the honest
answer may be "most of these are out of scope" — a config *generator* has no business
managing live certificates or users. Flag it now so it is a decision rather than an
omission.

---

## ANSWERED

### A-B7 — Nesting the global state: measured, and it is not worth it
**Question (B10):** must `GlobalConfigState` be nested before the generator?
**Decision:** no — A-D11 in `TASKS.md`. The 38 casts are redundant today and go by
deletion, not by nesting; dotted paths would cost 189 call-site edits to serve a
generator that only reads state. **Reopen when a second writer appears.**

### A-B1 — Shadcn lint rule: override, do not edit generated files
**Why:** hand-editing vendored shadcn primitives to satisfy an HMR lint rule is
backwards — the next `shadcn add` overwrites it. The override is scoped to
`src/components/ui/**` and nothing else — lowercase, per the Phase 1a rename in the
reissued instruction. Recorded as decision A-D4 in `TASKS.md`.

### A-B5 — Presets: the collapsible panel ships; the tab strip is the sample
**Question (B6):** collapsible panel above the per-site tabs (upstream), or preset
buttons in the site tab strip?

**Decision:** the **panel is primary and ships**. The tab-strip variant is the
comparison sample — a static mockup under `docs/`, not shipped, not wired to the store.

**Why:** nine presets are a **set, not a choice**. Nine checkboxes read as a scannable
matrix with active state visible; nine buttons cannot show that PHP is already applied.
The site tab strip is also the most crowded region on screen (domain names, Add, close
✕ per site), so nine more items there is the worst available placement. Decisively, the
panel surfaces the mutual-exclusion conflict — Frontend, PHP, Django and WordPress are
competing options for the *same* site slot, and per `CONTEXT.md` §7 a site cannot be
PHP and Python and reverse-proxy at once. Choosing with the checkboxes visible makes
that conflict legible; scattered buttons defer it to a wrong generated config.

The "a preset is an action" argument holds for a single discrete action but not for
these: they are a *profile* — "this is a WordPress site" — which is why upstream ships
a column showing what each toggle sets.

**Procedural note, kept deliberately:** this decision was recorded once wrong. The
original blocker offered two options and asked the user to pick without stating a
preference; "make yours main" then had no referent, and the tab strip was recorded on a
rationale reverse-engineered to fit. The correction was to actually answer the question.
When asking a question, lead with the recommendation.

**"Sample" means:** hardcoded markup in `docs/`, matching the six existing designs
(`code.html` + `screen.png` per direction). No store import, no props, no live state.
Absolute Rule 5 names `docs/*/code.html` as the visual baseline. Not a second React
component — that would be dead code in the bundle.

**Blocks T4 only.**

### A-B6 — The file tree is the source of truth; one AST, two consumers
**Question (B8):** with a multi-file target layout, is a flat `rawConfig` string the
right store shape?

**Decision:** no. **(a) — the tree is the single source of truth.** `rawConfig` survives
only as a mirror of the active file's `content`, because an editor needs one string to
bind to. Binding constraints on T6/T7/T8:

1. The **generator writes files into the tree.** It does not return one string. This is
   the direct consequence of the 5-global + 3-per-site layout in `CONTEXT.md` §6b-i.
2. The **parser consumes the whole tree.**
3. `rawConfig` is **derived**, never edited directly. `updateConfig` keeps writing through
   to the tree by id, as it already does.
4. **One AST, two consumers: the code view and the logic map.** The user's explicit
   instruction — the visualizer reads what the parser produces. Do not build a second
   representation for it. This is also what keeps T10 (ReactFlow) from growing its own
   data model.

**Why:** the alternative (c), a combined `nginx.conf` for display plus modular files for
export, means two representations of one config, and they will drift. The tree is
already what `FileTree.tsx` renders, so it is the shape the app is built around.

**Corroborating measurement:** `rawConfig` and `parsedConfig` have **zero readers** in
`src/` outside `useAppStore.ts` today — `CodeConfigPage.tsx:35` still runs its own
`useState(defaultNginxConfig)`. Changing this shape now is free; changing it after T7
lands is not.

**Blocks T6, T7, T8.**

### A-B3 — The mojibake phase was chasing a phantom; it is deleted
**Question (implicit):** the previous instruction told the slave to fix "committed
mojibake in 3 files" where em-dashes and arrows were meant.

**Decision:** the phase is removed. Measured 2026-10-08 across the whole repository:
**zero U+FFFD replacement characters.** `src/index.css` and
`src/Components/Workspace.tsx` contain `─` (U+2500 box-drawing) and `→` (U+2192) —
legitimate characters in comments that render as `??` in a non-UTF-8 console.
`README.md` is valid UTF-8 and its `dYs?` headings are real emoji (🚀 🎨 ⚡ 🛤️) that the
console shows as `?`.

**Why:** the damage was in the terminal, not the files. Leaving the phase in would have
burned a pass, and — worse — invited the slave to "fix" legitimate characters, which
*would* have created real damage. The instruction now carries an explicit "do not chase
the mojibake, verify with a codepoint dump first" clause instead. Tracked as I10 in
`TASKS.md`.

### A-B4 — Serverion needs no separate audit
**Question:** does `serverion.com/nginx-config` expose an option set we have not
catalogued?

**Decision:** no. Confirmed from a screenshot of the live tool that it is
`digitalocean/nginxconfig.io`, credited as such in its own footer, and an *older* fork
of it (no per-site Restrict/Onion, no global Reverse proxy/Docker, still carries a
global PHP tab DigitalOcean dropped). We already ship three sections it lacks.

**Why:** a three-way option matrix would imply an independence that does not exist and
cost maintenance for nothing. Recorded as A-D8. Nginx Proxy Manager remains the only
additive source. Full evidence in `docs/competitive-options.md` §1/§1a.

### A-B2 — One instruction file with phases, not one file per step
**Why:** the cleanup work is a dependency chain (Phase 2 needs `tsc -b` green, Phase 3
needs both). Splitting it across files costs a cold read of `CONTEXT.md` per file and
buys no parallelism. A new pass is only warranted when work can genuinely run
concurrently without invalidating its own verification. Recorded as A-D4. B2's real
question (T3 generator vs T4 parser first) stays open — it blocks nothing here.