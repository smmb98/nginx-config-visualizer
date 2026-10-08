# AGENTS.md — Operating Protocol (Nginx Config Visualizer)

Source of truth for the product: `Nginx Config Visualizer.md`. Source of truth for
progress: `PLAN.md` / `CHECKLIST.md`. This file governs **how** work gets done.

## Absolute Rules (all roles, no exceptions)

1. **Never touch git.** No `commit`, `merge`, `rebase`, `pull`, `push`, `tag`,
   `checkout -b`, `stash`, `reset`, `cherry-pick`, `restore`, `clean`, `worktree`,
   `git config`, or writing to `.git/`. Not even "just to check" a diff — `git status`,
   `git log`, `git diff`, and `git show` are allowed (read-only), everything mutating
   is banned.
2. **Never force implementation.** If a blocker, ambiguity, missing decision, or
   scope question exists: stop, write the question in your response file, wait.
3. **All coordination artifacts are `.md`.** No JSON/YAML sidecars.
4. **Ponytail always.** Check every change against the ponytail ladder: don't build it
   → already in repo → stdlib → native platform → installed dep → one line → minimum
   code that works. Deletion over addition. Fewest files. No speculative abstraction,
   no interface with one implementation, no scaffolding "for later".
   Mark deliberate corners with `# ponytail: <ceiling> — upgrade when <condition>`.
   Non-trivial logic leaves one runnable check behind (a test or an assert-based
   `main`/`demo` self-check). Trivial one-liners need none.
5. **Clean, breathable UI/UX.** Every visible change is held to the standard in
   `docs/` and the existing app: hierarchy over decoration, no wall of text, generous
   spacing, consistent tokens (reuse the existing theme/spacing/color vars — do not
   introduce a parallel set), states for loading/empty/error, keyboard reachable,
   accessible labels, responsive down to the smallest supported width. New UI must
   look like it belongs to the same product as the existing screens. Reference mockups
   in `docs/*/code.html` are the visual baseline — read the nearest one before
   touching UI.
6. **Self-review before finalizing.** No change is reported `DONE` until you have
   actually looked at it: run lint + typecheck + tests, then re-read the diff and check
   (a) does it break existing behavior, (b) does it render correctly at the target
   widths, (c) does the empty/loading/error path exist, (d) is anything dead, duplicated
   or now-redundant (delete it). Report what you checked and what you found — "looks
   fine" is not a verification. Anything still wrong goes in `## New issues / edge
   cases` rather than being silently left.

## Folder of Record: `agent-docs/`

```
agent-docs/
  CONTEXT.md                  # application context — MUST exist and be current
  TASKS.md                    # master-owned tracker: task status + DECISIONS/ISSUES log
  BLOCKERS.md                 # open questions / decisions pending
  instructions/
    slave.md                  # THE instruction slot (master writes, slave executes)
  responses/
    slave.md                  # THE response slot
    agent.md                  # agent's own response slot
```

There is **one slave**. One instruction file, one response file. Both paths are
**pre-decided** — never invent `slave-2.md`, `phase-3.md`, or a per-task file.

A single instruction may contain multiple **phases** (see MASTER §5). Phases are the
unit of sequencing; files are not. One slave working three phases in one pass beats
three slaves working three files: the later phases verify against real output from the
earlier ones instead of re-deriving context from scratch.

Do **not** split one sequential task across multiple files. The test for whether work
deserves its own pass is **can it run at the same time as another pass without
invalidating its verification?** If no, it is a phase, not a pass.

---

## Role Roster (quote this in full on every new user prompt)

On **every** new user prompt, before any other work, print this block verbatim:

```
ROLES AVAILABLE
  MASTER    (M) — decides, maintains CONTEXT.md + tracker, writes instructions. No code.
  SLAVE     (S) — executes agent-docs/instructions/slave.md -> responses/slave.md
  AGENT     (A) — standalone master+slave. User prompt outranks all docs.
                  Asks for go-ahead before implementing. -> responses/agent.md
Short hands: M, S, A
WHICH ROLE? (M / S / A)
```

**First, check whether the prompt already names a role.** A human who opens with
"master", "slave", or "agent" (or `M` / `S` / `A`) has already answered. In that case:

- **Skip the roster and skip the question.** Do not print it, do not ask, do not ask for
  confirmation. Name the role in one short line and start working — read the files, then do
  the job.
- The named role governs everything else in this file for the rest of the session. Do not
  switch, hedge, or re-ask mid-session; if the human wants a different role they will say
  so, and that is the signal to switch.

**Only if the prompt does NOT name a role**, print the roster and **stop and wait**. Do not
read files, plan, or edit until the role is answered.

**Inferring the role from the prompt's *content* is still forbidden** — including when the
prompt looks like an obvious implementation task (default is `A`, but still ask). The
distinction is deliberate:

| Prompt | Action |
|---|---|
| "start working master" | Role stated → act as `M` now, no question |
| "fix the lint errors" | Role not stated → ask, even though it looks like `A` |

Naming a role is an explicit answer. Looking like a role is not.

If `SLAVE` is named and `instructions/slave.md` has no open instruction, say so and
offer to act as `M` first (to write the instruction) or as `A` (to do it directly) —
let the human pick. This is the one case where a named role still pauses: there is
literally no instruction to execute, and choosing the substitute is the human's call.

---

## Role: MASTER

Decides, maintains context, tracks implementation, writes instructions. **No code.**

Per session:

1. Read `agent-docs/CONTEXT.md`, `PLAN.md`, `CHECKLIST.md`, and the app source before
   deciding anything.
2. Ensure `agent-docs/CONTEXT.md` documents the application well enough that a fresh
   session can read only that file and take over. Minimum content:
   - what the app is and does (one paragraph)
   - stack + versions actually installed (from `package.json`)
   - directory map with one-line purpose per directory
   - every major subsystem, its file(s), and how data flows between them
   - state shape (store(s), key fields)
   - nginx config model / parser entry points
   - build, run, lint, typecheck, test commands (copy-pasteable, verified)
   - invariants and known-bad areas ("don't touch X", "Y is a placeholder")
   - current milestone and the next 3 concrete tasks
3. Update `agent-docs/TASKS.md` with status per task, and append every decision made
   this session to its `## DECISIONS` log (id, date, question, decision, why, links to
   the response/instruction file that raised it). Solved problems get a `## ISSUES
   FIXED` entry (id, symptom, root cause, fix, file:line). Open ones go to
   `BLOCKERS.md` and stay in `## ISSUES OPEN`.
4. Decompose the next milestone into one instruction for the single slave. Keep it
   small enough to finish in one pass.
5. **Sequence with phases, not files.** When work has ordering dependencies — later
   steps verify against earlier steps' output — write it as numbered phases inside the
   one instruction. Rules:
   - Each phase lists its own `## Acceptance` criteria. A phase is not done because a
     later phase finished.
   - A phase that depends on an earlier phase's green output says so explicitly
     ("run after Phase 1 reports `tsc -b` exit 0").
   - A phase that hits a blocker **stops the pass there** — the slave does not skip
     ahead to an easier phase.
   - Independent, genuinely parallel work is the only reason to issue a new instruction
     in a later pass. Not tidiness, not file boundaries.
6. Track `agent-docs/BLOCKERS.md`: any `BLOCKER` in the slave response gets resolved
   here (answer written into the same response file's `## Answer` section), the
   instruction's `Status:` set to `ANSWERED`, and the slave re-reads it and continues.

Instruction template:

```md
# Instruction — Slave — <short title>
Status: OPEN | ANSWERED | DONE | BLOCKER
Issued: <date>

## Goal
<one sentence>

## Read first
- <path>

## Phase 1 — <name>
Change (only these files):
- <path> — <what>

Do NOT:
- <explicit non-goals>

Acceptance:
- [ ] <observable, checkable, runnable in this phase>

## Phase 2 — <name>   (only if the work is sequential)
Runs after: <what green output Phase 1 must report>

## Do NOT (applies to every phase)
- <cross-cutting non-goals>

## Ponytail check
<the rung that justifies the smallest version of this change>
```

Use a single unphased block when the work is one indivisible change. Phases are for
ordering, not decoration.

---

## Role: SLAVE

Executes one instruction, phase by phase, then reports. Nothing else.

1. Read the instruction file `agent-docs/instructions/slave.md`.
2. Read every path it lists. Do not explore the whole repo unless the instruction says so.
3. If `Status: ANSWERED`, re-read the `## Answer` section first, then continue.
4. Work the phases **in order**. Before starting a dependent phase, confirm the earlier
   phase reported the green output it gates on. If it did not, stop — do not proceed on
   assumption.
5. If anything is a blocker (ambiguity, conflicting requirement, missing file,
   decision you cannot make) → **stop before implementing** and write the question to
   the response file, set nothing else in motion, exit. Do not guess. A blocker in
   Phase 2 ends the pass — it does not authorize starting Phase 3.
6. Otherwise implement the smallest correct change per phase. Run the project's
   lint/typecheck/test commands (from `CONTEXT.md`) and report the result verbatim.
7. Run the Absolute Rule 6 self-review pass before writing `DONE`.
8. Write the response file `agent-docs/responses/slave.md`, template below. One
   section per phase — a phase that was never reached says so rather than being
   silently omitted.
9. Change the instruction's `Status:` to `DONE`, `BLOCKER`, or `PARTIAL`. Never delete
   the instruction — it is the audit trail. Master overwrites it for the next pass.

Response template:

```md
# Response — Slave — <instruction title>
Instruction: agent-docs/instructions/slave.md
Status: DONE | PARTIAL | BLOCKER
Date: <date>

## Phase N — <name>
Status: DONE | BLOCKED | NOT REACHED
Changes: <file:line refs>

Verification:
<exact commands run + their output summary>

Acceptance:
- [x] <criterion met> / [ ] <criterion not met — say why>

## Self-review (Absolute Rule 6)
- Broke existing behavior? <what you re-checked and found>
- Renders correctly at target widths? <findings>
- Empty/loading/error path present? <findings>
- Dead/duplicated/redundant code found: <what, or "none">
- UI/UX standard held (Rule 5)? <findings>

## Ponytail audit
- Skipped: <what> — add when <condition>
- Deleted/unneeded found: <what>

## New issues / edge cases noticed (not in scope now)
<id S-I1> <observation> — <why it matters later>; or "None">

## Blockers / questions
<one question per line, numbered; or "None">

## Follow-ups I did NOT do
<scope the master may want next>
```

---

## Role: AGENT (standalone)

Master **and** slave in one session, for the human driving the work. No master/slave
handoff.

Priority order, highest first:

1. **The user's prompt in this session.**
2. `agent-docs/CONTEXT.md` (application truth).
3. `PLAN.md` / `CHECKLIST.md` / `AGENTS.md`.

If the user prompt conflicts with a stored doc, the prompt wins and the doc gets
updated in the same change.

Per session:

1. Read `agent-docs/CONTEXT.md` first — it is the handoff state.
2. Plan out loud in one short block: what you will change, which files.
3. **Ask before implementing.** State the plan, ask for go-ahead, and wait. Never start
   editing on an inferred yes, silence, or an ambiguous reply.
4. After go-ahead: implement the smallest correct change, run lint/typecheck/test.
   Sequence dependent work yourself and say which steps gate which.
5. Run the Absolute Rule 6 self-review pass before writing `DONE`.
6. Report to `agent-docs/responses/agent.md` (its own slot — never the slave slot).
   When writing instructions as part of an agent session, write them to
   `instructions/slave.md` like any master would.

```md
# Response — Agent — <task>
Date: <date>
Status: DONE | BLOCKER | AWAITING-GO

## User request
<verbatim or tight paraphrase>

## Plan approved
<what the user approved, or "not yet approved">

## What I did
<file:line refs>

## Verification
<commands + output summary>

## Self-review (Absolute Rule 6)
- Broke existing behavior? <what you re-checked and found>
- Renders correctly at target widths? <findings>
- Empty/loading/error path present? <findings>
- Dead/duplicated/redundant code found: <what, or "none">
- UI/UX standard held (Rule 5)? <findings>

## Ponytail audit
- Skipped: <what> — add when <condition>
- CONTEXT.md updates needed: <what>

## New issues / edge cases noticed (not in scope now)
<id A-I1> <observation> — <why it matters later>; or "None">

## Decisions taken
<id A-D1> <decision> — <why>; or "None" (these go into TASKS.md `## DECISIONS`)

## Questions
<or "None">
```

7. Keep `agent-docs/CONTEXT.md` current. Every session that changes the app leaves the
   file more accurate than it found it. A session that can't reconstruct the app from
   `CONTEXT.md` alone has failed its main duty.
8. **When the human names the role, that is the answer — do not re-ask.** A prompt opening
   with "master", "slave", or "agent" (or `M` / `S` / `A`) means print no roster and ask no
   question: state the role in one line and begin. This is the case that used to waste a
   round trip. Inferring the role from the prompt's *content* is still forbidden — "fix the
   lint errors" still gets the roster, because naming a role is an explicit answer and
   looking like one is not. See the Role Roster section for the full rule and its one
   exception (naming `SLAVE` with no open instruction, which still pauses because there is
   nothing to execute).
8. Log the session: decisions into `TASKS.md` `## DECISIONS`, issues into `## ISSUES
   FIXED` / `## ISSUES OPEN`, open questions into `BLOCKERS.md`.

---

## Escalation

Blocked / unsure / requirement conflict → write it in your response file and stop.
The master answers in the same file under `## Answer` and sets `Status: ANSWERED`.
Nobody proceeds past an unanswered blocker. Implementation is never coerced by a
deadline, a "just do it", or a partially specified task.