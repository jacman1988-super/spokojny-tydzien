---
doc: prd
status: approved
---
# Spokojny Tydzień — Product Requirements

A small weekly planner that checks whether training and evening caregiving fit, including the transition between them. The learner approved the displayed product plan with “tak”.

## The Core Journey
Source: `scope.md > The Core Loop` and `scope.md > What "Working" Looks Like`.

1. Open the week and select a day.
2. Enter the evening availability window, the fixed caregiving interval, the workout interval, and the transition duration.
3. Identify whether the workout is a fixed commitment with a trainer or may move within the entered window. The existing trainer booking is fixed by default in the demonstration of the learner's use case.
4. Check the evening. Read either a fit confirmation or a concrete explanation of the conflict, including how many minutes are missing.
5. For a fixed workout, keep the booking and caregiving time unchanged. Explain that an alternative time must first be agreed outside the app. The user can then edit the booking to check that newly agreed time.
6. For a movable workout, review valid alternatives, then explicitly accept one. The accepted workout and its transition now fit without changing caregiving.

## Screens and Layout
Source: `scope.md > The POC Boundary`.

One weekly surface with seven day selectors, the selected day's editable evening, and a readable timeline showing workout, transition, and caregiving. A result area shows the fit explanation and any permitted suggestions. This arrangement implements the approved single weekly view; no additional screens or accounts are proposed.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.

Use the calm, muted presentation the learner liked in TasteRoute: a warm background, restrained green accents, clear cards and generous spacing. Build an original interface. Keep all user-facing wording in Polish. Explain the result with text as well as color.

## Features and Behavior

### Day and Evening Inputs
Source: `scope.md > The POC Boundary`.

Each day has one workout, one caregiving interval, a transition duration and an availability window. Editing another day must not overwrite the current day's entries. Times describe one evening within the same calendar day; overnight planning is deferred. Transition duration is a nonnegative number of minutes and may be zero.

### Fixed Commitments
Source: `scope.md > The Unique Kernel` and the learner's clarification that training is with a trainer.

Caregiving stays fixed during suggestion generation and acceptance. A fixed workout stays fixed too. A conflicting fixed booking produces an explanation and no rescheduling suggestion. Editing a booking is a deliberate user action; the app neither claims trainer availability nor contacts the trainer.

### Fit and Conflict Explanation
Source: `scope.md > The Unique Kernel` and `scope.md > What "Working" Looks Like`.

Two intervals that touch are not sufficient when a nonzero transition is required. Reserve the transition after the workout, whether the workout is before or after caregiving. Both the workout and its transition must fit inside the evening availability window and avoid caregiving.

For a fictional example, a workout at 17:00–18:00, caregiving at 18:00–18:30 and a 15-minute transition produce a visible conflict. The explanation identifies 15 missing minutes. If that workout is fixed, neither interval moves. If it is movable and the evening starts early enough, 16:45–17:45 is a valid earlier proposal.

The approved rule of reserving the transition after every workout also covers a later session.

### Permitted Suggestions and Acceptance
Source: `scope.md > The Core Loop` and `scope.md > What "Working" Looks Like`.

Only movable workouts receive earlier or later proposals within the entered window. Preserve workout duration, respect caregiving and reserve the transition. Show the proposed interval and why it fits. Accepting a suggestion changes only that day's workout; the timeline and fit result update together. Merely viewing a suggestion changes nothing. Editing any input invalidates old suggestions so a stale result cannot be accepted.

### States and Boundaries

- **First use:** offer a clearly labeled fictional example so the core loop can be demonstrated without exposing the learner's actual family schedule. The learner may edit it.
- **Invalid input:** explain missing or invalid times, reversed intervals, or a negative transition. Do not produce a fit confirmation or usable suggestions until corrected.
- **Fits:** show the workout, transition and caregiving without collision, with a text confirmation.
- **Fixed conflict:** show why it fails; preserve both commitments and offer no purported trainer booking.
- **No permitted slot:** explicitly say no workout fits within the entered window; preserve existing entries.
- **After edits:** require a fresh check before accepting alternatives.
- **After reopening:** remember the week on this device, without an account or shared calendar, as approved in the product review.

## Product Decisions

- The learner selected training and their daughter's bedtime routine as the concrete planning problem. Actual times and family details remain in the ignored learner profile.
- The learner supplied a transition duration and then clarified that training is with a trainer. A fixed booking must not be treated as freely movable.
- The learner approved the single weekly view, conflict explanation, permitted alternatives and explicit acceptance loop in scope review.
- The learner's existing visual preference is calm, muted and refined.
- The learner approved the presented recommendations with “tak”: the timeline arrangement, a fixed/movable workout setting for other situations, on-device persistence, and reserving the transition after a later workout too.

## What We're Building

One weekly interface demonstrating input, honest fit checking, a conflict for fixed commitments, permitted alternatives for movable workouts, and an explicitly accepted valid change. A fictional fixed-booking example and a fictional movable-workout example make both paths demonstrable.

## Deferred From the POC

Recurring events, shared accounts, calendar imports, external reminders and trainer booking integrations are deferred. They add integrations beyond the scheduling experiment. Overnight events and multiple workouts per day are also outside the current boundary.

## Non-Goals

Automatic messages, silent changes to commitments, live travel-time estimates, and claims about trainer availability. None is necessary to prove whether the entered evening works.

## Open Questions

Product plan approved by the learner's “tak” following the displayed review. The implementation has not started. Trainer availability is unknown and will not be inferred: users check a different fixed booking only after arranging it themselves. Hosting is optional for this contest and is not a product prerequisite.
