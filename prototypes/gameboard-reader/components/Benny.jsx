import shadow from '../assets/benny/shadow.svg'
import armLeft from '../assets/benny/arm-left.svg'
import hand1 from '../assets/benny/hand-1.svg'
import hand2 from '../assets/benny/hand-2.svg'
import hand3 from '../assets/benny/hand-3.svg'
import hand4 from '../assets/benny/hand-4.svg'
import legLeft from '../assets/benny/leg-left.svg'
import legRight from '../assets/benny/leg-right.svg'
import body from '../assets/benny/body.svg'
import shine from '../assets/benny/shine.svg'
import armBean from '../assets/benny/arm-bean.svg'
import armRight from '../assets/benny/arm-right.svg'
import face from '../assets/benny/face.svg'

// Benny mid-cheer, exactly as the Figma "You did it!" frame composes him: one
// layer per body part, stacked in the design's own order. Coordinates are the
// Figma offsets inside a 116 × 170 box, expressed as percentages so the whole
// character scales from a single width.
const W = 116
const H = 170

// [asset, left, top, width, height] — Figma's ml / mt / w / h, in order.
const LAYERS = [
  [shadow, 10.92, 152.7, 86.918, 16.872],
  [hand1, 9.99, 31.44, 23.227, 30.76],
  [hand2, 1.06, 28.03, 13.134, 6.774],
  [hand3, 5.08, 25.61, 9.118, 9.19],
  [hand4, 0, 32.49, 12.597, 4.16],
  [armLeft, 0, 25.61, 33.216, 36.595],
  [legLeft, 20.07, 108.55, 25.918, 40.526],
  [legRight, 59.75, 113.98, 19.454, 42.415],
  [body, 17.42, 0, 73.925, 124.391],
  [shine, 29.57, 4.65, 18.527, 12.387],
  [armBean, 26.82, 50.09, 8.728, 21.273],
  [armRight, 81.68, 26.14, 34.316, 37.691],
  [face, 28.06, 12.35, 43.437, 37.659],
]

export function BennyCheer({ width = 116 }) {
  return (
    <span
      className="gr-benny-fig"
      style={{ width, aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="Benny cheering"
    >
      {LAYERS.map(([src, x, y, w, h], i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            left: `${(x / W) * 100}%`,
            top: `${(y / H) * 100}%`,
            width: `${(w / W) * 100}%`,
            height: `${(h / H) * 100}%`,
          }}
        />
      ))}
    </span>
  )
}
