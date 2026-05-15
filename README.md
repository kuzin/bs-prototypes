# 🫘 bs-prototypes

> A pnpm monorepo for Beanstack UI prototypes — shared design system, zero duplication.

[![Deploy to GitHub Pages](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml/badge.svg)](https://github.com/kuzin/bs-prototypes/actions/workflows/deploy.yml)

---

## 🚀 Prototypes

| App | Description | URL |
|---|---|---|
| **Student Profile** | Reading habits, skills, motivation & integrity dashboard | [↗ Live](https://kuzin.github.io/bs-prototypes/student-profile/) |

---

## 🗂 Structure

```
bs-prototypes/
├── packages/
│   └── ui/                  # Shared design system (@bs/ui)
│       ├── tokens.js        # Color tokens, icon IDs, genre palette
│       ├── index.jsx        # Primitive components
│       └── BeanstackProfile.css
└── apps/
    └── student-profile/     # Student reading profile prototype
```

---

## 🎨 Shared UI (`@bs/ui`)

Every app gets these for free:

| Export | Description |
|---|---|
| `C` | Section color tokens (`motivation`, `integrity`, `habits`, `skills`) |
| `LABEL` | Section display names |
| `GENRE_COLORS` | Genre chip color palette |
| `I8_IDS`, `I8_TOKEN` | Icons8 icon map |
| `COVER_PALETTES` | Book cover fallback colors |
| `Ic` | Icons8 icon renderer |
| `StatusBadge` | Status chip (Watch / Improving / Strong / Trending up) |
| `Pill` | Generic label chip |
| `Bar` | Progress bar |
| `Card` | Card container |
| `SectionHeading` | Section heading |
| `GoalRing` | SVG donut progress ring |
| `CoverImage` | Book cover with OpenLibrary fallback |

---

## 💻 Running locally

```bash
pnpm install

# Run a specific app
pnpm dev:student-profile

# Build everything
pnpm build:all
```

---

## ➕ Adding a new prototype

**1. Scaffold**
```bash
mkdir apps/my-prototype
```

**2. `apps/my-prototype/package.json`**
```json
{
  "name": "my-prototype",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@bs/ui": "workspace:*"
  }
}
```

**3. `apps/my-prototype/vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/bs-prototypes/my-prototype/',
  resolve: {
    alias: [
      { find: '@bs/ui/css', replacement: resolve(__dirname, '../../packages/ui/BeanstackProfile.css') },
      { find: '@bs/ui',     replacement: resolve(__dirname, '../../packages/ui/index.jsx') },
    ],
  },
})
```

**4. Use the design system**
```jsx
import "@bs/ui/css";
import { C, Card, SectionHeading, Ic } from "@bs/ui";
```

**5. Wire up dev + deploy**

Add to root `package.json` scripts:
```json
"dev:my-prototype": "pnpm --filter my-prototype dev"
```

Add to `.github/workflows/deploy.yml` build job:
```yaml
- run: pnpm --filter my-prototype build
# and in the Assemble pages step:
# cp -r apps/my-prototype/dist/. pages/my-prototype/
```

**6. Go**
```bash
pnpm install && pnpm dev:my-prototype
```

---

## 🌐 Deployment

Every push to `main` builds all apps and deploys to GitHub Pages. Each prototype gets its own subpath at `kuzin.github.io/bs-prototypes/<app-name>/`.
