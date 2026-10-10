---
doc: checklist
status: approved
---
# Build Checklist

Build mode: fast — the learner requested action and gave full consent to building the contest app. Keep explanations concise. Full consent covers implementation order and local checkpoints; it is not evidence that the learner has tried or reviewed the finished app.

## Slices

- [x] **1. Check an evening, accept a permitted workout and reopen the saved week**
  Becomes usable: A complete small weekly browser planner demonstrating fixed conflicts, transition time, permitted workout suggestions, explicit acceptance and on-device week persistence.
  Why now: The scheduling kernel is visible immediately; this small app needs one coherent usable slice rather than separate plumbing steps. The first hands-on session can also be the final exploration.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behavior`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Week Interface`, `spec.md > Scheduling Engine`, `spec.md > Local Week Storage`, `spec.md > Local Preview`, `spec.md > Verification`
  Build: Bootstrap the buildless app and loopback preview; implement the real scheduling engine, single weekly screen, accessible explanations, explicit acceptance and guarded local storage. Include clearly labeled fictional examples.
  Verify (mechanical): Run Node scheduler/storage tests; start the preview and check successful HTTP and private-file exclusion; exercise fixed conflict, movable acceptance, stale result invalidation and persisted day isolation in a supported browser; check desktop and narrow layouts. Report any unavailable verification honestly.
  Learner check: Open the app, check the fixed example, then mark a workout movable and accept a suggestion. Change another day and refresh. Say what feels confusing or needs changing.
  Commit: `Build weekly planner with transition-aware scheduling and local persistence`

## Hands-on Checkpoints

- [x] Early usable behavior explored — shared final-review session for this single-slice build
- [x] Final kick-the-tires exploration and feedback completed — learner reports that the opened demo works and approves its visual style; no changes requested

## Final Review

- [x] Final review complete — learner reports the demo works, approves the look and authorizes public source publication after asking about entering the contest; no revisions requested

## Code Tour and App Map

- [x] Learning activity complete — brief project-grounded recap delivered, linking the transition requirement to its tested implementation
- [x] Optional edit and transfer reflection addressed — label/color edit pointers offered; no edit requested and no personal reflection drafted
- [x] `devpost/app-map.html` generated from finished code, checked, and shown as a file link

Activity and evidence: Implementation and 15 mechanical tests are complete. The learner opened the standalone demo, reported it works and matches the desired visual style, then authorized public source publication. A brief recap explained the check-button → scheduling → visible-result path and why the transition boundary test matters. No claim is made that the learner individually confirmed every test or performed an editor exercise.
Route and stops: Reference route checked against actual source: `dist/app.mjs` submit handler → `dist/planner.mjs` `checkDay`/`fits`/`acceptSuggestion` → `dist/app.mjs` `renderResult`. The map also points to `renderTimeline` and local storage.
Edit outcome: Optional label/color pointers offered; no edit requested or performed.
Reflection: Optional personal reflection was not requested or supplied; no statement of learner mastery is inferred.
Activity mode: Brief recap and static reference map, not a live editor tour.

## Revisions

- Mechanical evidence: 15 Node tests pass, including a preview process serving assets and excluding private files. The scheduling boundary sweep checks 125 combinations of duration, transition and requested time.
- Interactive browser QA remains unverified: the retained preview address timed out; a background launch was rejected by automatic approval review. The same preview serves successfully inside the automated test. Preserve the working server and report this environment limit rather than weakening network protections.
- The single implementation slice is mechanically complete. Learner exploration, positive feedback, public-source authorization and the brief learning wrap-up are recorded. These observations do not constitute a completed Devpost submission.
- Optional Sites source synchronization is blocked: automatic approval review rejected the supported helper's credential input through stdin. No source push, saved version or live deployment is claimed. Keep the persisted Site identity for a later supported retry; do not bypass the credential handling contract.
- A standalone local HTML companion is packaged from the same implementation for convenient opening. It does not replace the canonical HTTP preview; direct-file persistence depends on the browser and retains the existing guarded-storage notice.
