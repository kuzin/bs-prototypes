# design-sync notes — bs-prototypes → "Joyful Prototype Components"

Repo-specific gotchas and decisions for syncing this design system to claude.ai/design.
Read this before any re-sync.

**Status: first full sync COMPLETE (2026-06-22).** 68 components uploaded to project
`726ebb74-67f4-412e-9bd9-5afe68efd2f9` ("Joyful Prototype Components"), all with authored previews +
hand-written `dtsPropsFor`, all 199 cells graded good. Re-sync via the driver (see Resume procedure).

## What this repo is (and why it's an off-default package shape)

- `bs-prototypes` is a **Vite app**, not a published component library. The design
  system lives in `components/` (the `@components` alias) and is plain **JS/JSX with
  NO TypeScript and NO built `dist/`**.
- Therefore the converter runs in **synth-entry mode** (no dist, no `.d.ts`): it
  scans `components/` for PascalCase value exports via ts-morph and bundles them.
- Project: **Joyful Prototype Components**, id `726ebb74-67f4-412e-9bd9-5afe68efd2f9`.
  Global: `window.Joyful`.

## Config decisions (.design-sync/config.json)

- `pkg: "bs-prototypes"` + a **symlink** `node_modules/bs-prototypes -> <repo root>` so the
  repo acts as its own installed package. This makes `PKG_DIR`/`tokensPkg` resolution work.
  **The symlink is gitignored — recreate it on a fresh clone** (see setup.sh / Resume).
- `entry: "./.design-sync/__synth_entry__.js"` — a **deliberately nonexistent path**. It makes
  the PKG_DIR walk land on the repo root (clean component paths) while `resolveDistEntry(soft)`
  returns null → synth-entry mode. The `[NO_DIST] --entry ... doesn't exist` log line is expected.
- `srcDir: "components"` — pins the source root (repo has no src/ or lib/).
- `tsconfig: ".design-sync/tsconfig.aliases.json"` — maps `@components/*` → `components/*` so
  esbuild resolves the alias the components self-import (incl. their `*.css`).
- `tokensPkg: "bs-prototypes"` + `tokensGlob: ".design-sync/styles/ds-globals.css"` — ships the
  global stylesheet (see below) into the styles.css closure.

## Styling — three things components don't ship themselves

`.design-sync/styles/ds-globals.css` (authored, committed) provides:
1. **Nunito webfont** via a Google Fonts `@import`. The repo references 'Nunito' by name but
   NEVER ships it (relies on system install / ad-hoc loading), so without this every design
   renders in the Trebuchet/system fallback. Loaded remotely → validate should report
   `[FONT_REMOTE]` (informational), not `[FONT_MISSING]`.
2. **Design tokens** (`:root` custom properties) mirrored verbatim from `components/ui/tokens.css`
   — the app imports tokens per-entry (main.jsx), not per component, so they never ride into the
   component bundle.
3. **Base layer** (box-sizing, body font/colour, button inherit) mirrored from the scaffold in
   `scripts/new-prototype.js`.

Component CSS rides into `_ds_bundle.css` automatically via each component's `import
'@components/X/X.css'`.

## Component discovery — pruning notes

- Synth-entry scans all `*.jsx` under `components/` for PascalCase value exports.
- `components/ui/index.jsx` re-exports `C` (single uppercase → passes the scan AND isComponentName)
  → **prune with `componentSrcMap: {"C": null}`**. `LABEL` is auto-filtered (all-caps). The
  underscore constants (GENRE_COLORS, I8_*, COVER_PALETTES, RMI_ICONS, NIVO_THEME, *_MARGIN,
  CHART_H, AXIS_*) are skipped by the PascalCase regex.
- `Ic` (legacy Icons8 shim in ui/index.jsx) — judgment call; consider `componentSrcMap: {"Ic": null}`
  to avoid promoting legacy API.
- `charts/charts.jsx` yields `SliceTooltip`, `GradeTooltip`, `BarTooltip`, `ChartLegend` — the
  tooltips are nivo-internal (take nivo slice/data shapes); consider pruning or floor-carding.
- Big multi-export files: `Form.jsx` (~16: Field/Input/Select/Textarea/Checkbox/RadioGroup/Radio/
  DateInput/TimeInput/ColorInput/FileInput/CheckboxGroup/CheckboxGroupItem/MultiSelect/NumberInput/
  RangeSlider), `Primitives.jsx` (10: Divider/Spinner/IconButton/Tooltip/Banner/Breadcrumb/
  Accordion/EmptyState/Skeleton/SectionHeading), `Cards.jsx` (StatCard/ChartCard/CardNote).

## Contracts — dtsPropsFor is the fidelity lever

There are NO `.d.ts`, so `propsBodyFor` returns empty for every component → `<Name>Props` ships
empty unless `cfg.dtsPropsFor.<Name>` is authored. JSDoc IS captured (source enrichment) so
`.prompt.md` stays rich, but the prop contract the design agent codes against needs
`dtsPropsFor` hand-authored from each component's destructured params + JSDoc. This is the
main remaining quality work (≈80 components).

## Re-sync risks (watch-list)

- **ds-globals.css inlines tokens** from components/ui/tokens.css — if tokens.css changes,
  refresh the `:root` block in ds-globals.css.
- **ds-globals.css also mirrors `.sdb-legend*`** from prototypes/ris/components/SchoolDashboard.css
  (for ChartLegend) — if those rules change upstream, refresh the mirror.
- **node_modules/bs-prototypes symlink** is gitignored — recreate on fresh clone (`setup.sh` does it).
- The remote Nunito `@import` means designs depend on Google Fonts at render time.
- **`patch-staged.mjs` depends on the `IIFE_IMPORT_META_DEFINE = {` anchor in lib/common.mjs.** If a skill
  update changes common.mjs, the patch errors loudly (re-fix it) — never ignore, or the glob crash returns.
- **dtsPropsFor / overrides are regenerated by `merge-props.mjs` from learnings**, but learnings are deleted
  after folding — config.json is now the source of truth; edit it directly on re-sync, not merge-props.
- Authored previews neutralize some component CSS (PrototypeNav fixed→static) and use data-URI images —
  tied to current component source; re-check if those components change.

## The `import.meta.glob` bundle crash (CRITICAL, durable patch)

`ComponentUsage.jsx` calls `import.meta.glob(...)` at module top-level, and `PrototypeNav.jsx`
imports `ComponentUsage` — so it lands in the IIFE bundle even though `ComponentUsage` is pruned
from the card list (`componentSrcMap` null only drops the card, not the bundle graph). Under the
`iife` format esbuild leaves `import.meta` empty, so `glob()` throws at module eval and kills
`window.Joyful` for EVERY preview. Fix: **`.design-sync/patch-staged.mjs`** adds
`'import.meta.glob': 'Object'` to `IIFE_IMPORT_META_DEFINE` in the staged `.ds-sync/lib/common.mjs`
(`Object(...)` is callable + returns an object → harmless no-op). `setup.sh` re-applies it after the
`cp -r` restages (which overwrites the edit). bundle.mjs is forbidden to fork and statically imports
that constant, so the override mechanism can't reach it — patching the staged file is the only way.
If `patch-staged.mjs` ever errors (`anchor not found`), upstream changed common.mjs — fix the patch.

## Preview authoring — conventions & gotchas (carry-forward)

- **Preview .tsx contract**: `import { X, Icon } from 'bs-prototypes'` (a shim maps the pkg name to
  `window.Joyful`). Each named export MUST be a **component function** (`export const Foo = () => …`),
  never a bare element — the harness does `React.createElement(export)` and drops non-functions.
- **Icons**: only names in `components/Icon/Icon.jsx` REGISTRY are valid (`flame`, `star`, `trophy`,
  `users`, `chevron-right`, … — `bookmark` is NOT valid). A full list was cached during the run.
- **`position:fixed` overlays clip in the card**: the capture cell sets `transform:translateZ(0)`,
  making it the containing block for `position:fixed`. Centered Modals clipped / side panels escaped.
  Handled via `cfg.overrides.Modal = {cardMode:'column'}` + an in-preview sized `Frame` wrapper
  (gives the cell real height). Same class affects any fixed overlay added later.
- **cardMode overrides applied**: `Modal`, `Table`, `Banner` → `column` (wide / overlay; keeps all
  cells, full width). `MultiSelect` open menu portals to body — authored CLOSED states only (no
  override needed); a future open-menu preview would want `{cardMode:'single', viewport:'420x520'}`.
- **`Tooltip`** bubble is hover-only (no `open`/`defaultOpen` prop) — authored as trigger states.
- **`onChange` signatures differ**: Input/Select/Textarea/DateInput/TimeInput pass the **event**
  (`e.target.value`); Checkbox→`(boolean)`, CheckboxGroup→`(string[])`, RadioGroup→`(value)`,
  NumberInput→`(number)`, ColorInput/RangeSlider/MultiSelect/SearchInput→`(value)`.
- **External images are blocked** in previews — use inline `data:` URIs (ImageDropzone preview does).
- `dtsPropsFor` for every authored component lives in `config.json` (there are NO `.d.ts` in the
  repo, so this is the only prop contract the design agent sees). Regenerate group stubs with
  `node .design-sync/gen-groups.mjs`; (re-)merge wave learnings with `node .design-sync/merge-props.mjs`.

## Known render warns (triaged benign — re-syncs: these are expected, not new)

- **AlertRow / AlertsBanner** — `package-validate` reports `errs:1` (`[RENDER_ERRORS]`) for each, but a
  direct headless load of their `.html` throws **zero** pageerrors and they render fully (colored rows).
  Transient/spurious capture in the batch run; non-blocking. Both graded good.
- **bs.svg logo broken-image** in the nav shells (MainRail / Sidebar / AppShell / PrototypeNav): the
  components hard-reference `/bs-prototypes/bs.svg`, which the bundle can't ship (external asset). Renders
  as a tiny broken-image glyph; surrounding chrome is fully styled. Cosmetic, accepted.
- **Tooltip / DatePicker / TimePicker / CustomSelect / MultiSelect** open popups are hover/click-only and
  portal/position-fixed → authored in closed/trigger state (bubble/menu never shows statically).

## cardMode overrides (config.overrides) — why each

- **column** (full width, ALL variant cells kept): Table, Banner, AlertRow, AlertsBanner, ReadingHealth,
  AppShell, Sidebar, MainRail, Hero, ChartCard, TrendChart, PrototypeNav. Wide content / full-page shells.
- **single + primaryStory** (the [GRID_OVERFLOW] "escape" verdict — `position:fixed`/portaled content that
  no grid can present): Modal (Center), Funnel (ChallengeFunnel). Other variants stay in the .prompt.md/.d.ts.
- **PrototypeNav** is column (not single) because its preview neutralizes `.proto-nav`'s `position:fixed`
  to `static`, which removes the escape — so all 3 selection states show.

## Wave-2 source facts

- **SchoolPicker lives in `components/Sidebar/Sidebar.jsx`** (not its own folder).
- **Sidebar `nav` items use NAV_ICONS keys** (`overview/flame/shield/lexile/book/analytics/flag/…`), not
  raw `<Icon>` names.
- **CardNote**: only `tone: 'neutral' | 'accent'` are styled in Cards.css (other tones fall back unstyled).
- **TrendChart / Funnel / BarList**: charts need a sized parent (`<div style={{height,width}}>`) or render
  blank; TrendChart is nivo-based. ChartCard wraps a chart + optional footer legend.

## Resume procedure (one command path)

1. `bash .design-sync/setup.sh` — stages converter scripts into `.ds-sync/`, creates the
   `node_modules/bs-prototypes` symlink, AND re-applies `patch-staged.mjs` (the glob fix).
2. Install converter deps: `npm i --prefix .ds-sync esbuild ts-morph @types/react typescript`
   (typescript enables the `.d.ts` parse check; playwright@1.49.x matches the cached chromium-1148).
3. Build: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle`
4. Validate: `node .ds-sync/package-validate.mjs ./ds-bundle`
5. Re-sync uses the driver: `node .ds-sync/resync.mjs … --remote .design-sync/.cache/remote-sync.json`.
