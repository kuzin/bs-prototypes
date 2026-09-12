import '@components/BeanstackLogo/BeanstackLogo.css'

/**
 * The Beanstack logo — the bean mark, alone or beside the wordmark.
 *
 *   <BeanstackLogo />                    // mark + "beanstack"
 *   <BeanstackLogo variant="mark" />     // the bean alone
 *   <BeanstackLogo size={40} variant="mark" />
 *   <BeanstackLogo invert />             // on dark chrome
 *   <BeanstackLogo word="RMI" upper />   // a sub-brand on the same mark
 *
 * The app bar, the footers and the RMI footer each drew this themselves and
 * had drifted apart on weight, tracking and gap. The admin rail is the one
 * deliberate exception: the shipped app puts the `bs-heart` symbol there, not
 * the bean, and that rail is a 1:1 port.
 *
 * sizes: sm | md | lg, or a number (the mark's px height; the wordmark scales
 * with it).
 */
export function BeanstackLogo({
  variant = 'lockup',
  size = 'md',
  word = 'beanstack',
  upper = false,
  invert = false,
  className = '',
}) {
  const custom = typeof size === 'number'
  const cls = [
    'bsl',
    !custom && `bsl--${size}`,
    upper && 'bsl--upper',
    invert && 'bsl--invert',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // A numeric size drives both halves off one number, so a custom lockup can't
  // drift the way the three hand-rolled copies did.
  const style = custom ? { gap: Math.round(size * 0.28), '--bsl-mark': `${size}px` } : undefined
  const markStyle = custom ? { width: size, height: size } : undefined
  const wordStyle = custom ? { fontSize: Math.round(size * 0.82) } : undefined

  return (
    <span className={cls} style={style} aria-label={word}>
      <span className="bsl-mark" style={markStyle} aria-hidden="true">
        <BeanstackMark />
      </span>
      {variant !== 'mark' && (
        <span className="bsl-word" style={wordStyle}>
          {word}
        </span>
      )}
    </span>
  )
}

/**
 * The bean itself — `public/bs.svg` inlined, so the fills can be themed and a
 * lockup is one DOM node instead of a node plus a network request.
 */
function BeanstackMark() {
  return (
    <svg viewBox="0 0 102 102" role="presentation" focusable="false">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M98.2227 58.6785C85.7427 105.439 72.7927 103.839 46.5427 100.579C20.2927 97.3185 -1.92733 94.5685 0.132672 46.5085C2.19267 -1.54147 32.8227 -2.10147 58.8827 1.13853C84.9427 4.36853 110.703 11.9185 98.2227 58.6885V58.6785Z"
        className="bsl-bean"
      />
      <path
        d="M30.1529 40.1789C24.5529 48.7989 29.4329 61.2189 60.0529 82.2189C60.8129 82.7389 61.9029 82.5488 61.1929 81.2388L60.9829 80.8589C58.9929 77.0289 56.6829 69.7589 62.2229 60.6189L62.6629 59.8889C69.7029 48.0289 76.4429 30.2489 65.8529 22.1589C54.9629 13.8389 42.3029 24.6888 41.9929 37.4088L41.7729 37.2788C40.5429 36.5888 34.4129 33.6189 30.1529 40.1789Z"
        className="bsl-sprout"
      />
    </svg>
  )
}
