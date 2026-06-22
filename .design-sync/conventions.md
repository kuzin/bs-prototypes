# Joyful Prototype Components — how to build with this design system

These are **Beanstack** components (Joyful Reading Co., a K-12 / library reading-engagement product).
Voice: joyful, celebratory, gamified — reading streaks, badges, RMI, challenges, leaderboards, the
mascot **Benny**. Palette: teal/turquoise + navy with green-check accents. Font: **Nunito**.

## Setup — no provider, just the stylesheet
There is **no theme/context provider**. Every component is on the global bundle: `window.Joyful.<Name>`
(import by name from the package — `import { Button, Icon } from '…'`). The only requirement is that the
bundled **`styles.css`** is loaded — it `@import`s the design tokens, the Nunito webfont, and
`_ds_bundle.css` (every component's own CSS). Without it, components render in a fallback font with no
tokens. Nothing else to wrap.

## Styling idiom — props for components, tokens for your own layout
**Do NOT pass your own `className`/CSS to components** — each owns its styling. Vary appearance through
**props**:
- `variant` — e.g. `Button`/`IconButton` `'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'`;
  `Tabs`/`Pill` have their own variant sets; `Banner` uses `level='info'|'success'|'warning'|'error'`.
- `size` — `'sm' | 'md' | 'lg'` on most controls.
- `accent` / `color` — pass a CSS color (often a token) to tint accent variants, charts, pills, steppers.

For **your own layout/glue** (wrappers, spacing, page chrome), use the design tokens as `var(--…)` — never
hardcode hexes or px. The real token families (defined in `styles.css`):
- Color: `--c-brand-teal`, `--c-brand-coral`, `--c-brand-green`, `--c-text`, `--c-text-muted`,
  `--c-text-subtle`, `--c-surface`, `--c-bg`, `--c-bg-muted`, `--c-border`, `--c-border-strong`,
  `--c-success`, `--c-warning`, `--c-danger`, `--c-info` (+ `--c-slate-50…900` and named scale steps).
- Spacing: `--space-2 … --space-32`. Radius: `--radius-xs/sm/md/lg/xl/2xl/pill/full`.
- Type: `--font-sans` (Nunito), `--text-2xs … --text-3xl`, weight `--fw-normal/medium/semibold/bold/extrabold/black`.
- Elevation: `--shadow-sm/md/lg`.

## Where the truth lives (read before composing)
- The bundled **`styles.css`** and its imports — the authoritative token + class source.
- Per component: **`<Name>.prompt.md`** (usage + realistic examples) and **`<Name>.d.ts`** (the exact prop
  contract). Components are grouped into `atoms / molecules / form-fields / form-patterns / charts /
  domain / layout` — start in the group that matches what you're building.

## One idiomatic example
```jsx
// Components from the bundle; styled via props. Layout glue uses tokens.
<div style={{
  display: 'grid', gap: 'var(--space-12)', padding: 'var(--space-16)',
  background: 'var(--c-surface)', border: '1px solid var(--c-border)',
  borderRadius: 'var(--radius-lg)', fontFamily: 'var(--font-sans)',
}}>
  <SectionHeading title="This week's reading" subtitle="Room 12 · Grade 4" />
  <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
    <Pill variant="soft" color="var(--c-brand-green)">On track</Pill>
    <ProgressBar value={340} max={500} label="Minutes read" valueLabel="340 / 500 min" />
  </div>
  <Button variant="primary" icon={<Icon name="flame" />}>Log a reading session</Button>
</div>
```
Keep content authentic to the product (students, classes, streaks, RMI, challenges) — these components are
the Beanstack UI, and on-brand copy is part of the design.
