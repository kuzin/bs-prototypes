import '@components/Confetti/Confetti.css'

// Celebration palette — Beanstack teal/turquoise first, with warm accents.
const COLORS = ['#0DA7BC', '#14B8A6', '#F0A024', '#0F766E', '#EA580C', '#2563EB', '#16A34A']

// Deterministic pseudo-random in [0,1) — no RNG, so a re-render never reshuffles
// a burst mid-fall and the same piece count always looks the same.
const rand = (i, salt) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * A one-shot burst of falling confetti, filling its nearest positioned ancestor.
 * Purely decorative (aria-hidden), and it stops on its own.
 *
 * <div style={{ position: 'relative' }}>
 *   <Confetti />
 * </div>
 *
 * - count:    how many pieces (default 14)
 * - colors:   override the palette
 * - duration: seconds for a piece to fall (default 1.6)
 * - distance: how far a piece falls, in px (default 420)
 *
 * Respects prefers-reduced-motion: the pieces simply don't animate.
 */
export function Confetti({ count = 14, colors = COLORS, duration = 1.6, distance = 420 }) {
  return (
    <div className="cft" aria-hidden="true" style={{ '--cft-distance': `${distance}px` }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="cft-bit"
          style={{
            left: `${(rand(i, 1) * 96 + 2).toFixed(2)}%`,
            background: colors[i % colors.length],
            animationDelay: `${(rand(i, 2) * 0.7).toFixed(2)}s`,
            animationDuration: `${(duration + rand(i, 3) * 0.5).toFixed(2)}s`,
            rotate: `${Math.round(rand(i, 4) * 90 - 45)}deg`,
          }}
        />
      ))}
    </div>
  )
}
