# CLAUDE.md

Project conventions for `bs-prototypes`. See [README.md](README.md) for full structure, the
shared component system, and how to add a prototype.

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
- `color` inherits `currentColor` — only pass `color` for an explicit override. Keep any `size`,
  `className`, and `style` the surrounding markup needs.
- **Leave as inline SVG** (these aren't single glyphs): brand/partner logos, and drawn graphics
  (charts, sparklines, progress / goal / donut rings, axis drawings).
- Landing-page card glyphs go in the `ICON_NAMES` map in `landing/App.jsx` (prototype `id` → an
  `<Icon>` name), not a hand-rolled SVG.

## Before pushing

CI (`verify`) runs `pnpm lint` **and** `pnpm format:check`. Run `pnpm format` (Prettier `--write`)
and make sure `pnpm build` + `pnpm lint` pass before committing — a format miss will fail CI.
