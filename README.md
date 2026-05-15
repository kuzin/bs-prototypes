# bs-prototypes

A pnpm monorepo for Beanstack UI prototypes. Each app lives under `apps/` and shares a common design system from `packages/ui`.

**Live:** [kuzin.github.io/bs-prototypes/student-profile](https://kuzin.github.io/bs-prototypes/student-profile/)

---

## Structure

```
bs-prototypes/
├── packages/
│   └── ui/                  # Shared design system
│       ├── tokens.js        # Color tokens, icon IDs, genre palette
│       ├── index.jsx        # Primitive components
│       └── BeanstackProfile.css
└── apps/
    └── student-profile/     # Student reading profile prototype
```

## Shared UI (`@bs/ui`)

Anything imported from `@bs/ui` is available to all apps with no setup:

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

## Running locally

```bash
pnpm install

# Run a specific app
pnpm dev:student-profile

# Build all apps
pnpm build:all
```

## Adding a new prototype

1. **Scaffold the app**
   ```bash
   mkdir apps/my-prototype
   ```

2. **`apps/my-prototype/package.json`**
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

3. **`apps/my-prototype/vite.config.js`**
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

4. **Use the shared design system**
   ```jsx
   import "@bs/ui/css";
   import { C, Card, SectionHeading, Ic } from "@bs/ui";
   ```

5. **Add a dev script** to root `package.json`:
   ```json
   "dev:my-prototype": "pnpm --filter my-prototype dev"
   ```

6. **Add to `.github/workflows/deploy.yml`** (two lines in the build job):
   ```yaml
   - run: pnpm --filter my-prototype build
   # in the Assemble pages step:
   # cp -r apps/my-prototype/dist/. pages/my-prototype/
   ```

7. **Install and run**
   ```bash
   pnpm install
   pnpm dev:my-prototype
   ```

## Deployment

Pushing to `main` triggers GitHub Actions, which builds all apps and deploys them to GitHub Pages. Each app lives at its own subpath under `kuzin.github.io/bs-prototypes/`.
