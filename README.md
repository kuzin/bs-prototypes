# 🫘 bs-prototypes

> A pnpm monorepo of Beanstack UI prototypes — one Vite app, many prototypes, shared design system.

[![Deploy to GitHub Pages](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml/badge.svg)](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml)

This repo is a sandbox for trying out new Beanstack UI ideas — analytics dashboards, redesigned flows, and one-off explorations — without touching the production Rails/React app. Each prototype is a standalone page in a single Vite build, all sharing the same `@bs/ui` primitives so they look and feel like the same product.

🔗 **Live index:** [kuzin.github.io/bs-prototypes](https://kuzin.github.io/bs-prototypes/)

---

## 🚀 Prototypes

| Prototype | What it is | Path |
|---|---|---|
| **Student Profile** | Reading habits, skills, motivation & integrity dashboard for a single student | [/student-profile/](https://kuzin.github.io/bs-prototypes/student-profile/) |
| **RIS: School** | School-level analytics dashboard for principals and instructional coaches | [/ris/](https://kuzin.github.io/bs-prototypes/ris/) |
| **RIS: District** | District-level analytics dashboard for curriculum directors and superintendents | [/ris-district/](https://kuzin.github.io/bs-prototypes/ris-district/) |
| **Sessions for Review** | Redesigned SFR with AI summary, engagement highlights, and combined Book Talk list | [/sfr/](https://kuzin.github.io/bs-prototypes/sfr/) |
| **Admin Dashboard v2** | Editable admin home with drag-and-drop, resizable, lockable widgets | [/admin-dashboard/](https://kuzin.github.io/bs-prototypes/admin-dashboard/) |
| **Rostering: School** | Preview Clever syncs, filter classroom subjects, and manage rostering from one place | [/rostering/](https://kuzin.github.io/bs-prototypes/rostering/) |
| **Rostering: District** | District-wide roster sync settings — import filters and summer pause across schools | [/rostering-district/](https://kuzin.github.io/bs-prototypes/rostering-district/) |
| **Insights · Load Concepts** | UX concepts for a lighter Insights page load — snapshot, drill-down, progressive, pinned widgets | [/insights/](https://kuzin.github.io/bs-prototypes/insights/) |
| **Pattern Library** | Shared components used across prototypes — StatCard, ChartCard, tooltips, icons | [/patterns/](https://kuzin.github.io/bs-prototypes/patterns/) |

### 🧪 Experiments

Less-finished explorations that live alongside the main prototypes.

| Experiment | What it is | Path |
|---|---|---|
| **Web App** | Beanstack consumer web app — student-facing dashboard, challenges, reading log | [/web-app/](https://kuzin.github.io/bs-prototypes/web-app/) |
| **Unified Joyful Footer** | A consistent Joyful-brand footer applied to Comics Plus, MyDot, Beanstack, RMI Classroom — with dark/light mode | [/footers/](https://kuzin.github.io/bs-prototypes/footers/) |

RIS = Reading Information System. SFR = Sessions for Review.

---

## 🗂 Structure

```
bs-prototypes/
├── apps/
│   └── web/                       # The Vite app (package name: bs-web)
│       ├── index.html             # Landing page — list of prototype cards
│       ├── student-profile/       # One HTML entry per prototype
│       ├── ris/
│       ├── ris-district/
│       ├── sfr/
│       ├── admin-dashboard/
│       ├── rostering/
│       ├── rostering-district/
│       ├── insights/
│       ├── web-app/               # Experiments
│       ├── footers/
│       ├── patterns/
│       ├── src/
│       │   ├── index/             # Landing page React app
│       │   ├── student-profile/   # One React app per prototype
│       │   ├── ris/
│       │   ├── ris-district/
│       │   ├── sfr/
│       │   ├── admin-dashboard/
│       │   ├── rostering/
│       │   ├── rostering-district/
│       │   ├── insights/
│       │   ├── web-app/
│       │   ├── footers/
│       │   ├── patterns/
│       │   ├── prototypes.js      # Source of truth for the prototype list
│       │   ├── PrototypeNav.jsx   # Cross-prototype switcher (top bar)
│       │   ├── BackBar.jsx        # "Back to index" bar
│       │   └── MainRail.jsx       # Shared left rail
│       └── vite.config.js         # Multi-entry rollup config
└── packages/
    └── ui/                        # Shared design system (@bs/ui)
        ├── tokens.js              # Color tokens, icon IDs, genre palette
        ├── index.jsx              # Primitive components
        └── BeanstackProfile.css
```

Everything builds into a single `apps/web/dist/` artifact that's copied verbatim to GitHub Pages.

---

## 🎨 Shared UI (`@bs/ui`)

Low-level primitives every prototype gets for free:

| Export | What it is |
|---|---|
| `C` | Section color tokens (`motivation`, `integrity`, `habits`, `skills`) |
| `LABEL` | Section display names |
| `GENRE_COLORS` | Genre chip color palette |
| `I8_IDS`, `I8_TOKEN` | Icons8 icon map + API token |
| `COVER_PALETTES` | Book cover fallback colors |
| `Ic` | Icons8 icon renderer |
| `StatusBadge` | Status chip (Watch / Improving / Strong / Trending up) |
| `Pill` | Generic label chip |
| `Bar` | Progress bar |
| `Card` | Card container |
| `SectionHeading` | Section heading |
| `GoalRing` | SVG donut progress ring |
| `CoverImage` | Book cover with OpenLibrary fallback |

Higher-level patterns (StatCard, ChartCard, tooltip styles, etc.) live in the **Pattern Library** prototype at `apps/web/src/patterns/`. Add new reusable components there as you build them — that's the registry every other prototype checks first.

---

## 💻 Running locally

```bash
pnpm install
pnpm dev          # starts the bs-web Vite dev server (all prototypes)
pnpm build        # builds the bs-web app
pnpm build:all    # builds every workspace package
```

Local URLs:

- Landing: <http://localhost:5173/>
- A prototype: <http://localhost:5173/student-profile/>

---

## ➕ Adding a new prototype

Each prototype is a separate HTML entry inside `apps/web`. To add one called `my-proto`:

**1. Create the entry HTML** — `apps/web/my-proto/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/bs-prototypes/bs.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beanstack · My Proto</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/my-proto/main.jsx"></script>
  </body>
</html>
```

**2. Create the React app** — `apps/web/src/my-proto/{main.jsx,App.jsx,index.css}`
```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@bs/ui/css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
```

**3. Register the entry** — `apps/web/vite.config.js`, in `rollupOptions.input`:
```js
myProto: resolve(__dirname, 'my-proto/index.html'),
```

**4. Add it to the index** — `apps/web/src/prototypes.js`:
```js
{
  id: "my-proto",
  name: "My Proto",
  section: "Prototypes",            // or "Experiments" for less-finished work
  href: "/bs-prototypes/my-proto/",
  accent: "#7C3AED",
  description: "What this prototype is for.",
}
```

**5. (Optional) Add a card icon** — `apps/web/src/index/App.jsx`, in the `ICONS` map.

Then `pnpm dev` — it'll show up on the landing page and in the prototype switcher automatically.

---

## 🌐 Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. `pnpm --filter bs-web build` produces `apps/web/dist/`
2. The whole dist is copied to `pages/` and uploaded as the Pages artifact
3. GitHub Pages serves it at `kuzin.github.io/bs-prototypes/`

Each prototype lives at its own subpath (`/bs-prototypes/<id>/`). The Vite `base` is set to `/bs-prototypes/` so links resolve correctly on Pages.
