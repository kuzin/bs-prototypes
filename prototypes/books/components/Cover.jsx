import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'

// Darken/lighten a hex by amount (-1..1) for a designed gradient fallback.
function shade(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16)
  const ch = (sh) => {
    const c = (n >> sh) & 0xff
    const v = amt < 0 ? c * (1 + amt) : c + (255 - c) * amt
    return Math.max(0, Math.min(255, Math.round(v)))
  }
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`
}

const FALLBACK_ICON = { xs: 16, sm: 20, md: 26, lg: 34 }

// A book cover: the real Open Library image when it loads, otherwise a designed
// color-gradient placeholder. Magazines get a masthead-style fallback (title +
// issue) so they read like a magazine rack rather than a missing book.
export function Cover({ book, size = 'md', square = false, className = '' }) {
  const [err, setErr] = useState(false)
  const { cover, title, color = '#0DA7BC', formats = [], issue } = book
  const showImg = cover && !err
  const isMag = formats.includes('magazine') && !formats.includes('print')

  return (
    <div
      className={`bk-cover bk-cover--${size} ${square ? 'bk-cover--square' : ''} ${showImg ? '' : 'bk-cover--ph'} ${isMag && !showImg ? 'bk-cover--mag' : ''} ${className}`.trim()}
      style={
        showImg
          ? undefined
          : { background: `linear-gradient(145deg, ${shade(color, 0.32)}, ${shade(color, -0.18)})` }
      }
    >
      {showImg ? (
        <img src={cover} alt={`Cover of ${title}`} loading="lazy" onError={() => setErr(true)} />
      ) : isMag ? (
        <div className="bk-cover-mag-inner">
          <span className="bk-cover-mag-kicker">
            <Icon name="news" size={12} /> Magazine
          </span>
          <span className="bk-cover-mag-name">{title}</span>
          {issue && <span className="bk-cover-mag-issue">{issue}</span>}
        </div>
      ) : (
        <div className="bk-cover-ph-inner">
          <Icon name="book-2" size={FALLBACK_ICON[size]} />
          <span className="bk-cover-ph-title">{title}</span>
        </div>
      )}
    </div>
  )
}
