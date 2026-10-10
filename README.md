# Spokojny Tydzień / A Calmer Week

A calm, browser-local weekly planner built for **Build With AI: Basics**. It checks whether a workout, the transition after it, and a fixed evening caregiving routine fit together. A fixed trainer appointment is never silently rescheduled; movable workouts receive real, validated alternatives that the user explicitly accepts.

## Run locally

Node.js 22 or newer is required for the local preview. No package installation or API key is needed.

```sh
node server.mjs
```

Open **http://127.0.0.1:8770/**. Use the same address when returning to your saved week. A custom port can be provided through `PORT`; changing the site address creates a separate browser storage area.

The root file `Spokojny-Tydzien-demo.html` is a convenient single-file companion generated from these same sources. Download it and open it in a browser. Direct-file browser storage is browser-dependent; use the documented HTTP preview for stable on-device persistence. The companion makes no external asset requests.

The screen is in Polish. Starter examples are clearly labeled fictional data. Each day is independently editable, and the week is saved in this browser when storage is available. The app displays a notice when it cannot save.

## Try the core journey

1. On Monday, press **Sprawdź mój wieczór**. The fictional fixed workout touches caregiving, but its 15-minute transition does not fit. Both appointments stay unchanged.
2. Uncheck **Stały termin, np. z trenerem** to try the movable-workout case, then check again. Review a suggested interval and press **Wybierz**.
3. The workout changes only after acceptance. The confirmation explains that the workout and transition fit beside caregiving.
4. Edit another day, then reload. Both days keep their own values. Changing an input invalidates previous suggestions.
5. Try reversed times or a narrow availability window. The app explains the error or reports no permitted slot instead of inventing a booking.

The scheduling engine is deterministic local arithmetic, not an AI model or a real trainer booking integration. AI is used in the development collaboration. No family schedule is sent to an external service by the app.

## Verify

```sh
node --test tests/*.test.mjs
```

Tests cover transitions, touching boundaries, fixed appointments, valid earlier/later proposals, no-slot cases, invalid input, stale acceptance, day isolation, storage recovery, and the preview's exclusion of private files. Browser and learner review evidence is recorded in `devpost/checklist.md`; passing automated tests is not a claim of completed hands-on review.

## Project records

- `devpost/scope.md`: approved boundary and scheduling kernel.
- `devpost/prd.md`: approved visible behavior.
- `devpost/spec.md`: approved technical blueprint.
- `devpost/checklist.md`: implementation progress, review evidence and verification limits.
- `devpost/app-map.html`: source navigation guide, prepared from the implementation.

The official Devpost Learn skill pack was installed from `challengepost/learn-ai-basics`, commit `a0f065781873e8a7ed9a9a705a8dafa6a0810439`. The project began as a new folder for this contest; no TasteRoute source was reused. Installed skills, the private learner profile and local secrets are ignored and must not be included in a public source upload.

Public source repository: [jacman1988-super/spokojny-tydzien](https://github.com/jacman1988-super/spokojny-tydzien). Source code is available under the MIT License.

The competition entry is not submitted yet. A short demo video and learner-authored submission text remain shipping tasks. Optional hosting is separate from the working local application; an unpublished or inaccessible URL must not be presented as a live demo.

## Android / Google Play

Agreed future direction: **Spokojny Tydzień is the second application planned for Google Play, alongside TasteRoute AI.** Finish the contest version and its submission first, then prepare the Android release. Preserve the calm colors, spacious cards and overall visual style approved in the working demo.

The mobile version should retain the weekly view, transition-aware checks, protection of fixed trainer appointments, explicit acceptance of permitted alternatives, and on-device planning. Before release, prepare the Android package and store materials, test the core journey and saved plans on real phones, and verify current Play Console requirements.

Pricing and advertising for this app have not been decided. Those choices belong to the later mobile release. No Android package or Play Console listing has been created or submitted for Spokojny Tydzień yet.
