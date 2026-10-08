# Response — Agent — audit: auth, folder structure, dependencies, competitive option parity
Date: 2026-10-08
Status: DONE

## User request

Four things, in the user's words: (1) investigate whether the app supports auth;
(2) investigate whether the folder structure should be tidied for readability,
SOLID/DRY/KISS/modularity; (3) ensure the libraries are up to date; (4) parse the
three competitor sites named in the SRS for the nginx UI/setup they provide, merge
all of it, and ensure the UI tab covers it — "a core requirement". All of it to be
written into CONTEXT **before** any of the fixes are worked on.

## Plan approved

Investigation + documentation only. No source changes. Two files written:
`docs/competitive-options.md` (new) and `agent-docs/CONTEXT.md` (updated). The three
structural fixes themselves were explicitly deferred by the user.

## What I did

**Auth — investigated, none exists, and none should.** No user model, no route guard,
no `react-router` in `package.json`. `grep` for `fetch(`/`axios`/`XMLHttpRequest`
across all of `src/` returns zero hits — the app makes no network calls at all.
Persistence is `zustand/persist` → localStorage only. This is spec-correct
(`Nginx Config Visualizer.md:61,27`), and NPM's users/permissions/audit-log is a
competitive *disadvantage* for a pure-client tool, so it is recorded as explicitly
do-not-copy.

**Folder structure — investigated, recommended no reorganisation.** The layout is
fine; three real defects live in it, none of them layout. (1) `src/Components` vs
`src/components` casing — 21 of 34 tsc errors, one `git mv`. (2) `GlobalConfigState`
is a flat 60-field bag while `Site` is nested — the one genuine modularity problem.
(3) DRY debt in the 18 section files (92 `SectionRow`, 62 hand-rolled checkbox pairs,
38 `as` casts). Recommended *against* deleting the 47 unused shadcn files: one
directory, tree-shaken, and they are the design system.

**Dependencies — audited via `npm outdated`.** Nothing stale enough to break anything.
Held two majors on purpose (`typescript` 7.0.2 and `@babel/core` 8.0.7 — both would
churn the compiler/typecheck surface we are about to fix). Flagged 10 packages in
`dependencies` with zero imports in `src/`. Noted that `reactflow` is *not actually
imported* — its only hit is the string `"ReactFlow"` inside a comment.

**Competitive parity — the substantial piece.** Established that **Serverion is a
fork of `digitalocean/nginxconfig.io`, not an independent third source** (its page
renders no server-side HTML; recovered its surface from the `nginx.des.capital`
mirror). Read nginxconfig.io's actual option definitions out of its Vue templates
rather than guessing from marketing copy. Diffed all of it against our
`UIConfigPage` sections.

Headline findings:
- Our per-site HTTPS (11/11), PHP (9/9), Routing (6/6), Restrict (10/10), Logging
  (9/9) and Server (8/8) field coverage is **already complete**. The gaps are not
  missing fields in those sections.
- **Presets panel entirely missing** (nine booleans) — the SRS sells "Superior (more
  presets)" and we have none.
- **Setup sections entirely missing** (Download / SSL / Certbot / Go live) — that is
  SRS §3.4's "Go Live Checklist", and it is also where `CodeConfigPage`'s dead
  Format/Save buttons belong.
- NPM-only capabilities with zero UI: redirection hosts, 404 hosts, TCP/UDP streams,
  access lists, certificates-as-entity with DNS challenge, 12 custom-snippet injection
  points.
- **Enum types are truncated or missing**, so the generator cannot be written
  honestly: our `errorLogLevel` allows 5 of 8 upstream values, `referrerPolicy` is bare
  `string` where upstream is an 8-value enum, `phpServer`'s `<option>` values are
  invented short keys rather than real `fastcgi_pass` socket paths.
- **Default-value drift**: `modularizedStructure`/`symlinkVhost` false (upstream true),
  `clientMaxBodySize` 1 (16), `redirectSubdomains` false (true), expiries `max` (`7d`),
  `accessLogParameters` `combined` (`buffer=512k flush=1m`).
- **No gating, no mutual exclusion** — 14 documented conditional dependencies
  upstream, none enforced here.

## Verification

Commands run, all read-only:

- `npx tsc -b` → **34 errors**. Broken down by code: 21 × `TS1261`, 4 × `TS2322`,
  2 × `TS2339`, 2 × `TS2552`, 1 each `TS1149`/`TS2448`/`TS2454`/`TS2353`/`TS7006`.
  This corrected CONTEXT.md §7, which previously attributed the errors to "shadcn
  primitives and path-alias noise" — most of them are one casing bug.
- `npm run lint` → **13 errors**, 11 `react-refresh` in generated `ui/*` + 1
  `react-hooks/set-state-in-effect` in `hooks/use-mobile.ts`. Matches the prior record.
- `npm outdated` → 56 rows. Recorded the full hold/upgrade split in CONTEXT.md §6c.
- Import census over `src/` for all 14 non-trivial runtime deps → the unused list in
  §6c is measured, not guessed.
- `node -v` / `npm -v` → v22.19.0 / 11.6.0.
- Web research: `nginxproxymanager.com` guide/setup/advanced-config/certbot/faq +
  screenshots index; `digitalocean/nginxconfig.io` tree API; the nginxconfig.io
  option templates and English i18n label files; `serverion.com/nginx-config` (empty)
  and its `nginx.des.capital` mirror.
- Read the edited CONTEXT.md back: 360 lines, §1–§9 plus new §6b/§6c, no duplicated
  or orphaned sections, the now-redundant trailing "Case-sensitivity" note removed
  (Rule 6: delete what is redundant).

## Self-review (Absolute Rule 6)
- **Broke existing behavior?** No source file was touched. Two markdown files only.
- **Renders correctly at target widths?** N/A — no UI change.
- **Empty/loading/error path present?** N/A — no UI change.
- **Dead/duplicated/redundant code found:** the old trailing "Case-sensitivity" note
  in §7 duplicated the new expanded analysis — deleted. Also corrected the stale
  "branch @ `e143fcc`" header to the actual `b835b0d`, and the stale §9 claim that
  4 type errors were the whole story.
- **UI/UX standard held (Rule 5)?** N/A — no UI change. Recorded that the Presets and
  Setup sections are *missing* rather than badly styled, which is the more serious
  finding.

## Ponytail audit
- **Skipped:** actually upgrading dependencies. Only `npm outdated` was run — no
  install was performed. Reason: `typescript` 7 and `@babel/core` 8 are majors that
  will churn a typecheck error list we have not fixed yet, and the user said the
  library question was a prerequisite for the rest, not a green light to bump
  majors. `npm update` for the ~50 compatible bumps is a one-line follow-up.
  Add when the build is green.
- **Skipped:** deleting the 8 zero-import runtime deps. They are inert, and
  `npm uninstall` while the build is red is how you lose track of which change broke
  what.
- **CONTEXT.md updates needed:** done in this session — new §6b (competitive parity),
  §6c (dependencies), rewritten §5/§7/§9, directory map amended for
  `docs/competitive-options.md`.

## New issues / edge cases noticed (not in scope now)
- **A-I1** — `DEFAULT_SITE` in `defaults.ts` carries a stray top-level `domain` key
  that is not on the `Site` type. Leftover from before the config was nested. Harmless
  today; will confuse once the global state is nested. Fold into the task 2 rename.
- **A-I2** — `reactflow` 11.11.4 is up to date but superseded by `@xyflow/react`. We
  pay for it in the dependency tree without importing it. Decide before Milestone 5
  writes the real logic map, not after.
- **A-I3** — 14 upstream conditional dependencies (gating) are documented but
  unenforced. These will surface as confusing dead UI (a field that can be set but has
  no effect) once the generator exists. Cheaper to enforce with the generator than to
  retrofit.
- **A-I4** — Serverion's option surface could only be recovered via a third-party
  mirror (`nginx.des.capital`), because `serverion.com/nginx-config` is a JS-only SPA.
  If their UI is forked from DO as that evidence suggests, tracking nginxconfig.io is
  sufficient and Serverion needs no separate audit. Worth one confirmation visit
  rather than a standing watch.
  **→ CLOSED 2026-10-08 (second session).** User supplied a screenshot of the live
  tool. It confirms the fork (footer credits DigitalOcean) and shows Serverion is an
  *older* fork: no per-site Restrict/Onion, no global Reverse proxy/Docker, plus a
  global PHP tab DO dropped. Nothing to track separately. `docs/competitive-options.md`
  §1a now records the exact tab-by-tab delta.

## Addendum — second session (2026-10-08, screenshot confirmation)

The user confirmed `serverion.com/nginx-config` is unchanged and supplied a screenshot of
it. Two things came out of that beyond closing A-I4:

1. **The generated file tree is now known**, not inferred — `nginx.conf` +
   `nginxconfig.io/{general,security,php_fastcgi,letsencrypt}.conf` + three per-site
   files under `sites-available/`, symlinked from `sites-enabled/`. This was the single
   biggest unknown blocking Task 4. Now in `docs/competitive-options.md` §1b and
   `CONTEXT.md` §6b-i.
2. **The screenshot independently validated three of our suspect defaults** —
   `redirectSubdomains` renders checked (ours `false`), `client_max_body_size` is 16M
   (ours `1`), and the OCSP resolver group shows Quad9/Verisign present-but-off exactly
   as the source said.

It also **closed my own open question** about `worker_rlimit_nofile` / `multi_accept`:
they are emitted with no UI field upstream too, so they are fixed preamble for the
generator. Not a gap. No question stands.

## Decisions taken
- **A-D1** — Hold `typescript` at 6.0.3 and `@babel/core` at 7.29.0 despite newer
  majors being available. Both are load-bearing for the typecheck and React Compiler
  output we are about to stabilise. Recorded in CONTEXT.md §6c with the revisit
  condition.
- **A-D2** — Treat DigitalOcean's nginxconfig.io as the canonical generator spec and
  Serverion as a lagging copy, rather than maintaining a three-way option matrix. Two
  of the three competitors share one vocabulary; a three-way matrix would imply a
  false independence and cost maintenance for nothing.
- **A-D3** — Recommend *against* tidying the folder structure, and against deleting
  the unused shadcn primitives. The defects are in state shape and dependency
  hygiene, not layout. Recorded so the next session does not "fix" the tree.
- **A-D4** — Re-sequenced §9: the flat-vs-nested `GlobalConfigState` fix moves ahead of
  the generator, because the generator reads that bag directly and writing it against
  the flat shape means writing it twice.
- **A-D5** — Recorded NPM's auth/user/DB features as explicitly do-not-copy. SRS §4
  makes client-side-only a headline advantage; adding accounts would trade it away.

## Questions
- ~~Serverion's own page gives no HTML. Do you have a session where you can open
  `serverion.com/nginx-config` and confirm it is still the nginxconfig.io fork?~~
  **Answered — yes, it is the fork, unchanged. See the addendum below. Nothing further
  needed.**
- ~~`worker_rlimit_nofile` and `multi_accept` appear in our `createNewConfig` default
  nginx.conf but have no UI field (upstream has none either — they are only emitted).
  Should the generator expose them, or keep emitting them fixed?~~
  **Answered by the screenshot: keep emitting them fixed. Upstream has no UI field for
  either, so this is fixed preamble, not a gap.**

**No open questions.**
