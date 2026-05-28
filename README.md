# 🫘 bs-prototypes

> A single Vite app of Beanstack UI prototypes — many prototypes, one shared design system.

[![Deploy to GitHub Pages](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml/badge.svg)](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml)

This repo is a sandbox for trying out new Beanstack UI ideas — analytics dashboards, redesigned flows, and one-off explorations — without touching the production Rails/React app. Each prototype is a standalone page in a single Vite build, all sharing the same `@bs/ui` primitives so they look and feel like the same product.

🔗 **Live index:** [kuzin.github.io/bs-prototypes](https://kuzin.github.io/bs-prototypes/)

---

## 🚀 Prototypes

| Prototype                    | What it is                                                                                       | Path                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **Student Profile**          | Reading habits, skills, motivation & integrity dashboard for a single student                    | [/student-profile/](https://kuzin.github.io/bs-prototypes/student-profile/)       |
| **RIS: School**              | School-level analytics dashboard for principals and instructional coaches                        | [/ris/](https://kuzin.github.io/bs-prototypes/ris/)                               |
| **RIS: District**            | District-level analytics dashboard for curriculum directors and superintendents                  | [/ris-district/](https://kuzin.github.io/bs-prototypes/ris-district/)             |
| **Sessions for Review**      | Redesigned SFR with AI summary, engagement highlights, and combined Book Talk list               | [/sfr/](https://kuzin.github.io/bs-prototypes/sfr/)                               |
| **Admin Dashboard v2**       | Editable admin home with drag-and-drop, resizable, lockable widgets                              | [/admin-dashboard/](https://kuzin.github.io/bs-prototypes/admin-dashboard/)       |
| **Rostering: School**        | Preview Clever syncs, filter classroom subjects, and manage rostering from one place             | [/rostering/](https://kuzin.github.io/bs-prototypes/rostering/)                   |
| **Rostering: District**      | District-wide roster sync settings — import filters and summer pause across schools              | [/rostering-district/](https://kuzin.github.io/bs-prototypes/rostering-district/) |
| **Insights · Load Concepts** | UX concepts for a lighter Insights page load — snapshot, drill-down, progressive, pinned widgets | [/insights/](https://kuzin.github.io/bs-prototypes/insights/)                     |
| **Pattern Library**          | Shared components used across prototypes — StatCard, ChartCard, tooltips, icons                  | [/patterns/](https://kuzin.github.io/bs-prototypes/patterns/)                     |

### 🧪 Experiments

Less-finished explorations that live alongside the main prototypes.

| Experiment                | What it is                                                                                                      | Path                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Web App**               | Beanstack consumer web app — student-facing dashboard, challenges, reading log                                  | [/web-app/](https://kuzin.github.io/bs-prototypes/web-app/) |
| **Unified Joyful Footer** | A consistent Joyful-brand footer applied to Comics Plus, MyDot, Beanstack, RMI Classroom — with dark/light mode | [/footers/](https://kuzin.github.io/bs-prototypes/footers/) |

RIS = Reading Information System. SFR = Sessions for Review.

---

## 🗂 Structure

```
bs-prototypes/
├── prototypes/                # One self-contained folder per prototype
│   ├── student-profile/
│   │   ├── main.jsx           #   entry module (mounts <App/>)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── data.js            #   (optional) mock data
│   │   └── components/        #   (optional) prototype-specific components
│   ├── ris/  ris-district/  sfr/  admin-dashboard/
│   ├── rostering/  rostering-district/  insights/
│   ├── web-app/  footers/     #   Experiments
│   └── patterns/
├── components/                # The shared component system — each in its own folder
│   ├── Button/  Tabs/  Modal/  Table/  Flyout/  Toggle/   #   atoms & molecules
│   ├── Form/  CustomSelect/  FilterBar/  DatePicker/  TimePicker/   #   forms
│   ├── Cards/  charts/  TrendChart/  BarList/  Funnel/  ProgressBar/   #   charts & data
│   ├── Primitives/  Pill/  Avatar/   #   Primitives = Spinner, Tooltip, Banner, EmptyState, …
│   ├── ReadingHealth/  AlertsBanner/  Hero/  RmiIcons/  BennyBubble/   #   domain
│   ├── AppShell/  Sidebar/  PrototypeNav/  BackBar/  MainRail/   #   layout & chrome
│   ├── ui/                    #   student-profile primitives (Ic, GoalRing, …) + tokens
│   └── prototypes.js          #   source of truth for the prototype list
├── landing/                   # The landing page (list of prototype cards)
├── public/                    # Static assets (favicon, images)
├── vite.config.js             # Entry-generating plugin + @components alias
└── package.json
```

**No HTML files in the repo.** Each prototype's entry HTML is generated from a single
template in [vite.config.js](vite.config.js) — served from memory in dev, written
transiently for `build` and removed once the bundle closes. Entries are auto-discovered
by scanning `prototypes/` for folders with a `main.jsx`, so there's no manual entry list
to keep in sync. Everything builds into a single `dist/` artifact (with clean
`/<id>/` paths) that's copied verbatim to GitHub Pages.

Imports use one alias: `@components` (→ `components/`), e.g. `import { Button } from '@components/Button/Button'`.

---

## 🎨 Shared components

There is **one** component system, in `components/` — every prototype draws from it via the `@components` alias. Each component lives in its own folder with its CSS:

- **Atoms & molecules** — `Button`, `Pill`, `Avatar`, `Toggle`, `Tabs`, `Flyout`, `Modal`, `Table`, and `Primitives/` (IconButton, Divider, Spinner, Tooltip, Banner, Breadcrumb, Accordion, EmptyState, Skeleton, SectionHeading)
- **Forms** — `Form` (Field/Input/Select/Textarea/Checkbox/Radio/…), `CustomSelect`, `FilterBar`, `DatePicker`, `TimePicker`
- **Charts & data** — `Cards` (StatCard/ChartCard/CardNote), `charts` (Nivo wrappers + tooltips), `TrendChart`, `BarList`, `Funnel`, `ProgressBar`
- **Domain** — `ReadingHealth`, `AlertsBanner`, `Hero`, `RmiIcons`, `BennyBubble`
- **Layout & chrome** — `AppShell` (prop-driven shell: Sidebar + content slot + optional back bar), `Sidebar` (prop-driven nav + school picker), `PrototypeNav`, `BackBar`, `MainRail`
- **`ui/`** — the student-profile's `bp-`prefixed primitives (`Ic`, `StatusBadge`, `Card`, `SectionHeading`, `GoalRing`, `CoverImage`) plus design tokens (`C`, `LABEL`, `GENRE_COLORS`, `I8_IDS`, `COVER_PALETTES`), imported via `@components/ui`

**The Pattern Library prototype (`prototypes/patterns/`) is the live catalog** — it renders every shared component with interactive knobs, importing them straight from `@components`. When you build a new reusable component, add it to `components/<Name>/` and add a showcase to [prototypes/patterns/App.jsx](prototypes/patterns/App.jsx) — that's the registry every other prototype checks first.

Components specific to a single prototype stay inside that prototype — e.g. ris's dashboard screens (`SchoolDashboard`, `School*`/`District*`, `RisLayout`, `StudentPanel`) live in `prototypes/ris/components/`. The shared layout (`AppShell`, `Sidebar`) was lifted out of ris so sfr, insights, and rostering can reuse the same shell.

---

## 💻 Running locally

```bash
pnpm install
pnpm dev          # starts the Vite dev server (all prototypes)
pnpm build        # builds all prototypes into dist/
pnpm preview      # serve the production build locally
pnpm lint         # ESLint (flat config; warnings ok, errors fail)
pnpm lint:fix     # ESLint with --fix
pnpm format       # Prettier --write across the repo
pnpm format:check # Prettier check (no writes)
```

Node version is pinned in `.nvmrc` (20). CI runs `pnpm lint` before building. ESLint is tuned for a prototype sandbox: real-bug rules (e.g. `react-hooks/rules-of-hooks`) are **errors**, while stylistic/unused-var rules are **warnings** so experiments stay lintable. Prettier is configured (`.prettierrc`) but not yet applied repo-wide — run `pnpm format` as its own commit when you want to normalize formatting.

Local URLs:

- Landing: <http://localhost:5173/>
- A prototype: <http://localhost:5173/student-profile/>

---

## ➕ Adding a new prototype

There's no HTML to write and no entry list to edit — a prototype is just a folder under `prototypes/` with a `main.jsx`. To add one called `my-proto`:

**1. Create the React app** — `prototypes/my-proto/{main.jsx,App.jsx,index.css}`

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

The entry HTML (title from the registry below, `<script>` pointing at this `main.jsx`) is generated automatically — the build scans `prototypes/` for any folder containing a `main.jsx`. It'll be served at `/bs-prototypes/my-proto/`.

**2. Add it to the index** — `components/prototypes.js`:

```js
{
  id: "my-proto",
  name: "My Proto",
  section: "Prototypes",            // or "Experiments" for less-finished work
  href: "/bs-prototypes/my-proto/", // the trailing path segment is the folder name
  accent: "#7C3AED",
  description: "What this prototype is for.",
}
```

This drives the landing card, the prototype switcher, and the generated page `<title>`.

**3. (Optional) Add a card icon** — `landing/App.jsx`, in the `ICONS` map.

Then `pnpm dev` — it'll show up on the landing page and in the prototype switcher automatically.

---

## 🌐 Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. `pnpm build` produces `dist/`
2. The whole dist is copied to `pages/` and uploaded as the Pages artifact
3. GitHub Pages serves it at `kuzin.github.io/bs-prototypes/`

Each prototype lives at its own subpath (`/bs-prototypes/<id>/`). The Vite `base` is set to `/bs-prototypes/` so links resolve correctly on Pages.
