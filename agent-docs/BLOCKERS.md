# BLOCKERS.md — open questions awaiting a decision

Nothing proceeds past an unanswered blocker. A slave writes the question in its own
response file (`responses/slave-N.md`); the master answers in the same file under
`## Answer` and sets the instruction's `Status: ANSWERED`.

As role **A** these get asked in the chat instead. Either way, they are not guessed.

---

## OPEN

### B1 — Shadcn `react-refresh` lint errors: override or leave? **ANSWERED**
**Decision:** override. Scoped eslint rule-off for `src/Components/ui/**` only. Those
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

### B3 — Parser: Web Worker or main thread?
`main`'s abandoned attempt used a Worker. For configs up to 2000 lines (SRS
non-functional req) a plain sync parse is likely fast enough and is far less
plumbing. Is the Worker worth it, or do we parse on the main thread and only reach
for a Worker if a large config actually stutters?

### B4 — Should the 4 unused setters and the `NginxConfig.ast: unknown` shape be
redesigned before anything calls them?
`setParsedConfig` / `setSyntaxErrors` / `setSecurityAudits` / `setHealthScore` exist
with no callers, and `ast` is `unknown`. Building T4 against an untyped `unknown` AST
means guessing the node shape twice. Worth pinning the AST type first?

### B5 — `docs/design.md` vs `src/index.css`: which is authoritative?
`docs/design.md` describes a palette; `src/index.css` holds the actual tokens. They
may disagree. Absolute Rule 5 says reuse existing tokens — confirm `index.css` wins
and `design.md` is reference-only.

---

## ANSWERED

### A-B1 — Shadcn lint rule: override, do not edit generated files
**Why:** hand-editing vendored shadcn primitives to satisfy an HMR lint rule is
backwards — the next `shadcn add` overwrites it. The override is scoped to
`src/Components/ui/**` and nothing else. Recorded as decision A-D4 in `TASKS.md`.

### A-B2 — One instruction file with phases, not one file per step
**Why:** the cleanup work is a dependency chain (Phase 2 needs `tsc -b` green, Phase 3
needs both). Splitting it across files costs a cold read of `CONTEXT.md` per file and
buys no parallelism. A new pass is only warranted when work can genuinely run
concurrently without invalidating its own verification. Recorded as A-D4. B2's real
question (T3 generator vs T4 parser first) stays open — it blocks nothing here.