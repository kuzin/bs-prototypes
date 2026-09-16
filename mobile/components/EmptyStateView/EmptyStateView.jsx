import { Img } from '../Img/Img'
import './EmptyStateView.css'

/**
 * `components/EmptyStateView.jsx` — the OLDER of the app's two empty states, and the one nearly
 * every list actually uses: All Titles (twice), Book Talks (twice), Badges, Reviews, Book Lists,
 * Events, Discover.
 *
 * It is not the same component as `EmptyState`, which is newer, takes a button and lives under
 * `components/home/`. Both ship; they are not interchangeable, and which one a screen uses is a
 * fact about that screen rather than a choice. The tell is the button: a list that cannot be
 * filled from where you are standing gets this one, with no call to action.
 *
 * Three stacked strings, all optional after the first, all `blackFont` — which is `#424242`, not
 * black. The line heights are set per string (26 / 24 / default) rather than inherited, so the
 * three do not read as one paragraph.
 */
export function EmptyStateView({ source, boldText, middleText, finalText, className = '' }) {
  return (
    <div className={`m-esv ${className}`}>
      <Img name={source} size={135} className="m-esv-art" />
      <p className="m-t-primary-title m-esv-bold">{boldText}</p>
      {middleText ? <p className="m-t-paragraph-small m-esv-middle">{middleText}</p> : null}
      {finalText ? <p className="m-t-paragraph-medium m-esv-final">{finalText}</p> : null}
    </div>
  )
}
