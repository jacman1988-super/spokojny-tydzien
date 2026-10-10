---
doc: scope
status: approved
---
# Spokojny Tydzień / A Calmer Week

A small family-week planner that helps parents fit a workout around an evening caregiving routine, including the time needed between activities.

## The Unique Kernel
Two activities can touch without overlapping and still be impossible to manage because the transition takes time. The planner checks both the workout duration and a user-entered transition buffer against a fixed caregiving block. Alternatives must respect fixed commitments: a workout with a trainer cannot be moved as though its time were freely available. The planner explains conflicts, suggests alternatives only within permitted times, and leaves acceptance to the person.

## Who It's For
A parent balancing personal training and evening caregiving. This use case comes directly from the learner's answer. Actual family routine times remain in the ignored learner profile; public examples use fictional times.

## The Core Loop
Open the weekly view, enter the fixed caregiving interval and desired workout, include the transition time, then see whether the evening works. If it does not fit, review alternatives within permitted times and accept a new workout time, or see why no alternative is available. The learner approved this first-version scope with “działaj” and then clarified that their training is with a trainer.

## Inspiration & Identity
The learner strongly liked the TasteRoute prototype's calm, muted colors and refined presentation. Carry forward the mood in an original interface: warm background, restrained green accents and clear event cards. No TasteRoute source code is reused.

## Why This Matters to the Learner
The learner wants to pursue another competition and specifically identified training and their child's bedtime routine as the situation to improve.

## What "Working" Looks Like
A screen-recordable journey: enter a workout ending at the exact time caregiving begins; add a non-zero transition buffer; see why the evening does not fit. A fixed trainer session stays in place and produces an explicit conflict. For a workout that may be moved, choose a suggested earlier or later time within the available window. The changed plan respects both caregiving and the transition. If no permitted alternative fits, the planner says so. The planner never changes the fixed caregiving interval.

## The POC Boundary
First version: one weekly view with an editable evening for each day, a fixed caregiving block, one workout, a transition buffer, an available time window, fit/conflict checks, and an explicit accept action for a permitted suggested workout time. A trainer commitment cannot be silently rescheduled. Use fictional examples in the demo. This is a proof of concept, not a complete shared family calendar.

## Later
Proposed later candidates: recurring events, sharing with family members, calendar imports and reminders. No later feature is promised for the contest build.

## Explicitly Cut
Proposed cuts for this proof of concept: automatic messages, external calendar access and live travel-time estimates. They require external access or additional data and do not establish the core scheduling loop. These cuts are recommendations for review, not decisions attributed to the learner.

## Review and Open Questions
Scope approved by the learner's “działaj” following the displayed scope review. The transition is editable, including zero when no buffer is needed. The subsequent trainer clarification constrains suggestions to permitted times rather than assuming all workouts are movable. The product document was subsequently approved with “tak”; the technical plan is in draft review and the build checklist has not been created.
