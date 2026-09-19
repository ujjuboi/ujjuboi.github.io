# Eye-Tracking Banner

The two dots on the `j` letters in `Ujjwal Verma` (Professional launch banner) act as eyes that follow the cursor. On click of "Launch Portfolio" the pupils disappear with the banner.

## Implementation

| Area | Location |
|---|---|
| Script | `initBannerEyes()` — `scripts/professional.js:1131` |
| Markup | `.launch-banner` + `.launch-btn` (`pages/Professional/Professional.html`) |
| Styles | `.launch-banner h1` (anchor `position: relative`) — `styles/Professional.css:180` |

### How it works

- Each `j` character is wrapped in `<span class="j-char">`; a sclera/pupil/lid group is created per eye (`scripts/professional.js:1147`).
- Eye centers are recomputed on resize/scroll so pupils stay aligned with the glyph dots.
- A `requestAnimationFrame`-throttled `mousemove` handler translates each pupil toward the cursor within a clamped travel limit (`MAX_DISPLACEMENT`).
- Clicking "Launch Portfolio" hides the pupils (`professional.js:1280`) as the banner slides away.

## Conventions honored

- Pupil color from `currentColor`, sizes via inline style set from measured glyph size — no hardcoded theme colors.