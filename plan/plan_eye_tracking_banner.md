# Eye-Tracking Animation on 'j' Dots in Banner H1

## Goal

Make the two dots on the `j` letters in the `<h1>Ujjwal Verma</h1>` banner behave as eyes that follow the cursor continuously.

## Context

- **HTML**: `<h1>Ujjwal Verma</h1>` inside `.launch-banner .hero-block` (`pages/Professional/Professional.html:16`).
- **CSS**: `.launch-banner h1` uses `font-family: var(--headings)` (Raleway), `font-size: 8rem` (`styles/Professional.css:183`).
- **"Ujjwal"** has two consecutive `j` letters — their dots become the eye pupils.

## Files to Modify

1. **`styles/Professional.css`** — Add `position: relative` to `.launch-banner .hero-block h1` so pupils can be absolutely positioned inside it.
2. **`scripts/professional.js`** — Add the eye-tracking block near the end, before `loadCV()`.

## Implementation

### CSS (`styles/Professional.css`)

Add one line to the existing `.launch-banner h1` rule at line 183:

```css
.launch-banner h1 {
  font-family: var(--headings);
  font-size: 8rem;
  margin-bottom: 0;
  margin-top: 0;
  font-weight: 500;
  color: var(--editorText);
  text-align: center;
  position: relative; /* NEW — anchor for pupil elements */
}
```

### JS (`scripts/professional.js`)

Insert before `loadCV()` call (line 970). The block does the following:

#### 1. Find the h1 and wrap each 'j' in a span

```js
(function initBannerEyes() {
  var h1 = document.querySelector('.launch-banner h1');
  if (!h1) return;

  // Wrap each 'j' in a <span> so we can measure its position
  var text = h1.textContent;
  var wrapped = '';
  for (var i = 0; i < text.length; i++) {
    if (text[i] === 'j') {
      wrapped += '<span class="j-char">' + text[i] + '</span>';
    } else {
      wrapped += text[i];
    }
  }
  h1.innerHTML = wrapped;
```

#### 2. Create pupil elements

```js
  var chars = h1.querySelectorAll('.j-char');
  var pupils = [];

  chars.forEach(function (ch) {
    var pupil = document.createElement('span');
    pupil.style.cssText =
      'position:absolute;width:10px;height:10px;' +
      'background:currentColor;border-radius:50%;' +
      'pointer-events:none;transform:translate(-50%,-50%);' +
      'transition:none;z-index:10;';
    h1.appendChild(pupil);

    var rect = ch.getBoundingClientRect();
    // The dot of 'j' sits near the top-center of the glyph
    pupils.push({
      el: pupil,
      chEl: ch,
      // Store initial center positions (relative to h1)
      originX: 0,
      originY: 0
    });
  });
```

#### 3. Recompute eye centers on resize/scroll

```js
  var MAX_DISPLACEMENT = 6;

  function recomputeCenters() {
    var h1Rect = h1.getBoundingClientRect();
    pupils.forEach(function (p) {
      var r = p.chEl.getBoundingClientRect();
      p.originX = r.left + r.width / 2 - h1Rect.left;
      p.originY = r.top + r.height * 0.22 - h1Rect.top;
      // 0.22 ≈ where the dot sits vertically in the glyph
    });
  }

  recomputeCenters();
  window.addEventListener('resize', recomputeCenters);
```

#### 4. Mousemove handler with clamp

```js
  var rafId = null;

  document.querySelector('.launch-banner').addEventListener('mousemove', function (e) {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      pupils.forEach(function (p) {
        var dx = e.clientX - (p.chEl.getBoundingClientRect().left + p.chEl.getBoundingClientRect().width / 2);
        var dy = e.clientY - (p.chEl.getBoundingClientRect().top + p.chEl.getBoundingClientRect().height * 0.22);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_DISPLACEMENT) {
          dx = dx / dist * MAX_DISPLACEMENT;
          dy = dy / dist * MAX_DISPLACEMENT;
        }
        p.el.style.transform = 'translate(' + (dx - 5) + 'px,' + (dy - 5) + 'px)';
      });
    });
  });
```

#### 5. Disable on launch

```js
  var launchBtn = document.getElementById('launch-btn');
  if (launchBtn) {
    launchBtn.addEventListener('click', function () {
      pupils.forEach(function (p) { p.el.style.display = 'none'; });
    });
  }
})();
```

## Behavior

- Pupils are small circles (10px diameter, color matching `currentColor`/h1 text color) positioned over each 'j' dot.
- They follow the cursor anywhere on the banner, clamped to ±6px displacement so they stay within the dot area.
- Uses `requestAnimationFrame` for smooth performance.
- Eyes disappear when the user clicks "Launch Portfolio" (banner slides away).
- `recomputeCenters()` is called on resize so positions stay correct across viewport changes.

## Verification

1. Open `pages/Professional/Professional.html` in a browser.
2. Move the cursor around the banner — the two 'j' dots should follow smoothly.
3. Click "Launch Portfolio" — the pupils should disappear.
4. Resize the window — positions should recompute correctly.
5. No console errors expected.
