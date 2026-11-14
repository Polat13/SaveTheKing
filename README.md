# Save The King

A small turn-based battle game built with **PixiJS 8**, **TypeScript** and **Vite**.
Attack the enemy, earn coins on every hit, and spend them on upgrades to make the King stronger.

## Features

- Turn-based combat with attack animations, hit effects and screen shake
- Coin economy: +10 coins per successful hit
- Upgrades for **health** and **attack damage**, with increasing costs
- Progress (coins and upgrade levels) is saved in `localStorage` and restored on reload
- Localization with an in-game language selector
- Responsive layout that adapts to the window size

## Getting started

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Project structure

| Folder | Purpose |
| --- | --- |
| `src/app` | App bootstrap, `Game` and `SceneManager` |
| `src/scenes` | Start, gameplay, end and upgrade scenes |
| `src/systems` | Combat, animation and hit-reaction systems |
| `src/entities` / `src/visual` | Player / enemy logic and sprites |
| `src/economy` / `src/progression` | Coin and upgrade systems |
| `src/storage` | Fail-safe `localStorage` helpers and asset path helper |
| `src/ui`, `src/effects` | Buttons, health bars, effects |
| `src/localization` | Translations |
| `public/assets` | Backgrounds and character images |
