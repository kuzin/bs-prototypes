import './RcaLevelGlyph.css'

/**
 * The engagement-level shape — circle / diamond / pentagon / hexagon — on its
 * own tinted tile.
 *
 *   <RcaLevelGlyph level="igniter" />
 *
 * The four shapes and their colours are the shipped app's, lifted verbatim
 * from `district_schools_table/Trailblazer-rct.svg` (the level-progress pill
 * on the district Schools table), each re-centred on a 24×24 box. They used
 * to be approximate `clip-path` polygons here, which got the silhouettes
 * close and the corner radii wrong.
 */
const LEVEL_GLYPHS = {
  spark: {
    fill: '#FFCE65',
    dx: -5.0,
    dy: -1.0,
    d: 'M17 7C20.4286 7 23 9.51788 23 13C23 16.4821 20.4286 19 17 19C13.5714 19 11 16.4821 11 13C11 9.51788 13.5714 7 17 7Z',
  },
  igniter: {
    fill: '#38D58B',
    dx: -31.333,
    dy: -1.0,
    d: 'M41.9191 7.41421C42.7002 6.63316 43.9665 6.63317 44.7475 7.41421L48.9191 11.5858C49.7002 12.3668 49.7002 13.6332 48.9191 14.4142L44.7475 18.5858C43.9665 19.3668 42.7002 19.3668 41.9191 18.5858L37.7475 14.4142C36.9665 13.6332 36.9665 12.3668 37.7475 11.5858L41.9191 7.41421Z',
  },
  pathfinder: {
    fill: '#4591EF',
    dx: -58.667,
    dy: -0.504,
    d: 'M69.4911 6.8541C70.1921 6.34481 71.1413 6.34481 71.8422 6.8541L76.1485 9.98278C76.8495 10.4921 77.1428 11.3948 76.875 12.2188L75.2302 17.2812C74.9624 18.1052 74.1945 18.6631 73.3281 18.6631H68.0053C67.1388 18.6631 66.3709 18.1052 66.1031 17.2812L64.4583 12.2188C64.1905 11.3948 64.4839 10.4921 65.1848 9.98278L69.4911 6.8541Z',
  },
  trailblazer: {
    fill: '#E06DFA',
    dx: -86.0,
    dy: -1.0,
    d: 'M97 6.57735C97.6188 6.22008 98.3812 6.22008 99 6.57735L103.062 8.92265C103.681 9.27992 104.062 9.94017 104.062 10.6547V15.3453C104.062 16.0598 103.681 16.7201 103.062 17.0774L99 19.4227C98.3812 19.7799 97.6188 19.7799 97 19.4226L92.9378 17.0773C92.319 16.7201 91.9378 16.0598 91.9378 15.3453V10.6547C91.9378 9.94017 92.319 9.27992 92.9378 8.92265L97 6.57735Z',
  },
}

export function RcaLevelGlyph({ level, size = 34, className = '' }) {
  const g = LEVEL_GLYPHS[level]
  if (!g) return null
  return (
    <span
      className={`rca-glyph ${className}`.trim()}
      style={{ width: size, height: size, '--rca-glyph-fill': g.fill }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" focusable="false">
        <g transform={`translate(${g.dx} ${g.dy})`}>
          <path d={g.d} fill={g.fill} />
        </g>
      </svg>
    </span>
  )
}
