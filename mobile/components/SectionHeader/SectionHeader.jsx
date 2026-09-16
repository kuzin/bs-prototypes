import { Img } from '../Img/Img'
import './SectionHeader.css'

/**
 * `src/components/home/shared/Header/Header.tsx` — the title + "View All" row above every Home
 * section.
 *
 * Its gutter is 21 left / 18 right, not the page's 20/20. That asymmetry is in the source and is
 * visible when a section header sits above a full-bleed carousel, so it is kept rather than
 * rounded off.
 */
export function SectionHeader({ title, onViewAll }) {
  const label = title.replace(/^My /, '')
  return (
    <div className="m-secthead">
      {/* `m-section-head`, not the `sectionTitle` role — the app's own is 20/800 with positive
          tracking, which is heavier and looser than every other section header in the product.
          One declaration, in base.css. */}
      <h2 className="m-section-head">{title}</h2>
      {onViewAll && (
        <button
          type="button"
          className="m-secthead-all"
          onClick={onViewAll}
          aria-label={`View all ${label}`}
        >
          View All
          {/* A chevron, and 15pt rather than the source's 14. At 14 with no affordance it read as
              a caption beside a 20pt heading — you had to already know it was tappable. */}
          <Img name="swipe_right_arrow" size={14} tint="var(--m-accent)" />
        </button>
      )}
    </div>
  )
}
