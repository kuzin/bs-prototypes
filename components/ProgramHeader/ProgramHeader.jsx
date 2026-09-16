import './ProgramHeader.css'

/**
 * The reader app's page header for a program — `programs/_program_header`.
 *
 * Two tinted bands, the taller one ending in a downward curve; the banner
 * floats over them on a rounded card, pulled up into the bands; and the page
 * ground curves back up behind the title. The bands are the banner's own
 * dominant colour blended with white, which the app reads off the image with
 * ColorThief and we carry as `tint`.
 *
 * A challenge wears it and so does a fundraiser: a read-a-thon is a challenge
 * with money attached, and arriving at one should feel like arriving at the
 * other.
 *
 * `back` is the way out — a `<ReaderBack>`, laid over the band at the page's
 * own left gutter rather than above the header, where it pushed the whole
 * thing down off the top of the screen. It takes the header's own colour, since
 * a grey link on a coloured band reads as something that was left there.
 *
 * `subtitle` names what the program is part of, for the case where it is part
 * of something — a reading path belongs to the destination it travels, and the
 * title is the path.
 *
 * `action` is the one thing a page can do to the program it is looking at, on
 * the band opposite `back`.
 */

/** The app's blend of the banner's dominant colour toward white. */
export function wash(hex, alpha) {
  const h = hex.replace('#', '')
  const mix = (i) => Math.round(parseInt(h.slice(i, i + 2), 16) * alpha + 255 * (1 - alpha))
  return `rgb(${mix(0)}, ${mix(2)}, ${mix(4)})`
}

export function ProgramHeader({
  back,
  action,
  banner,
  title,
  subtitle,
  dates,
  tags,
  tint = '#ACACAC',
}) {
  return (
    // The app names these the other way round — `-bar-light` takes the 40%
    // blend and `-bar-dark` the 20% — so the stronger band is the tall one at
    // the top and the paler one sits behind its curve.
    <div className="prog-header" style={{ '--prog-tint': tint }}>
      {/* The way out sits on the band, at the page's own left gutter — the
          header is full-bleed and the link is not. Whatever the page can do to
          the program itself sits opposite it, on the same row. */}
      {(back || action) && (
        <div className="prog-back">
          {back}
          {action && <span className="prog-action">{action}</span>}
        </div>
      )}
      <div className="prog-bar-strong" style={{ background: wash(tint, 0.4) }} />
      <div className="prog-bar-pale" style={{ background: wash(tint, 0.2) }} />
      <div className="prog-header-info">
        {banner && <img src={banner} alt={title} />}
        <h1 className="prog-title">{title}</h1>
        {/* What this program is part of, where it is part of something — a
            reading path belongs to the destination it travels, and the name of
            that is a rung under the page's own. */}
        {subtitle && <span className="prog-subtitle">{subtitle}</span>}
        {dates && <span className="prog-dates">{dates}</span>}
        {/* What the program asks of you — its requirement types. They read as
            part of the title block rather than the first line of the body: they
            say what this thing is, which is the header's job. */}
        {tags && <div className="prog-tags">{tags}</div>}
      </div>
    </div>
  )
}
