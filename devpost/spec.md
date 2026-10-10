---
doc: spec
status: approved
---
# Spokojny Tydzień — Technical Spec

## Implementation and Shipping Update

The approved blueprint below records the decisions made before implementation. The application is now built, its 15 automated tests pass, and the learner has opened the standalone demo and confirmed that it works and matches the intended visual style. Detailed evidence and remaining browser verification limits are in `checklist.md`.

The learner explicitly authorized creating and uploading public source to [jacman1988-super/spokojny-tydzien](https://github.com/jacman1988-super/spokojny-tydzien). That repository has been created with an MIT License. A demo video, learner-authored submission text and the final contest submission remain pending. Optional Sites hosting is unpublished; there is no verified live hosted demo URL.

## How This Works, In Plain Language

The planner is a small browser application. One part draws the week and the selected evening; another calculates whether the entered intervals fit. The browser remembers the week on this device. Checking an evening does not send the family schedule to another service.

A fixed trainer appointment produces an honest conflict when there is too little transition time. Only a workout marked movable receives alternatives. The person accepts a suggestion; the app then updates that day and checks it again.

Recommended shape: plain HTML, CSS and JavaScript, with no third-party runtime packages or online scheduling service. This serves the approved single-screen experiment with little setup. The tradeoff is that the saved week belongs to this browser and site address; it does not synchronize between devices.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

1. The application loads a validated saved week, or clearly labeled fictional examples when there is no saved week.
2. Selecting a day loads that day's values into the form and timeline.
3. Editing updates that day and saves the week. It clears checked results and suggestions.
4. Checking sends a copy of the form's values to the local scheduling function. Invalid input returns field errors. Valid input returns fits, fixed conflict, movable conflict with proposals, or no permitted slot.
5. The interface shows the reason and any permitted alternatives. Accepting a proposal revalidates it against the current values before changing only the workout interval. A fresh check then shows the updated result.

## Stack

These are agent recommendations awaiting the displayed technical-plan review, not prior learner technology choices.

- HTML with native time inputs and a labeled form. Native time values use `HH:mm`; convert them to minutes before doing arithmetic. [Time input documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time).
- CSS for original responsive styling, with system fonts and no external font request.
- JavaScript ES modules for the interface, scheduling and persistence. No framework or package installation is needed for the proposed browser application.
- Browser `localStorage` for the approved on-device persistence. Its behavior depends on the origin; blocked storage must produce an honest unsaved-session notice. [Storage documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- Node.js 22 or newer, using built-in HTTP and test modules, for a local preview and scheduling tests. No production API server is proposed. [HTTP documentation](https://nodejs.org/api/http.html), [test runner documentation](https://nodejs.org/api/test.html).

Verify the available Node runtime and preview before relying on them. Browser verification is still outstanding; no application code exists yet.

## Where It Runs and How Someone Tries It

Planned local startup from the project directory: `node server.mjs`. Open `http://127.0.0.1:8770/`. Bind only to loopback and serve an explicit allowlist of application assets under `dist/`; do not serve the project directory or private planning profile. If the port is busy, report it and use a documented configurable port.

Use the stable HTTP address for the preview; do not rely on direct `file:` storage behavior. The browser application needs no API key or user account. Node is needed for local preview and tests, not for a visitor to a hosted static version.

Submission requires a public GitHub repository and a short demo video. Record the fixed-conflict and movable-workout acceptance paths using fictional data. Hosting is optional for the contest. The build should remain usable locally if optional hosting cannot complete. If publishing is supported, use the Sites static workflow with `dist/` and a new private Site; source synchronization and deployment must use its supported helper and native tools. An unpublished URL must never be presented as live.

## Look and Feel

Implements `prd.md > Look and Feel`.

Use warm ivory `#F5F2EA`, dark forest `#254B3C`, sage `#DDE7DD`, muted terracotta `#A6533A` and dark readable text `#26332D`. These are implementation choices translating the approved calm palette. Use a readable system sans-serif, generous spacing, a restrained typographic heading and softly outlined cards. Avoid decorative motion that competes with the timeline.

The desktop view places day navigation above the selected evening, with inputs and visual schedule alongside each other where space allows. On narrow screens stack these sections without horizontal overflow. Label time fields and controls explicitly; provide visible keyboard focus, text explanations and a polite result announcement. The timeline has a text equivalent, so color and geometry are never the only evidence of a conflict.

## Components

### Week Interface

Implements `prd.md > Screens and Layout` and `prd.md > Day and Evening Inputs`.

`dist/index.html`, `dist/styles.css` and `dist/app.mjs` render the seven day controls, selected-day form, timeline and result area. Day selection uses buttons with an accessible selected state. Fixed/movable training is an explicit form control. Keep caregiving edits separate from suggestion acceptance.

### Scheduling Engine

Implements `prd.md > Fixed Commitments`, `prd.md > Fit and Conflict Explanation` and `prd.md > Permitted Suggestions and Acceptance`.

`dist/planner.mjs` contains pure validation, fit checking and proposal generation. Represent the workout plus its transition as the half-open interval `[workoutStart, workoutEnd + transitionMinutes)`. It must stay within the availability window and not intersect `[careStart, careEnd)`. Endpoints touching are allowed only once the required transition has been reserved. Caregiving must itself fit within availability. Validate all fields before generating any result.

For a movable workout of duration `d` and transition `b`, permitted start ranges are the earlier range `[availableStart, careStart - d - b]` and the later range `[careEnd, availableEnd - d - b]`, intersected with the availability constraints. Drop empty ranges. In each remaining range choose the start closest to the requested workout start, preserve duration, remove duplicates and reject unchanged proposals. Return at most two proposals, ordered by amount of movement. Recheck every proposal through the same fit function before presenting or accepting it.

A fixed workout never generates proposals. Distinguish actual activity overlap, insufficient transition, and an activity outside the available window in the explanation. For a workout ending exactly when caregiving starts, the missing time is the full transition duration. Do not present an overlap amount as an available trainer appointment.

### Local Week Storage

Implements `prd.md > States and Boundaries`.

`dist/storage.mjs` reads and writes a versioned week under one project-specific localStorage key. Access and JSON parsing are guarded. Check shape, version and day records before adopting saved content. A saved record may contain temporarily invalid form values; preserve those as editable strings and let the scheduling engine identify the errors.

When saving is unavailable, keep the current session usable and display that reopening will not restore it. Corrupt or unsupported saved content produces an explanation and fictional defaults; do not silently claim restoration. Remove or modify only this project's storage key. No whole-browser storage clearing.

### Local Preview

`server.mjs` serves only the explicit static assets with correct content types. It is a development convenience, not a remote API, and never exposes `devpost/learner-profile.md`, `.env`, `.git`, installed skills or test fixtures.

### Verification

Implements the observable criteria in `prd.md > Features and Behavior` and `prd.md > States and Boundaries`.

Use `node --test tests/*.test.mjs` for meaningful scheduler and storage checks: touching intervals with zero/nonzero transition, immutable fixed bookings, valid earlier/later alternatives, no feasible slot, invalid input and stale acceptance rejection. Add storage tests for corrupt/unsupported records and blocked access. Check the UI in a supported browser for input → check → accept → refresh and day isolation, plus a narrow viewport and keyboard use. If browser automation is unavailable, report the limit and request the learner's hands-on check rather than claiming it passed.

## Data Model

Saved week: `{ version: 1, selectedDay: 0..6, days: [seven day records] }`.

Day record: `{ availableStart, availableEnd, workoutStart, workoutEnd, careStart, careEnd, transitionMinutes, fixedWorkout }`. Form values remain strings while being edited; `fixedWorkout` is a boolean. Validated scheduling values are integer minutes within a single day. Transition must be a finite nonnegative integer. Availability, workout and caregiving must each have a strictly increasing interval.

The result and suggestions live only in session memory and are associated with an input revision. They are not restored as checked results. Editing or switching the selected day invalidates the current result; accepting must compare the revision and recompute eligibility. Persist only the week and selected day. Public examples contain fictional intervals and no personal identifiers.

## File Structure

```text
spokojny-tydzien/
├── dist/
│   ├── index.html          # Weekly screen and accessible form
│   ├── styles.css          # Original calm responsive presentation
│   ├── app.mjs             # Day edits, check/accept actions, timeline
│   ├── planner.mjs         # Real scheduling and validation functions
│   └── storage.mjs         # Versioned on-device week persistence
├── tests/
│   ├── planner.test.mjs    # Timing, fixed commitments, alternatives
│   └── storage.test.mjs    # Recovery and unavailable persistence
├── server.mjs              # Loopback-only preview, asset allowlist
├── package.json            # Convenience scripts; no dependencies
├── README.md               # Run, test and fictional demo instructions
├── .gitignore              # Includes private profile and local state
├── devpost/
│   ├── scope.md            # Approved scope
│   ├── prd.md              # Approved product plan
│   ├── spec.md             # This blueprint, awaiting review
│   ├── checklist.md        # Next stage's ordered build slices
│   └── learner-profile.md  # Private, excluded from commits
└── .agents/                # Installed contest skill pack, ignored
```

An `.openai/hosting.json` is added only after a Site identity is actually returned and persisted, with static directory `dist`. No Site identity has been created for this project yet. Packaging must include public source and planning documents, and exclude the private profile and local credentials.

## External Services and Dependencies

The scheduling loop and persistence make no external API calls. There is no model, credential, account, database service or recurring service cost in the proposed runtime. AI is used to collaborate on building the app, not claimed as its scheduling engine.

GitHub is a submission destination to address in shipping; no repository has been created for this project. Optional Sites hosting uses supported source and deployment tools; any approval or infrastructure block must be reported. Publishing local files is a separate action from calculating a family's schedule, which stays browser-local.

## Important Failure Modes

- Invalid or incomplete interval → clear field explanation and no proposals; preserve editable input.
- No room, or two conflicting fixed commitments → explicit conflict/no permitted slot; leave commitments unchanged.
- Browser persistence blocked or damaged → truthful notice and usable session/default example; do not promise restored data.
- Input changes after a check → clear the result and reject any stale acceptance.

## What Was Simplified and Why

One evening and one workout per day establish the kernel without multi-event calendar search. On-device storage meets the approved return-to-app behavior without accounts. Fictional examples make the demonstration reproducible; the scheduling calculations themselves are real. Exact trainer booking and travel estimates remain outside the app rather than being simulated as factual services.

## Decisions and Open Issues

- Scope and product are approved, including on-device storage and explicit acceptance.
- The learner approved the displayed technical plan and gave full authorization to build the contest app. Main tradeoff: saved data belongs to one browser/site address, so there is no phone/computer synchronization.
- No genuine technical uncertainty has been expressed by the learner yet. The agent identified preview and storage availability as verification tasks; these are not attributed to the learner as personal uncertainty.
- The Node runtime, browser behavior and any optional hosting have not been verified for this new app. Verify during build and report actual evidence.
- The learner's full build authorization also covers routine implementation sequencing and local Git checkpoints. The single usable slice is recorded in `checklist.md`; final hands-on review remains outstanding and is not implied by build authorization.
