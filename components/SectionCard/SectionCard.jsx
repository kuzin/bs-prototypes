import './SectionCard.css'

/**
 * The one titled card. A white bordered panel with a heading over a body —
 * whether it's a settings panel, a form section, or one of the blocks a profile
 * stacks down its column.
 *
 * It absorbed `ProfileCard`, which was the same card with different numbers: a
 * 12px radius against 14, `$gray200` against `--c-border`, no shadow, and a
 * title that promoted itself to a header bar. The two had complementary gaps —
 * one had `actions` and no `flush`, the other `flush` and no `actions` — and
 * the missing `actions` had already forced the profiles to hand-roll their own
 * header rows. The merged card takes the production `.rc-card` visuals.
 *
 * Two ways to give it a title. The **prop** form is the default:
 *
 *   <SectionCard title="Availability">…fields…</SectionCard>
 *   <SectionCard title="Earnable badges" actions={<Button>Add</Button>}>…</SectionCard>
 *
 * The **composed** form is for a title that isn't just a string — a heading
 * with steppers beside it, say. As the first child it gets the same treatment:
 *
 *   <SectionCard header="divider">
 *     <SectionCardTitle actions={<Steppers />}>Lexile trend</SectionCardTitle>
 *     …rows…
 *   </SectionCard>
 *
 * `header` picks what the title looks like:
 *   plain   (default) bold title above the body, no rule
 *   divider full-bleed title with a hairline under it
 *   bar     full-bleed tinted strip with a hairline under it
 *
 * @param {string|node} title    heading text; omit and pass a SectionCardTitle child
 * @param {node}        actions  right-side controls in the header
 * @param {'plain'|'divider'|'bar'} header
 * @param {boolean}     flush    drop the card's padding, for content that owns
 *                               its own edges — tables, full-width lists
 */
export function SectionCard({
  title,
  actions,
  header = 'plain',
  flush = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['section-card', `section-card--${header}`, flush && 'section-card--flush', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={cls} {...rest}>
      {(title || actions) && <SectionCardTitle actions={actions}>{title}</SectionCardTitle>}
      {children}
    </section>
  )
}

/**
 * The card's title. As the first child of a SectionCard it takes whatever the
 * card's `header` asks for; anywhere else it's a plain bold heading.
 */
export function SectionCardTitle({ actions, className = '', children, ...rest }) {
  return (
    <div className={`section-card-title ${className}`.trim()} {...rest}>
      <span className="section-card-title-text">{children}</span>
      {actions && <div className="section-card-actions">{actions}</div>}
    </div>
  )
}
