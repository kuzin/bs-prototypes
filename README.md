# 🫘 bs-prototypes

> A single Vite app of Beanstack UI prototypes — many prototypes, one shared design system.

[![CI](https://github.com/kuzin/bs-prototypes/actions/workflows/ci.yml/badge.svg)](https://github.com/kuzin/bs-prototypes/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml/badge.svg)](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml)

This repo is a sandbox for trying out new Beanstack UI ideas — analytics dashboards, redesigned flows, reader-facing experiences, and one-off explorations — without touching the production Rails/React app. Each prototype is a standalone page in a single Vite build, all sharing the same `@components` design system so they look and feel like the same product.

🔗 **Live index:** [kuzin.github.io/bs-prototypes](https://kuzin.github.io/bs-prototypes/)

---

## 🚀 Prototypes

The landing page groups cards by **section** (the tabs) and then by **category** — both come straight from
[components/prototypes.js](components/prototypes.js), so reordering that list is the only place anything is arranged.

| Prototype                      | Category          | What it is                                                                                | Path                                                                              |
| ------------------------------ | ----------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Challenge Creator v2**       | Challenges        | Full-screen wizard to create reading challenges — types, badges, rewards, raffle tickets  | [/challenge-creator/](https://kuzin.github.io/bs-prototypes/challenge-creator/)   |
| **Pick Your Path**             | Challenges        | Teacher sets a vocabulary Destination; students pick a high-interest Path to earn badges  | [/pick-your-path/](https://kuzin.github.io/bs-prototypes/pick-your-path/)         |
| **Gameboard: Admin View**      | Challenges        | Theme a gameboard and place badges along the path readers travel                          | [/gameboard/](https://kuzin.github.io/bs-prototypes/gameboard/)                   |
| **Gameboard: Reader View**     | Challenges        | How a reader travels the gameboard — log, unlock, celebrate                               | [/gameboard-reader/](https://kuzin.github.io/bs-prototypes/gameboard-reader/)     |
| **Student Profile**            | Profiles          | Single-student habits, skills, motivation & integrity                                     | [/student-profile/](https://kuzin.github.io/bs-prototypes/student-profile/)       |
| **Reader Profile**             | Profiles          | Library reader profile — one account, many readers                                        | [/reader-profile/](https://kuzin.github.io/bs-prototypes/reader-profile/)         |
| **Reading Engagement Signals** | Profiles          | Increasing, consistent or declining — and what is driving it                              | [/engagement-signals/](https://kuzin.github.io/bs-prototypes/engagement-signals/) |
| **RIS: School**                | Analytics         | School analytics for principals & instructional coaches                                   | [/ris/](https://kuzin.github.io/bs-prototypes/ris/)                               |
| **RIS: District**              | Analytics         | District analytics for curriculum directors & superintendents                             | [/ris-district/](https://kuzin.github.io/bs-prototypes/ris-district/)             |
| **Book Talks: Badges**         | Book Talks        | Self-contained Benny Book Talk activity badge — chat to earn it                           | [/book-talks/](https://kuzin.github.io/bs-prototypes/book-talks/)                 |
| **Book Talks: Comprehension**  | Book Talks        | Site-wide BTWB setting — start a book talk on every completed book, on by default         | [/btwb/](https://kuzin.github.io/bs-prototypes/btwb/)                             |
| **Book Discovery**             | Reader experience | Discover, reviews, My Shelf, Benny recommendations, and partner shelves                   | [/books/](https://kuzin.github.io/bs-prototypes/books/)                           |
| **Words with Benny**           | Reader experience | Log reading, unlock a word from the book — collect them, and educators see the growth     | [/words-with-benny/](https://kuzin.github.io/bs-prototypes/words-with-benny/)     |
| **Scholastic Logging Flow**    | Integrations      | Combined reading-log flow around a Scholastic magazines list — search, log, timer, review | [/logging-flow/](https://kuzin.github.io/bs-prototypes/logging-flow/)             |
| **Beeverso Integration**       | Integrations      | Link a Beeverso account — Spanish reading logs itself in Beanstack                        | [/beeverso/](https://kuzin.github.io/bs-prototypes/beeverso/)                     |
| **Pattern Library**            | —                 | The live catalog of every shared component, with interactive knobs                        | [/patterns/](https://kuzin.github.io/bs-prototypes/patterns/)                     |

### ✅ Completed

Explorations that have been handed off — kept live for reference.

| Prototype                 | Category          | What it is                                                                 | Path                                                                              |
| ------------------------- | ----------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Sessions for Review**   | Reading integrity | Review Book Talks for integrity, engagement, and student-safety signals    | [/sfr/](https://kuzin.github.io/bs-prototypes/sfr/)                               |
| **Admin Dashboard v2**    | Admin             | Editable dashboard with drag-and-drop, resizable, lockable widgets         | [/admin-dashboard/](https://kuzin.github.io/bs-prototypes/admin-dashboard/)       |
| **Rostering: School**     | Rostering         | Clever roster sync — preview, filter, manage                               | [/rostering/](https://kuzin.github.io/bs-prototypes/rostering/)                   |
| **Rostering: District**   | Rostering         | District-wide roster sync filters & previews                               | [/rostering-district/](https://kuzin.github.io/bs-prototypes/rostering-district/) |
| **Unified Joyful Footer** | Admin             | A consistent Joyful-brand footer across Comics Plus, MyDot, Beanstack, RMI | [/footers/](https://kuzin.github.io/bs-prototypes/footers/)                       |

### 🧪 Experiments

Less-finished explorations that live alongside the main prototypes.

| Experiment                   | Category          | What it is                                                             | Path                                                          |
| ---------------------------- | ----------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Insights · Load Concepts** | Analytics         | Lighter Insights page load — snapshot, drill-down, progressive, pinned | [/insights/](https://kuzin.github.io/bs-prototypes/insights/) |
| **Web App**                  | Reader experience | Beanstack consumer web app — reader dashboard, challenges, reading log | [/web-app/](https://kuzin.github.io/bs-prototypes/web-app/)   |

RIS = Reading Information System. SFR = Sessions for Review. BTWB = Book Talk with Benny.

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
│   ├── challenge-creator/  gameboard/  gameboard-reader/  pick-your-path/
│   ├── reader-profile/  engagement-signals/
│   ├── ris/  ris-district/  sfr/  admin-dashboard/
│   ├── rostering/  rostering-district/
│   ├── book-talks/  btwb/  books/  words-with-benny/
│   ├── logging-flow/  beeverso/
│   ├── insights/  web-app/  footers/
│   └── patterns/              #   the Pattern Library (catalog.jsx + sections/)
├── components/                # The shared component system — each in its own folder
│   ├── Button/  Tabs/  Modal/  Table/  Flyout/  Toggle/  Pill/  Avatar/  Toast/
│   ├── Form/  CustomSelect/  FilterBar/  DatePicker/  TimePicker/  SearchInput/
│   ├── Cards/  charts/  TrendChart/  BarList/  Funnel/  ProgressBar/  WordCloud/
│   ├── Primitives/            #   Spinner, Tooltip, Banner, EmptyState, Accordion, …
│   ├── Icon/  PlumpyIcon/  BsIcons/  RmiIcons/       #   the icon families
│   ├── ReadingHealth/  AlertsBanner/  Hero/  BennyBubble/  PartnerConnect/
│   ├── AppShell/  Sidebar/  PrototypeNav/  BackBar/  MainRail/  PageHeader/
│   ├── ui/                    #   the `Ic` back-compat shim + design tokens
│   └── prototypes.js          #   source of truth for the prototype list
├── landing/                   # The landing page (tabbed, categorized prototype cards)
├── scripts/                   # new-prototype.js (pnpm new) + check-prototypes.js (pnpm check)
├── public/                    # Static assets (favicon, Benny, avatars, partner brand art)
├── vite.config.js             # Entry-generating plugin + @components alias
└── package.json
```

**No HTML files in the repo.** Each prototype's entry HTML is generated from a single
template in [vite.config.js](vite.config.js) — served from memory in dev, written
transiently for `build` and removed once the bundle closes. Entries are auto-discovered
by scanning `prototypes/` for folders with a `main.jsx`, so there's no manual entry list
to keep in sync. Everything builds into a single `dist/` artifact (with clean
`/<id>/` paths) that's uploaded verbatim to GitHub Pages.

Imports use one alias: `@components` (→ `components/`), e.g. `import { Button } from '@components/Button/Button'`.

**Typeface.** The generated HTML loads **Museo Sans Rounded** — Beanstack's real typeface — from an
Adobe Fonts kit (`kus1pku`), preconnected in the `<head>` so it downloads before the JS bundle. Nunito
stays as the fallback in `--font-sans`. The kit has no 400/600, so those render as 500/700.

---

## 🎨 Shared components

There is **one** component system, in `components/` — every prototype draws from it via the `@components` alias. Each component lives in its own folder and self-imports its CSS:

- **Atoms & molecules** — `Button`, `Pill`, `Avatar`, `Toggle`, `Tabs`, `Flyout`, `Modal`, `Table`, `Toast`, `Stepper`, `RowAction`, `TrendChip`, `CompleteToggle`, and `Primitives/` (IconButton, Divider, Spinner, Tooltip, Banner, Breadcrumb, Accordion, EmptyState, Skeleton, SectionHeading)
- **Forms** — `Form` (Field/Input/Select/Textarea/Checkbox/Radio/…), `FormContext`, `CustomSelect`, `FilterBar`, `ActiveFilters`, `SearchInput`, `DatePicker`, `TimePicker`, `RichText`, `ImageDropzone`, `SettingRow`
- **Charts & data** — `Cards` (StatCard/ChartCard/CardNote), `charts` (Nivo wrappers + tooltips), `TrendChart`, `BarList`, `Funnel`, `ProgressBar`, `WordCloud`, `DailyReadingTracker`
- **Domain** — `ReadingHealth`, `AlertsBanner`, `Hero`, `ProfileCard`, `BennyBubble`, `Confetti`, `PartnerBrand` / `PartnerConnect` (real partner marks + the account-linking flow), `RmiIcons`
- **Layout & chrome** — `AppShell` (prop-driven shell: Sidebar + content slot + optional back bar), `Sidebar` (prop-driven nav + school picker), `MainRail`, `PageHeader`, `SectionCard`, `PrototypeNav`, `BackBar`, `PreviewBar`
- **`ui/`** — the legacy `Ic` shim plus the design tokens: [tokens.css](components/ui/tokens.css) (`--c-*` color, `--font-*`/`--text-*`/`--fw-*` type, `--radius-*`, `--shadow-*`, `--space-*` — imported once per entry from each `main.jsx`) and the JS tokens `C`, `LABEL`, `GENRE_COLORS`, `I8_IDS`, `COVER_PALETTES`, imported via `@components/ui`. **Prefer `var(--c-…)` over hardcoded hexes in new CSS.**

### 🔣 Icons

There is **one** icon component — `Icon` (`@components/Icon/Icon`), a house-styled wrapper over [`@tabler/icons-react`](https://tabler.io/icons). Use a semantic kebab-case `name` so call sites stay library-agnostic:

```jsx
import { Icon } from '@components/Icon/Icon'

<Icon name="flame" />                          // defaults: size 18, stroke 1.8, color currentColor
<Icon name="chevron-down" size={11} stroke={2} />
<Icon name="flag" size={16} color="#DC2626" />
```

- **Don't hand-roll inline `<svg>` glyphs, and don't add Icons8 entries.** To add a glyph, register it in [components/Icon/Icon.jsx](components/Icon/Icon.jsx): import the `IconX` from `@tabler/icons-react` and add a `'kebab-name': IconX` entry (verify the Tabler name exists first). `ICON_NAMES` exports the full list, and the Pattern Library's **first Atom is a live gallery** of every registered name with size/stroke/color knobs.
- `color` defaults to `currentColor`, so icons inherit the parent's CSS `color` — only pass `color` for an explicit override.
- The legacy `ui/` `Ic` (`<Ic name="ti-…">`) is a back-compat shim that renders `<Icon>` under the hood (no more remote Icons8 PNGs). Prefer `<Icon>` in new code.
- Two other families exist for the admin chrome, and they're deliberate, not alternatives to `Icon`: **`PlumpyIcon`** (the exact duotone Icons8 Plumpy icons the real admin sidebar uses) and **`BsIcons`** (the product's own illustrated icons, copied verbatim out of the shipped app).
- **Exceptions that stay inline SVG** (not single glyphs): brand/partner logos, and drawn graphics like charts, sparklines, and progress / goal / donut rings.

### 📚 The Pattern Library

**The Pattern Library prototype (`prototypes/patterns/`) is the live catalog** — a hash-routed browser (home grid → a dedicated page per component; sidebar groups expand in place) with interactive knobs, importing components straight from `@components`. It's data-driven: each group's showcases + section entries live in [prototypes/patterns/sections/](prototypes/patterns/sections/)`<group>.jsx`, with shared knob helpers in `sections/_shared.jsx`. [prototypes/patterns/catalog.jsx](prototypes/patterns/catalog.jsx) stays slim — it assembles `SECTIONS` from the per-group arrays and owns `GROUPS` + `GroupHeader` + the CSS imports; [prototypes/patterns/App.jsx](prototypes/patterns/App.jsx) is the router/shell.

Groups come in two kinds:

- **Generic** — `foundations` (the design tokens), `atoms`, `molecules`, `form-fields`, `form-patterns`, `charts`, `domain`, `layout`. A component used by more than one prototype belongs in `components/` and in one of these.
- **Per-prototype** (`kind: 'prototype'`) — `sfr`, `insights`, `challenge-creator`, `book-talks`, `student-profile`, `books`, `admin-dashboard`, `gameboard`, `gameboard-reader`, `words-with-benny`, `engagement-signals`. Components specific to a single prototype stay inside that prototype (e.g. ris's `SchoolDashboard`, `RisLayout`, `StudentPanel` in `prototypes/ris/components/`) but are **still catalogued**, under the group named after their prototype.

When you build a new reusable component, add it to `components/<Name>/` **and** add an entry to the matching `sections/<group>.jsx` — that's the registry every other prototype checks first.

> **Source inspector.** `PrototypeNav` (the switcher in the corner of every prototype) can open `ComponentUsage`, which lazily loads the raw source of any prototype or shared component file — handy for seeing how a pattern is actually wired without leaving the page.

---

## 💻 Running locally

```bash
pnpm install
pnpm dev          # starts the Vite dev server (all prototypes)
pnpm build        # builds all prototypes into dist/
pnpm preview      # serve the production build locally
pnpm new <id>     # scaffold a new prototype (files + registry entry + landing icon)
pnpm lint         # ESLint (flat config; warnings ok, errors fail)
pnpm lint:fix     # ESLint with --fix
pnpm format       # Prettier --write across the repo
pnpm format:check # Prettier check (no writes)
pnpm check        # verify prototype folders ↔ registry ↔ landing icons are in sync
```

**Toolchain.** Node is pinned to **24** — in `.nvmrc` (nvm / CI) and `.tool-versions` (asdf); run `nvm use` or `asdf install` to match. Vite **8** (rolldown) requires Node ≥ 20.19, React is **19**, and pnpm comes via [corepack](https://nodejs.org/api/corepack.html) (the `packageManager` field pins `pnpm@9`), so `pnpm install` just works once the right Node is active. ESLint is intentionally held at **9** — `eslint-plugin-react@7.37.5` peer-caps it at `^9.7`, so don't bump to 10 until that plugin ships ESLint-10 support.

**Checks.** CI (`.github/workflows/ci.yml`, job `verify`) runs `pnpm lint`, `pnpm format:check`, `pnpm check`, then `pnpm build` on every PR and push to `main`. ESLint is tuned for a prototype sandbox: real-bug rules (e.g. `react-hooks/rules-of-hooks`) are **errors**, while stylistic/unused-var rules are **warnings** so experiments stay lintable. Prettier formatting is enforced by `format:check`, and a [husky](https://typicode.github.io/husky/) pre-commit hook runs `lint-staged` to auto-format staged files — so commits stay clean without thinking about it. `pnpm check` guards the three places a prototype is registered (folder / `prototypes.js` / landing icon) against silent drift.

A green build isn't the whole story — **look at the actual screen** with `pnpm dev` before calling something done.

Local URLs:

- Landing: <http://localhost:5173/>
- A prototype: <http://localhost:5173/student-profile/>

---

## ➕ Adding a new prototype

There's no HTML to write and no entry list to edit — a prototype is just a folder under `prototypes/` with a `main.jsx`. To add one called `my-proto`:

> **Shortcut:** `pnpm new my-proto` does all three steps below — creates the folder + files, adds the
> `components/prototypes.js` entry, and registers the landing-card icon. Flags: `--name`, `--section`,
> `--accent`, `--icon`, `--desc` (`pnpm new --help` lists them). It doesn't set `category` — add that
> by hand if the card should sit under a sub-heading. The manual steps below are what it automates.

**1. Create the React app** — `prototypes/my-proto/{main.jsx,App.jsx,index.css}`

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@components/ui/tokens.css'
import './index.css'
import { App } from './App' // App.jsx uses a named export: `export function App() { … }`

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
  section: "Prototypes",            // tab: "Prototypes" | "Experiments" | "Completed"
  category: "Challenges",           // sub-heading within the tab
  href: "/bs-prototypes/my-proto/", // the trailing path segment is the folder name
  accent: "#7C3AED",
  description: "What this prototype is for.",
}
```

This drives the landing card, the prototype switcher, and the generated page `<title>`. Registry order decides both the category order and the order within it.

**3. Add a card icon** — `landing/App.jsx`, in the `ICON_NAMES` map: `'my-proto': '<name>'`, where `<name>` is a `<PlumpyIcon>` name — the duotone Icons8 pack the admin chrome uses, drawn in the card's accent on a tile tinted with it. If none fits, fetch the real glyph from Icons8 into [components/PlumpyIcon/PlumpyIcon.jsx](components/PlumpyIcon/PlumpyIcon.jsx) with its Icons8 id — no lookalikes, no hand-rolled SVG. `pnpm check` fails if the icon is missing or isn't on the pack.

Then `pnpm dev` — it'll show up on the landing page and in the prototype switcher automatically.

---

## 🌐 Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. `pnpm build` produces `dist/`
2. `dist/` is uploaded as the Pages artifact and deployed by `actions/deploy-pages`
3. GitHub Pages serves it at `kuzin.github.io/bs-prototypes/`

Each prototype lives at its own subpath (`/bs-prototypes/<id>/`). The Vite `base` is set to `/bs-prototypes/` so links resolve correctly on Pages.

Work on a branch (`claude/<name>`) and open a PR rather than pushing to `main` — merging to `main` **is** the deploy.
