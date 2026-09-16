import { Img } from '../Img/Img'
import './PlusMenu.css'

/**
 * The FAB and its radial menu — `src/components/plusMenu/PlusMenu.tsx` plus the `circularMenu/`
 * pair that does the fanning.
 *
 * The geometry is genuinely computed in the app rather than laid out, so it is reproduced here
 * rather than approximated: every constant below is from `ActionButton.tsx`,
 * `PlusMenuUtils.ts` and `ActionButtonItem.tsx`.
 */
const SIZE = 56
const RADIUS = 100
const START_DEGREE = 180
const END_DEGREE = 360
const START_RADIAN_DIVISOR = 150
const END_RADIAN_DIVISOR = 200
const START_RADIAN = (START_DEGREE * Math.PI) / START_RADIAN_DIVISOR
const END_RADIAN = (END_DEGREE * Math.PI) / END_RADIAN_DIVISOR
const MAX_ROW_ITEMS = 3
// The app's own constant is 20, which puts the FAB's centre ~24pt above the line the other tab
// icons sit on. Lowered to 10 on a design call — it reads as part of the bar rather than floating
// off it. This is the one geometry value here that deliberately departs from the source.
const FAB_LIFT = 10

// PlusMenuUtils
const X_OFFSET_LEFT = -50
const X_OFFSET_RIGHT = 50
const X_OFFSET_TWO_LEFT = 20
const X_OFFSET_TWO_RIGHT = -20
const X_OFFSET_SINGLE = 81
const LAST_ITEM_ID = 3
// The divisor and the last item's Y both fork on DeviceManager.isIphoneXorAbove(); every device
// we model has a notch, so these are the big-screen branch.
const SCREEN_DIVISOR = 8
const Y_OFFSET_LAST = -140

// ActionButtonItem
const FAB_TOP_SHIFT = -80
const FAB_SIDE_SHIFT = 20

const getFanOffset = (count) => {
  if (count === 1) return 0
  const divisor = count > MAX_ROW_ITEMS ? MAX_ROW_ITEMS - 1 : count - 1
  return (END_RADIAN - START_RADIAN) / divisor
}

const getDiffOffsetX = (count, id) => {
  if (count === 3) return id === 0 ? X_OFFSET_LEFT : id === 1 ? 0 : X_OFFSET_RIGHT
  if (count === 4) {
    if (id === 0) return X_OFFSET_LEFT
    return id === 1 || id === LAST_ITEM_ID ? 0 : X_OFFSET_RIGHT
  }
  if (count === 1) return X_OFFSET_SINGLE
  return id === 0 ? X_OFFSET_TWO_LEFT : X_OFFSET_TWO_RIGHT
}

function calculateOffsetPosition({ id, offset, count, screenHeight }) {
  const angle = START_RADIAN + id * offset
  const offsetX = id === LAST_ITEM_ID ? 0 : RADIUS * Math.cos(angle) + getDiffOffsetX(count, id)
  const offsetY =
    id === LAST_ITEM_ID ? Y_OFFSET_LAST : RADIUS * Math.sin(angle) - screenHeight / SCREEN_DIVISOR
  return { offsetX, offsetY }
}

/** The extra nudge that evens out a four-item fan and its centre items. */
const getVerticalShift = (count, index, offsetY) =>
  (count === 4 && index !== LAST_ITEM_ID ? FAB_TOP_SHIFT : 0) +
  offsetY +
  ((count !== 2 && index === 0) || index === 2 ? FAB_SIDE_SHIFT : 0)

/**
 * @param {Array}   actions      `{ id, title, icon }` — in the app these are gated by
 *                               `has_activities`, `reviewsEnabled` and `epicIntegration`.
 * @param {number}  screenHeight the device height the fan is computed against; the app reads
 *                               `Dimensions.get('window').height` once at module scope.
 */
/**
 * `hideTrigger` suppresses the FAB while keeping the fan and the backdrop — for the proposed tab
 * bar, which carries its own plus inside the bar. The menu's behaviour is unchanged; only who owns
 * the button moves.
 */
export function PlusMenu({
  open,
  onToggle,
  onSelect,
  actions,
  screenHeight = 852,
  hideTrigger = false,
}) {
  const count = actions.length
  const offset = getFanOffset(count)

  return (
    <div className={`m-plus${open ? ' is-open' : ''}`}>
      <div className="m-plus-backdrop" onClick={() => onToggle?.(false)} aria-hidden={!open} />

      <div className="m-plus-fan">
        {actions.map((action, index) => {
          const { offsetX, offsetY } = calculateOffsetPosition({
            id: index,
            offset,
            count,
            screenHeight,
          })
          const y = getVerticalShift(count, index, offsetY)
          return (
            <button
              key={action.id}
              type="button"
              className="m-plus-item"
              style={{
                // The closed state collapses to the FAB: translate 0, scale 0.
                transform: open
                  ? `translate(${offsetX}px, ${y}px) scale(1)`
                  : 'translate(0, 0) scale(0)',
              }}
              onClick={() => {
                onSelect?.(action.id)
                onToggle?.(false)
              }}
              tabIndex={open ? 0 : -1}
              aria-label={action.accessibilityLabel ?? action.title}
            >
              <span className="m-plus-item-icon">{action.icon}</span>
              <span className="m-plus-item-label">{action.title}</span>
            </button>
          )
        })}
      </div>

      {!hideTrigger && (
        <button
          type="button"
          className="m-plus-fab"
          onClick={() => onToggle?.(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close logging menu' : 'Open logging menu'}
          style={{
            width: SIZE,
            height: SIZE,
            bottom: `calc(var(--m-safe-bottom) + ${FAB_LIFT}px)`,
          }}
        >
          {/* images.plus_icon, tinted white -> red across the open transition (the app animates
            tintColor between colors.white and colors.red). A mask is the only way to tint a
            raster asset in CSS, so the glyph rides on currentColor. */}
          <Img name="plus_icon" size={20} tint="currentColor" />
        </button>
      )}
    </div>
  )
}
