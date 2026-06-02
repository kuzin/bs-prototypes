# CLAUDE.md

Project conventions for `bs-prototypes` — a single Vite app hosting many self-contained
prototypes that model **Beanstack** (a K-12 / public-library reading-engagement product by Joyful
Reading Co.). See [README.md](README.md) for full structure and step-by-step guides.

## Reuse before building

There is **one** component system in `components/`, used everywhere via the `@components` alias.
Before building any UI, look for something to reuse:

- Browse the **Pattern Library** (`prototypes/patterns/`) — the live catalog of every shared
  component — plus `components/` and existing prototypes (`ris`, `sfr`, …).
- When you build a **new reusable component**, put it in `components/<Name>/<Name>.{jsx,css}` **and**
  add a showcase to `prototypes/patterns/sections/<group>.jsx` (atoms / molecules / form-fields /
  charts / domain / layout / …). The Pattern Library is the registry every prototype checks first.
- A component used by only **one** prototype stays inside that prototype
  (`prototypes/<id>/components/`), but is still catalogued — under a **prototype-named** group
  (e.g. _Sessions for Review_, _Insights_) rather than a generic group.

## Icons — use the shared `<Icon>` component

There is **one** icon system: `Icon` (`@components/Icon/Icon`), a house-styled wrapper over
`@tabler/icons-react`. Always use it for glyph icons.

```jsx
import { Icon } from '@components/Icon/Icon'

<Icon name="flame" />                          // defaults: size 18, stroke 1.8, color currentColor
<Icon name="chevron-down" size={11} stroke={2} />
<Icon name="flag" size={16} color="#DC2626" />
```

- **Do NOT hand-roll inline `<svg>` glyph icons**, and **do NOT add new Icons8 (`I8_IDS`/`ti-*`)
  entries.** The old `Ic` (`<Ic name="ti-…">`) is a back-compat shim that already renders `<Icon>`
  underneath — prefer `<Icon>` in new code.
- `name` is a **semantic kebab-case** string from the registry in `components/Icon/Icon.jsx`.
  `ICON_NAMES` exports the full list; the Pattern Library's first Atom is a live gallery of them.
- **To add a glyph:** import the `IconX` from `@tabler/icons-react` in `components/Icon/Icon.jsx`
  and add a `'kebab-name': IconX` entry. Verify the name exists first:
  `ls node_modules/@tabler/icons-react/dist/esm/icons/IconX.mjs`. Don't invent names.
- `color` inherits `currentColor` — only pass `color` for an explicit override.
- **Leave as inline SVG** (not single glyphs): brand/partner logos, and drawn graphics
  (charts, sparklines, progress / goal / donut rings, axis drawings).

## Prototypes

- A prototype is just a folder `prototypes/<slug>/` containing `main.jsx` — the build
  **auto-discovers** it. **No HTML to write and no `vite.config.js` to edit.**
- `App` is a **named** export — match the existing convention, not a default export:
  `export function App` in `App.jsx` → `import { App } from './App'` in `main.jsx`.
- Register the prototype in `components/prototypes.js` (drives the landing card, switcher, and page
  title). The `id` may differ from the folder name (e.g. id `ris-school` lives in folder `ris`).
- Give it a landing-card glyph via the `ICON_NAMES` map in `landing/App.jsx`
  (`'<id>': '<Icon name>'`).
- **CSS:** folder-components self-import their own CSS (importing the component pulls its styles).
  The exception is `@components/ui` — consumers must import its CSS (e.g. `BeanstackProfile.css`)
  themselves.

## Dev workflow & checks

- For new work, branch off `main` (e.g. `claude/<name>`); open a PR rather than pushing to `main`.
- Before pushing, run **`pnpm build` + `pnpm lint` + `pnpm format`**. CI (`verify`) runs
  `pnpm lint` **and** `pnpm format:check` — a Prettier miss fails CI, so `pnpm format` first.
  ESLint is tuned for a sandbox: real-bug rules are **errors**, stylistic/unused-var rules are
  **warnings** (warnings are OK; errors fail).
- **Verify in the browser**, not just a green build — run `pnpm dev` and look at the actual screen,
  especially after large or delegated edits. If you resized the preview for testing, reset it to a
  natural desktop size before finishing.

## Knowledge & memory

- These prototypes model a real product. For **domain / product context**, consult the Outline
  internal wiki (via the `outline` MCP server) and the public sites **beanstack.com** /
  **joyfulreading.com** before guessing.
- **Record durable, non-obvious learnings** — repo conventions, product facts, user preferences,
  gotchas — in your persistent memory so later sessions don't relearn them, and recall it at the
  start of relevant work. Don't record things the code or git history already make obvious.

## Design language

- Palette: **teal / turquoise + navy**, with green-check accents. Mascot: **Benny**. Font: **Nunito**.
- Voice: joyful, celebratory, encouraging, gamified — badges, reading streaks, RMI, leaderboards,
  community goals. Keep new UI on-brand with the existing prototypes.
