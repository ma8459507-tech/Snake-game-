# سانپ کا کھیل — Snake Game

A modern, responsive Snake game built with plain HTML, CSS, and JavaScript.
No frameworks, no build step, no external dependencies — open it and play.
The UI text is in Urdu; the code and this documentation are in English.

![status](https://img.shields.io/badge/status-stable-brightgreen) ![deps](https://img.shields.io/badge/dependencies-none-blue)

---

## 1. Project structure

```
snake-game-project/
├── index.html          # Page structure/markup only (no inline CSS or JS)
├── css/
│   └── style.css        # All styling: layout, theme, animations, responsiveness
├── js/
│   └── game.js           # All game logic: state, rendering, input, collisions
├── assets/
│   └── favicon.svg        # Browser tab icon (small inline SVG snake mark)
├── package.json         # Optional metadata + a convenience "serve" script
├── .gitignore            # Keeps node_modules/OS files out of version control
├── PROMPT.md              # The original design brief this project was built from
└── README.md               # This file
```

Every file above is required to run the project as-is — nothing is omitted.
There is no server-side code and no database; this is a fully static,
client-side project.

### Why these files exist

| File | Purpose |
|---|---|
| `index.html` | Defines the page: header/score UI, the game `<canvas>`, start/game-over overlays, footer controls, and the D-pad. Loads `css/style.css` and `js/game.js`. |
| `css/style.css` | Dark theme, gradients, glow effects, the responsive canvas sizing, the mobile D-pad, and `prefers-reduced-motion` handling. |
| `js/game.js` | Grid/state management, the game loop (`setInterval`), Canvas 2D rendering, collision detection, scoring/speed scaling, and all input handling (keyboard, click, touch/swipe). |
| `assets/favicon.svg` | Tiny vector icon shown in the browser tab; referenced by `index.html`. |
| `package.json` | Not required to run the game (you can just open `index.html`), but gives you a one-command local server (`npm start`) which is the more reliable way to test on mobile devices or avoid browser file:// restrictions. |
| `PROMPT.md` | A written record of the original requirements/brief, so future changes (by you, a teammate, or an AI assistant) start from the actual intent instead of guesswork. |

---

## 2. Technologies used

- **HTML5** — semantic structure, `<canvas>` for rendering.
- **CSS3** — custom properties (CSS variables), gradients, `backdrop-filter`,
  `aspect-ratio`, CSS Grid (for the D-pad), media queries for responsiveness
  and `prefers-reduced-motion`.
- **Vanilla JavaScript (ES6+)** — no frameworks or libraries. Uses the
  Canvas 2D API, `requestAnimationFrame` for smooth animation, and
  `setInterval` for the fixed-tick game loop.
- **No build tools** — no bundler, transpiler, or package manager is
  required to run the game. `package.json` is included only as an optional
  convenience for local serving.

Browser support: any modern evergreen browser (Chrome, Edge, Firefox,
Safari) on desktop or mobile.

---

## 3. Setup

No installation is required to play the game.

**Option A — just open it (simplest):**
Double-click `index.html`, or drag it into a browser window.

**Option B — run a local server (recommended for development):**
A local server avoids occasional browser restrictions on loading local
files (`file://`) and better matches how the game would behave once
deployed.

Requirements: [Node.js](https://nodejs.org/) (only needed for Option B).

```bash
# from inside the snake-game-project folder
npm start
# then open the printed URL, e.g. http://localhost:8080
```

This uses `npx http-server`, a zero-config static file server — it is
downloaded on demand the first time you run it and nothing is permanently
installed into the project.

---

## 4. How to run it

1. Open the game (see Setup above).
2. Press **any arrow key**, **WASD**, or the **"کھیل شروع کریں" / Start**
   button to begin.
3. Steer the snake to the glowing food to grow and increase your score.
4. Avoid hitting the walls or the snake's own body.
5. On game over, use **"دوبارہ کھیلیں" / Retry** (on the overlay) or
   **"دوبارہ شروع" / Restart** (footer button) to play again.
6. **Space** also starts a new game or restarts after game over.

**On touch devices:** an on-screen D-pad appears automatically, and you can
also swipe on the game board to change direction.

---

## 5. How to safely update it in the future

This project has no build step, so "updating" it just means editing the
three source files directly. A few guidelines to keep changes safe:

### General workflow

1. **Read `PROMPT.md` first** if the change is more than a small tweak —
   it records the original intent so you (or an AI assistant) don't
   accidentally undo a requirement.
2. **Make a backup or use version control.** If you're not already using
   Git, the fastest safe habit is:
   ```bash
   git init
   git add .
   git commit -m "Baseline before changes"
   ```
   Then commit again after each meaningful change. This gives you an easy
   way to undo anything that breaks.
3. **Test after every change** by reloading `index.html` (or refreshing the
   `npm start` tab). Because the game has no build step, changes are visible
   immediately — there's no reason to batch many risky edits together.

### Where to make common changes

| You want to... | Edit this file | Notes |
|---|---|---|
| Change colors/theme | `css/style.css` | Colors are centralized as CSS variables at the top (`:root { --lime: ...; --cyan: ...; }`) — change them there rather than hunting through the file. |
| Change grid size or difficulty | `js/game.js` | `GRID` (cells per side), `BASE_SPEED`/`MIN_SPEED` (ms per tick — lower is faster) are defined near the top of the file. |
| Change UI text/language | `index.html` | All visible text lives in the markup, not in JS, so translations don't require touching logic. |
| Add sound effects | `js/game.js` | Add an `Audio()` call inside `step()` where food is eaten, and inside `gameOver()`. Keep audio files in a new `assets/sounds/` folder and reference them with relative paths. |
| Add new obstacles/levels | `js/game.js` | Extend the collision check inside `step()` (currently checks walls + self) and add obstacle data to the render loop in `draw()`. |

### Safety rules to follow

- **Keep logic in `game.js`, structure in `index.html`, and appearance in
  `style.css`.** Don't add inline `style="..."` attributes or `<script>`
  blocks back into `index.html` — mixing concerns makes future updates
  error-prone and harder to review.
- **Don't remove the `id` attributes** (`#game`, `#scoreVal`, `#bestVal`,
  `#startOverlay`, `#overOverlay`, `#dpad`, etc.) in `index.html` unless you
  also update every matching `document.getElementById(...)` call in
  `game.js` — a mismatch will break the game silently (usually with a
  console error like `Cannot read properties of null`).
- **Check the browser console** (F12 → Console) after any change. This
  project intentionally has zero dependencies, so almost every error you'll
  see is from a typo or a missing element reference — both are quick to
  spot there.
- **Preserve the `alive`/`running` state guards** in `game.js` if you modify
  input handling — they prevent things like scoring after death or starting
  two game loops at once (`restartLoop()` always clears the previous
  `setInterval` before creating a new one; keep that pattern for any new
  timers you add).
- **Re-test on mobile** (or with your browser's device toolbar) after any
  layout change, since the D-pad, swipe handling, and canvas sizing are all
  responsive and can interact in non-obvious ways.
- **Don't commit secrets or personal data** — this project has none today,
  and it should stay that way if you extend it (e.g. don't hardcode API
  keys if you add an online leaderboard; use environment variables and a
  backend instead).

### If you use an AI assistant to make future changes

Share `PROMPT.md` and this `README.md` with it first. That gives it the
original requirements and the current file responsibilities, so it can
make targeted edits instead of rewriting working code from scratch.

---

## 6. License

No license file is included by default (`package.json` marks the project
`"private": true` / `UNLICENSED`). Add a `LICENSE` file if you intend to
share or open-source this project.
