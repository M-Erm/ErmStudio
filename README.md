# ErmStudio

This is a website for my work across software development, game development, 3D modeling and animation.

**Live:** https://m-erm.github.io/ErmStudio/

---

## What's inside

| Section | Content |
|---|---|
| Games | Original games and game mods |
| Software | Tools and applications |
| Models | 3D character models |
| Animations | In-game and video animations |

---

## Architecture

Single-page application built with vanilla JavaScript

Client-side routing maps URL paths to sections without page reloads. The router reads the current path on load, on navigation clicks, and on popstate (browser back/forward), then renders the appropriate section and loads its content dynamically.

```
/ErmStudio/en/games // Games section
/ErmStudio/en/games/HoloParty // Game detail (custom view)
/ErmStudio/en/softwares/namastream // Software detail (iframe view)
/ErmStudio/en/models // Models section
```

Language is part of the URL path (`en` or `pt-br`) and persists across navigation.

### Custom views

Some projects render as self-contained iframes rather than the standard detail template. These live under `views/` and communicate with the main app via `postMessage` for things like language sync

### GitHub Pages fallback

GitHub Pages does not support SPA routing natively. A `404.html` intercepts unresolved paths, saves the original path to `sessionStorage`, and redirects to the root. On load, the router checks `sessionStorage` and navigates to the intended path.

---

## Stack

- HTML5, CSS3, Vanilla JS (ES Modules)
- Hosted on GitHub Pages

---

## Structure

```
ErmStudio/
|-- data/
|   |-- games.json
|   |-- mods.json
|   |-- softwares.json
|   |-- models.json
|   |-- animations.json
|   |-- translations.json
|-- images/
|   |-- games/
|   |-- mods/
|   |-- softwares/
|   |-- models/
|-- views/
|   |-- namastream/
|-- 3D-Models/
|-- index.html
|-- style.css
|-- javascript.js
|-- 404.html
```

---

## Notes

This repository consolidates earlier iterations of the project into a cleaner baseline. Previous development history lives in the archived [Portfolio](https://github.com/M-Erm/Portfolio) repository.