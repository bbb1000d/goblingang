# Goblin Gang

A small browser-based action platformer inspired by Goblin Sword. Built with HTML5 canvas and vanilla JavaScript.

## Features
- Responsive player controls (move, double-jump, sword attack).
- Three handcrafted levels with pits, spikes, coins, and portals.
- Two enemy archetypes (patrolling melee, ranged shooter) plus a boss in the final stage.
- Coins to collect, a HUD showing hearts/coins/level, and a campfire shop for upgrades between stages.
- Simple pixel-inspired placeholder art that can be swapped with sprites later.

## Running locally
1. Use any static web server or simply open `index.html` in a modern browser.
   - Example with Python: `python -m http.server 8000` then browse to `http://localhost:8000/`.
2. No backend is required; all logic runs client-side. (A Python API could be added later for shared leaderboards.)

## Editing the game
- **Add a level**: Edit the `levelData` array in `game.js`. Each level lists `platforms`, `spikes`, `coins`, `enemies`, and `portal` (or `boss`). Add new arrays or tweak coordinates to craft layouts.
- **Swap art assets**: Replace the rectangle drawing code in `render()` with `drawImage()` calls. Organize new sprites under an `assets/` directory and load them in `game.js`.
- **Adjust stats**: Modify constants near the top of `game.js` (e.g., `gravity`, `player.speed`, `player.jumpForce`, enemy `speed`, boss `health`).

## Controls
- **A / D** or **← / →** – Move
- **W** or **Space** – Jump (double-jump enabled)
- **J / K** – Attack
- **R** – Restart level
