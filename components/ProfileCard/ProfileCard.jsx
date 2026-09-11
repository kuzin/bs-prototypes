import './ProfileCard.css'

/**
 * ProfileCard — the card the student / reader profiles are built from, and the
 * pattern for any panel that stacks titled blocks down a scrolling column.
 *
 * It differs from `SectionCard` in what the title does: here the first title in
 * a padded card promotes itself into a full-bleed header bar with a divider,
 * because these cards sit shoulder-to-shoulder in a column and need a hard edge
 * between "what this block is" and its contents. `SectionCard` keeps the title
 * inline unless you ask for `header="bar"`.
 *
 *   <ProfileCard>
 *     <ProfileCardTitle>At a glance</ProfileCardTitle>
 *     …rows…
 *   </ProfileCard>
 *
 *   // `flush` drops the padding for content that owns its own edges —
 *   // tables, full-width lists, anything that should bleed to the card.
 *   <ProfileCard flush>
 *     <ProfileCardTitle>Recommended actions</ProfileCardTitle>
 *     …rows…
 *   </ProfileCard>
 *
 * @param {boolean} flush  drop the card's padding
 */
export function ProfileCard({ flush, className = '', children, ...rest }) {
  const cls = ['pcard', flush && 'pcard--flush', className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}

/**
 * The card's title. As the first child of a padded ProfileCard it renders as a
 * header bar; anywhere else it's a plain bold heading.
 */
export function ProfileCardTitle({ className = '', children, ...rest }) {
  return (
    <div className={`pcard-title ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
