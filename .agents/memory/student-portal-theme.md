---
name: Student Portal Theme
description: How dark/light mode theming works in StudentApp.jsx
---

**Pattern:** Two palette objects (`DARK`, `LIGHT`) defined at the top of StudentApp.jsx. `useTheme()` hook returns `{ isDark, toggle, p }` where `p` is the active palette. Every component receives `p` as a prop and uses `p.text`, `p.surface`, `p.accent` etc for all colors — no hardcoded hex strings in JSX.

**Persistence:** `localStorage.getItem('fundo_theme')` — value `'light'` means light, anything else (including absent) means dark.

**Toggle UI:** Sun/Moon icon button in the sidebar header (desktop) AND in the top bar (mobile).

**Why:** Inline-style-heavy JSX made CSS-variable approach impractical; palette prop threading is the chosen pattern. Adding new components must accept and use `p` prop.
