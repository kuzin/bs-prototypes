import './TitleCover.css'

/**
 * A partner title's cover. Neither catalog is in the ISBN cover CDNs — Beeverso
 * illustrates in-house — so every cover here is a gradient plate, with a
 * masthead treatment for the licensed magazines, which read as a rack rather
 * than as books with missing art.
 *
 * Sizes: sm | md | lg.
 */
export function TitleCover({ title, size = 'md', className = '' }) {
  const [from, to] = title.cover || ['#9C7BB8', '#5B2079']
  // The masthead lockup only works at `lg`: a name like "Algarabía" can't be set
  // across a 38px thumbnail at any legible size, so smaller covers fall back to
  // the ordinary title treatment.
  const isMag = title.kind === 'magazine' && size === 'lg'

  return (
    <span
      className={`bvcov bvcov--${size} ${isMag ? 'bvcov--mag' : ''} ${className}`.trim()}
      style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      {isMag ? (
        <>
          <span className="bvcov-magname">{title.masthead || title.title}</span>
          {title.issue && <span className="bvcov-issue">{title.issue}</span>}
        </>
      ) : (
        <>
          <span className="bvcov-title">{title.title}</span>
          <span className="bvcov-author">{title.author}</span>
        </>
      )}
    </span>
  )
}

/** The kind of thing a title is — Beeverso names its own in Spanish. */
export const KIND_LABEL = {
  book: 'Libro',
  short: 'Texto corto',
  magazine: 'Revista',
  comic: 'Comic',
}
