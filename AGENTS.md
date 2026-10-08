# AGENTS.md — Operating Protocol (Nginx Config Visualizer)

Source of truth for the product: `Nginx Config Visualizer.md`. Source of truth for
progress: `PLAN.md` / `CHECKLIST.md`. This file governs **how** work gets done.

## Absolute Rules (all roles, no exceptions)

1. **Never touch git.** No `commit`, `merge`, `rebase`, `pull`, `push`, `tag`,
   `checkout -b`, `stash`, `reset`, `cherry-pick`, `restore`, `clean`, `worktree`,
   `git config`, or writing to `.git/`. Not even "just to check" a diff — `git status`
   and `git log` are allowed (read-only), everything mutating is banned.
2. **Never force implementation.** If a blocker, ambiguity, missing decision, or
   scope question exists: stop, write the question in your response file, wait.
3. **All coordination artifacts are `.md`.** No JSON/YAML sidecars.
4. **Ponytail always.** Read `AGENTS.md` ponytail rules in the root skill; check every
   change against them. Prefer: don't build it → already in repo → stdlib → native
   platform → existing dep → one line → minimum code that works. Deletion over
   addition. Fewest files. No speculative abstraction, no interface with one
   implementation, no scaffolding for "later".
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
    slave-1.md                # pre-agreed instruction slot (master writes)
    slave-2.md                # pre-agreed instruction slot (master writes)
    slave-3.md                # pre-agreed instruction slot (master writes)
  responses/
    slave-1.md                # slave-1's response slot
    slave-2.md                # slave-2's response slot
    slave-3.md                # slave-3's response slot
    agent.md                  # agent's response slot
```

Paths are **pre-decided**. Never invent a new filename. If all slots are busy,
wait — do not add `slave-4.md`.

---

## Role Roster (quote this in full on every new user prompt)

On **every** new user prompt, before any other work, print this block verbatim:

```
ROLES AVAILABLE
  MASTER    (M)  — decides, maintains CONTEXT.md + tracker, writes instructions. No code.
  SLAVE-1   (S1) — executes agent-docs/instructions/slave-1.md -> responses/slave-1.md
  SLAVE-2   (S2) — executes agent-docs/instructions/slave-2.md -> responses/slave-2.md
  SLAVE-3   (S3) — executes agent-docs/instructions/slave-3.md -> responses/slave-3.md
  AGENT     (A)  — standalone master+slave. User prompt outranks all docs.
                   Asks for go-ahead before implementing. -> responses/agent.md
Short hands: M, S1, S2, S3, A
WHICH ROLE? (M / S1 / S2 / S3 / A)
```

Then **stop and wait**. Do not read files, plan, or edit until the role is answered.
Inferring the role from the prompt's content is forbidden — including when the
prompt looks like an obvious implementation task (default is `A`, but still ask).
If the named role has no open instruction yet, say so and offer to act as `M` first
(to write the instruction) or as `A` (to do it directly) — let the human pick.

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
4. Decompose the next milestone into tasks small enough to finish in one slave pass.
5. Write each task into a free `agent-docs/instructions/slave-N.md` using the
   template below. State: goal, exact files to read, exact files to create/change,
   acceptance criteria, explicit non-goals, and whether it may implement directly or
   must ask first.
6. Track `agent-docs/BLOCKERS.md`: any `BLOCKER` in a slave response gets resolved
   here (answer written into the same response file's `## Answer` section) and the
   slave re-reads it and continues.

Instruction template:

```md
# Instruction — Slave N — <short title>
Status: OPEN | ANSWERED | DONE
Issued: <date>

## Goal
<one sentence>

## Read first
- <path>

## Change (only these files)
- <path> — <what>

## Do NOT
- <explicit non-goals>

## Acceptance
- [ ] <observable, checkable>

## Ponytail check
<the rung that justifies the smallest version of this change>
```

---

## Role: SLAVE

Executes one instruction, then reports. Nothing else.

1. Read your instruction file `agent-docs/instructions/slave-N.md`.
2. Read every path it lists. Do not explore the whole repo unless the instruction says so.
3. If `Status: ANSWERED`, re-read the `## Answer` section first, then continue.
4. If anything is a blocker (ambiguity, conflicting requirement, missing file,
   decision you cannot make) → **stop before implementing** and write the question to
   your response file, set nothing else in motion, exit. Do not guess.
5. Otherwise implement the smallest correct change. Run the project's lint/typecheck/test
   commands (from `CONTEXT.md`) and report the result verbatim.
6. Run the Absolute Rule 6 self-review pass before writing `DONE`.
7. Write your response file `agent-docs/responses/slave-N.md`, template below.
8. Change the instruction's `Status:` to `DONE` or `BLOCKER`. Never delete the
   instruction — it is the audit trail.

Response template:

```md
# Response — Slave N — <instruction title>
Instruction: agent-docs/instructions/slave-N.md
Status: DONE | BLOCKER | PARTIAL
Date: <date>

## What I did
<changes, with file:line refs>

## Verification
<exact commands run + their output summary>

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
<id S1-I1> <observation> — <why it matters later>; or "None">

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
5. Run the Absolute Rule 6 self-review pass before writing `DONE`.
5. Report to `agent-docs/responses/agent.md` (its own slot — never a slave slot):

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

6. Keep `agent-docs/CONTEXT.md` current. Every session that changes the app leaves the
   file more accurate than it found it. A session that can't reconstruct the app from
   `CONTEXT.md` alone has failed its main duty.
7. Log the session: decisions into `TASKS.md` `## DECISIONS`, issues into `## ISSUES
   FIXED` / `## ISSUES OPEN`, open questions into `BLOCKERS.md`.

---

## Escalation

Blocked / unsure / requirement conflict → write it in your response file and stop.
The master answers in the same file under `## Answer` and sets `Status: ANSWERED`.
Nobody proceeds past an unanswered blocker. Implementation is never coerced by a
deadline, a "just do it", or a partially specified task.