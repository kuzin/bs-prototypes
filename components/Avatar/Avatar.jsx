import { useEffect, useState } from 'react'
import '@components/Avatar/Avatar.css'

/**
 * <Avatar initials="MC" color="#F26430" size="md" />
 * <Avatar initials="LE" color="#196DD5" size="lg" shape="square" />
 *
 * `src` renders a real picture instead — a reader who has uploaded one. The
 * initials stay the fallback: they show while there's no `src`, and again if
 * the image fails to load, so a dead URL leaves the tile looking like every
 * other avatar rather than a broken image.
 *
 *   <Avatar src="/bs-prototypes/avatars/emma.jpg" initials="EM" />
 *
 * sizes: xs | sm | md | lg | xl
 * shape: circle (default) | square
 */
export function Avatar({
  initials,
  src,
  color = '#ACACAC',
  size = 'md',
  shape = 'circle',
  className = '',
}) {
  const [broken, setBroken] = useState(false)

  // A new src deserves a fresh attempt — otherwise one failure sticks to the
  // slot for every reader rendered into it afterwards.
  useEffect(() => setBroken(false), [src])

  const showImage = src && !broken

  return (
    <span
      className={`avatar avatar--${size} avatar--${shape}${showImage ? ' avatar--photo' : ''} ${className}`.trim()}
      style={{ background: color }}
      aria-hidden="true"
    >
      {showImage ? (
        <img src={src} alt="" className="avatar-img" onError={() => setBroken(true)} />
      ) : (
        <span className="avatar-text">{initials}</span>
      )}
    </span>
  )
}
