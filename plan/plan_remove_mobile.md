# Mobile Removal & Responsive CSS Plan

Remove the legacy `Mobile/` directory and make `style.css` + `Resume.css` fully responsive so both pages handle small viewports natively instead of redirecting.

## Decisions (confirmed)

- **Navigation (< 720px)**: Keep hamburger overlay pattern — `#menuIcon` shows a full-screen menu; tapping footer/content closes it.
- **Home hero on phones**: Keep photo hidden; text + smaller signature centered in one viewport-height screen, no scroll.
- **Commits**: Two commits — (1) delete Mobile/ + redirect, (2) responsive CSS + JS cleanup.

## Root cause to fix

Both pages gate mobile nav wiring behind `if (window.innerWidth <= 720)` and reference `#themeSelect`, `#menu`, `#selectedTheme`, `#whiteTheme`... which no longer exist in either HTML. First listener call throws TypeError → hamburger never wires up. All theme-switcher JS is dead code referencing removed DOM. Today this is masked by the redirect; removing `Mobile/` without fixing it breaks mobile nav entirely.

## Commit 1 — Delete legacy mobile site

- `git rm -r Mobile/` (verified: nothing outside it references its assets).
- `index.html`: delete redirect block (`if (screen.width <= 500) document.location = "./Mobile/mobile.html"`).
- `README.md`: remove `Mobile/` from file tree + page inventory; drop redirect mention from index row; update Assets bullet; change responsive rule to "single source of truth: 720px breakpoint in style.css/Resume.css".

Note: `plan_blog.md` mentions the legacy folder but is a historical doc — leave as-is.

**Commit message**: "Remove legacy Mobile site and screen-width redirect"

## Commit 2 — Responsiveness + JS cleanup

### `index.html` script cleanup

- Delete: all dead theme/menu vars (`themeSelect`, `menu`, `selectedTheme`, `white`, `dark`, `color`), the `themeSelect`/hero-menu listeners in the `<= 720` block, `replace()`, `darkTheme()`, `colorTheme()`, `lightTheme()`.
- Keep: greeting, `notice()`.
- Re-wire mobile nav unconditionally (no `innerWidth` check — `#menuIcon` is hidden on desktop via CSS anyway; unconditional wiring survives resize/orientation change):
  - `menuIcon.click` → show header, hide hero, shrink footer
  - `footer.click` → restore menu icon, hide header, show hero/footer

### `Resume.html` script cleanup

- Delete dead theme/menu vars + `lightTheme()` (its `replace()` helper doesn't exist here).
- Keep `notice()`, `toggleSection()`; wire `menuIcon`/`footer` handlers unconditionally (hide/restore `#resume-container`).

### `style.css` `@media (max-width: 720px)`

- Hidden `header`: add `z-index: 10`, `overflow-y: auto`, `max-height: 90vh` so tall menus overlay and can scroll.
- Hero: replace brittle `position:absolute; transform:translate(-45%,-45%)` with static flex-centered column inside `section` (desktop unchanged).
- Signature: `height/width: min(15rem, 55vw)` so it can't overflow narrow screens.
- Keep `body { overflow:hidden }` (single-screen choice); add safety query `@media (max-width: 720px) and (max-height: 620px)` shrinking `#info` font + signature for short phones.
- Drop stale `/*# sourceMappingURL=mobile.css.map */` comment.

### `Resume.css` `@media (max-width: 720px)`

- Mirror header `overflow-y` / `max-height` additions.
- Fix invalid `line-height: center` typo (applies to both breakpoints).

## Verification

No build/test tooling exists — manual browser checks:

- Responsive mode at 375×812, 414×896, 600×900, 720, 1280×800: home + resume render, no console errors, hamburger opens/closes, nav links navigate, resume sections toggle, footer icons tap, no horizontal scroll.
- Grep confirms zero references to `Mobile`, `mobile.css`, `themeSelect`, `selectedTheme`, `WhiteTheme`.

**Commit message**: "Make style.css and Resume.css responsive; wire up mobile nav"
