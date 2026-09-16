import './HomeBadges.css'

/**
 * The badge strip under "My Badges" — `components/badges/Badges.tsx` with `circle={home}`, which
 * renders `Badge`'s circle branch.
 *
 * It is ONLY the artwork: an 87pt circle, with no name and no date under it. Those belong to the
 * list variant, on the Log tab's Badges screen.
 *
 * Badge art is API-served (`badge_image_thumb_url`), so the gradients here stand in for it. In the
 * app the circle is filled with the tenant's primaryColor and the artwork sits `contain`ed on top;
 * an unearned badge is greyLight1, which is reproduced.
 */
export function HomeBadges({ badges, onPress }) {
  return (
    <div className="m-hbadges">
      {badges.map((b) => (
        <button
          key={b.id}
          type="button"
          className="m-hbadge"
          style={{ background: b.earned === false ? 'var(--m-grey-light-1)' : b.art }}
          onClick={() => onPress?.(b)}
          aria-label={`${b.name}${b.earned === false ? '' : ', completed'}`}
        />
      ))}
    </div>
  )
}
