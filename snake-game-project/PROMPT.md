# Original Project Prompt

This file records the brief the project was built from, for future reference
(e.g. if you regenerate parts of it with an AI assistant, or hand it to
another developer).

## Request

> Create a simple Snake Game using HTML, CSS, and JavaScript. Include snake
> movement, food, score, game over, and a restart button. Make it modern,
> responsive, and playable with keyboard controls.

## Follow-up requirements

- UI language: Urdu (labels, headings, instructions).
- Deliverable: a complete, runnable project folder (not a single file) —
  separate HTML / CSS / JS / assets, plus documentation.

## Interpreted feature list

- Snake moves continuously on a fixed grid (20×20 cells) and is steered with
  Arrow keys or WASD.
- Snake grows by one segment each time it eats food; food respawns on an
  empty cell.
- Score increases per food eaten; a session best score is tracked.
- Game speed increases gradually as the score rises (capped at a minimum
  interval so it never becomes unplayable).
- Collision with a wall or with the snake's own body ends the game.
- A "Game Over" overlay shows the final score with a retry action.
- A visible "Restart" control is always available in the footer, in addition
  to the retry button shown on game over.
- Responsive layout: canvas scales to the viewport, on-screen D-pad appears
  automatically on touch devices, swipe gestures work as an alternative to
  the D-pad.
- Visual direction: dark theme, glowing lime/cyan accents, rounded snake
  segments with directional eyes on the head, pulsing food.

## Notes for future changes

If you ask an AI assistant (or yourself) to modify this project later,
point it at this file plus `README.md` first — together they describe the
intended behavior and structure, so changes can be scoped correctly instead
of re-guessing requirements from scratch.
