import './SectionCard.css'

/**
 * A titled section card: an optional header (title + right-side actions) over a
 * body. Two header looks:
 *   header="plain" (default) — bold title sitting above the body, no rule
 *   header="bar"             — tinted full-width header strip with a divider
 *
 *   <SectionCard title="Availability">…fields…</SectionCard>
 *
 *   <SectionCard
 *     header="bar"
 *     title="When should Benny engage students in a Book Talk?"
 *   >
 *     <SettingList>…</SettingList>
 *   </SectionCard>
 *
 *   <SectionCard title="Earnable badges" actions={<Button>Add</Button>}>…</SectionCard>
 */
export function SectionCard({ title, actions, header = 'plain', children, className = '' }) {
  return (
    <section className={`section-card section-card--${header} ${className}`.trim()}>
      {(title || actions) && (
        <div className="section-card-head">
          {title && <h3 className="section-card-title">{title}</h3>}
          {actions && <div className="section-card-actions">{actions}</div>}
        </div>
      )}
      <div className="section-card-body">{children}</div>
    </section>
  )
}
