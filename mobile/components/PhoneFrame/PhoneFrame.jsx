import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { accentVars, DEFAULT_ACCENT } from '../../accent'
import { Keyboard, KEYBOARD_HEIGHT } from '../Keyboard/Keyboard'
// The foundation: the `.m-app` scope, the generated tokens, and the layout discipline. Imported
// here because every mobile screen enters the system through a frame.
import '../../base.css'
import './PhoneFrame.css'

/**
 * The device shell every mobile prototype renders inside.
 *
 * This is the piece that makes a design read as an app rather than as a narrow website, and it is
 * worth being exact about: the header height, the tab-bar height and the safe-area insets are all
 * load-bearing numbers that screens in the real app do arithmetic against.
 *
 * Sizes are logical points, which is the unit React Native styles are written in — so a value here
 * is the same number a mobile engineer would type.
 */
/**
 * `radius` and `bezel` describe the DEVICE, not the app, but they are not decoration: a phone's
 * display corner radius decides how much of the chrome the corner eats. The notch phones carry a
 * 59pt top inset and a 34pt bottom one, which keeps the status bar and tab labels clear of a 41pt
 * rounding. The SE has 20/0 and a SQUARE display — round its screen and the corner clips the time
 * and the tab labels, which is exactly what happened here. Its thicker top/bottom bezel is where
 * the earpiece and the home button live.
 */
/**
 * `forModalPresentationIOS` — React Navigation's own interpolator, which is what a
 * `presentation: 'modal'` screen on `@react-navigation/stack` actually runs:
 *
 *   topOffset   10 in portrait, 0 in landscape
 *   scale       1 - (topOffset * 2) / screenWidth        → 0.949 on a 393pt screen
 *   translateY  statusBarHeight - topOffset * (h / w)    → 37.32pt
 *   radius      10
 *   sheet       marginTop statusBarHeight, then translateY topOffset
 *
 * TAKE THE SCALE, NOT THE TRANSLATE — the two live in different coordinate spaces.
 *
 * RN's card is the WHOLE screen, y 0 to 852, and RN scales from the CENTRE. So the scale alone
 * drops its top by half the height it loses, (852 - 852×0.949)/2 = 21.68, and the 37.32 translate
 * carries it the rest of the way: 21.68 + 37.32 = 59.00, exactly the status bar's height. The
 * translate exists to undo a centre-origin scale and land the card under the status bar.
 *
 * Our stage already BEGINS at the status bar's bottom and scales from `top center`, so its top
 * does not move at all — it is already where RN's two operations arrive. Applying the translate
 * on top of that pushed the card to 96, below the sheet, and hid the thing the whole presentation
 * exists to show.
 *
 * What is left is the sliver: RN's sheet sits at statusBarHeight + topOffset = 69, against a card
 * top of 59, so 10pt of card shows above it. That 10 is `MODAL_TOP_OFFSET` again.
 */
const MODAL_TOP_OFFSET = 10

/** The presentation duration, in step with `--m-motion-present` in base.css. */
const PRESENT_MS = 320

export const DEVICES = {
  'iphone-16-pro': {
    name: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    top: 59,
    bottom: 34,
    radius: 41,
    bezel: { x: 3, y: 3 },
    island: { w: 125, h: 36, top: 11 },
  },
  'iphone-14-pro': {
    name: 'iPhone 14 Pro',
    width: 390,
    height: 844,
    top: 59,
    bottom: 34,
    radius: 41,
    bezel: { x: 3, y: 3 },
    island: { w: 125, h: 36, top: 11 },
  },
  'iphone-se': {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    top: 20,
    bottom: 0,
    radius: 0,
    bezel: { x: 6, y: 56 },
    // No island — the SE puts its hardware in the bezel instead.
    hardware: 'home-button',
  },
}

function StatusBar({ background, time, inverted, legacy = false }) {
  // The app hardcodes barStyle='dark-content' (AppStatusBar.tsx) and has no dark mode at all, so
  // the glyphs are normally dark; only the background varies, pushed from screens' focus
  // listeners. A modal sheet is the exception: iOS puts it over a black ground, and the status
  // bar inverts to stay legible.
  //
  // `legacy` is the PRE-NOTCH layout, and it is not a minor variation: on a home-button iPhone the
  // time is CENTRED with the signal bars on the left and wifi/battery on the right. The notch
  // phones moved the time to the left so it could sit beside the island. Showing the modern layout
  // on an SE is the single most obvious tell that a mock was not drawn for that device.
  const signal = (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  )
  const wifi = (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0L8 11.5Z" />
      <path
        d="M3.2 6.4a6.8 6.8 0 0 1 9.6 0"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M.9 3.9a10.2 10.2 0 0 1 14.2 0"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
  const battery = (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
      <rect x="2" y="2" width="17" height="8" rx="1.6" fill="currentColor" />
      <path d="M24 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
    </svg>
  )

  if (legacy) {
    return (
      <div
        className={`m-statusbar is-legacy${inverted ? ' is-inverted' : ''}`}
        style={{ background: inverted ? 'transparent' : background }}
        aria-hidden="true"
      >
        <span className="m-statusbar-glyphs">{signal}</span>
        <span className="m-statusbar-time">{time}</span>
        <span className="m-statusbar-glyphs">
          {wifi}
          {battery}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`m-statusbar${inverted ? ' is-inverted' : ''}`}
      style={{ background: inverted ? 'transparent' : background }}
      aria-hidden="true"
    >
      <span className="m-statusbar-time">{time}</span>
      <span className="m-statusbar-glyphs">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0L8 11.5Z" />
          <path
            d="M3.2 6.4a6.8 6.8 0 0 1 9.6 0"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M.9 3.9a10.2 10.2 0 0 1 14.2 0"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="1.6" fill="currentColor" />
          <path d="M24 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
        </svg>
      </span>
    </div>
  )
}

/**
 * @param {string}  device        key of DEVICES
 * @param {string}  accent        tenant primaryColor; states are derived from it
 * @param {string}  statusBar     status-bar background (the app drives this from redux)
 * @param {string}  background    the screen ground behind the scrolling content
 * @param {node}    header        fixed above the scroll region
 * @param {node}    tabBar        fixed below it
 * @param {node}    actionSheet   a root-mounted `ActionsModal`, above everything else
 * @param {node}    overlay       a `presentation: 'modal'` screen — it covers the tab bar and the
 *                                FAB, because a modal is pushed over the whole navigator
 * @param {boolean} scroll        false pins content to the viewport (for full-bleed screens)
 * @param {boolean} keyboard      false opts out of the software keyboard, which otherwise opens
 *                                whenever a field inside the frame takes focus
 */
export function PhoneFrame({
  device = 'iphone-16-pro',
  accent = DEFAULT_ACCENT,
  statusBar = '#ffffff',
  background,
  time = '9:41',
  header,
  tabBar,
  floatingBar = false,
  /**
   * How the overlay presents. `sheet` is `presentation: 'modal'` — the iOS card that drops from the
   * top, scales the screen behind it and inverts the status bar. `card` is an ordinary PUSHED
   * screen: it covers the whole navigator with no scale-back, no black ground and no peeking edge,
   * because nothing is being presented OVER anything. Using the sheet chrome for a pushed screen is
   * the easy mistake — it looks deliberate and is simply the wrong navigation model.
   */
  overlayVariant = 'sheet',
  overlay,
  /** A root-mounted `ActionsModal`, above the overlay and the tab bar both. */
  actionSheet,
  scroll = true,
  keyboard = true,
  className = '',
  children,
}) {
  const d = DEVICES[device] ?? DEVICES['iphone-16-pro']

  // The keyboard opens when a field takes focus and then STAYS UP until it is explicitly
  // dismissed — it does not close on blur. That distinction is the whole behaviour: on device,
  // tapping a Send button next to the field does not put the keyboard away, so closing on blur
  // made the keyboard disappear at exactly the moment you were trying to use it.
  //
  // Keeping it open also keeps every screen honest about the room it actually has: a layout that
  // only works with the keyboard down is a layout that does not work.
  const [kbOpen, setKbOpen] = useState(false)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!keyboard) return
    const el = frameRef.current
    if (!el) return
    const isField = (t) => t?.matches?.('input:not([type=checkbox]):not([type=button]), textarea')
    const onFocus = (e) => isField(e.target) && setKbOpen(true)
    el.addEventListener('focusin', onFocus)
    return () => el.removeEventListener('focusin', onFocus)
  }, [keyboard])

  // Leaving the screen takes the keyboard with it, the way navigating away does on device.
  //
  // Depend on whether an overlay EXISTS, not on the element: `overlay` is JSX rebuilt on every
  // render, so an effect keyed on it runs every render — which closed the keyboard on the same
  // tick that focus opened it, and it never appeared at all.
  const hasOverlay = Boolean(overlay)
  useEffect(() => {
    setKbOpen(false)
  }, [hasOverlay])

  /**
   * THE CLOSE IS THE OPEN IN REVERSE, and it was not.
   *
   * `ModalPresentationIOS` uses the same `TransitionIOSSpec` for `open` and `close`, and runs
   * `forModalPresentationIOS` backwards — so the sheet slides back down over the full duration
   * while the card scales and lifts back. Here the card did animate back, because its transform
   * is a transition on an element that stays mounted, but the SHEET was simply removed from the
   * DOM the instant state changed. Half the movement played and half of it cut, which is why
   * closing felt wrong in a way opening did not.
   *
   * So the last overlay is held for the length of the exit and rendered with `is-closing`, which
   * runs the slide-out. The `has-sheet` class comes off immediately, because the card should
   * start its journey back at the same moment the sheet starts its own.
   */
  const lastOverlay = useRef(null)
  if (overlay) lastOverlay.current = overlay
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (hasOverlay) {
      setClosing(false)
      return undefined
    }
    if (!lastOverlay.current) return undefined
    setClosing(true)
    // Matches `--m-motion-present`; a transitionend would need an element that survives the
    // unmount, which is the thing being solved here.
    const timer = setTimeout(() => {
      setClosing(false)
      lastOverlay.current = null
    }, PRESENT_MS)
    return () => clearTimeout(timer)
  }, [hasOverlay])

  const dismissKeyboard = useCallback(() => {
    document.activeElement?.blur?.()
    setKbOpen(false)
  }, [])
  const style = useMemo(
    () => ({
      ...accentVars(accent),
      '--m-safe-top': `${d.top}px`,
      '--m-safe-bottom': `${d.bottom}px`,
      // Dimensions.get('window').width is read at module scope in 79 files, and several styles
      // are a fraction of it (a chat bubble caps at width * 0.75). Exposing it means those can
      // resolve against the SCREEN rather than whatever padded box they happen to sit in.
      '--m-screen-w': `${d.width}px`,
      '--m-screen-h': `${d.height}px`,
      '--m-screen-radius': `${d.radius ?? 41}px`,
      // `forModalPresentationIOS`'s scale — the translate is absorbed by our origin, see above.
      '--m-present-scale': 1 - (MODAL_TOP_OFFSET * 2) / d.width,
      // The card's visible sliver above the sheet: RN's `topOffset`.
      '--m-present-peek': `${MODAL_TOP_OFFSET}px`,
      '--m-bezel-x': `${d.bezel?.x ?? 3}px`,
      '--m-bezel-y': `${d.bezel?.y ?? 3}px`,
      '--m-island-w': `${d.island?.w ?? 0}px`,
      '--m-island-h': `${d.island?.h ?? 0}px`,
      '--m-island-top': `${d.island?.top ?? 0}px`,
      width: `${d.width}px`,
      height: `${d.height}px`,
      ...(background ? { '--m-screen-bg': background } : null),
    }),
    [accent, d, background],
  )

  return (
    <div
      className={`m-app m-frame${floatingBar ? ' has-floating-bar' : ''} ${className}`}
      style={style}
      data-inset-bottom={d.bottom}
      ref={frameRef}
    >
      {/* The SE's hardware sits in the bezel: an earpiece slit above the display and a home
          button below it. The notch phones have neither — their camera is the island, which is
          cut out of the DISPLAY rather than the bezel. */}
      {d.hardware === 'home-button' && (
        <>
          <span className="m-frame-earpiece" aria-hidden="true" />
          <span className="m-frame-camera" aria-hidden="true" />
          <span className="m-frame-home" aria-hidden="true" />
        </>
      )}

      <div
        className={`m-frame-screen${overlay ? ' has-sheet' : ''}${kbOpen ? ' has-keyboard' : ''}`}
      >
        {/* The Dynamic Island. It is part of the display, painted over whatever the screen shows,
            and it is why the status bar's time and glyphs sit either side of centre rather than
            spanning the width. */}
        {d.island && <span className="m-frame-island" aria-hidden="true" />}

        <StatusBar
          background={statusBar}
          time={time}
          inverted={!!overlay && overlayVariant === 'sheet'}
          legacy={!d.island}
        />

        {/* The presenting screen. iOS `presentation: 'modal'` scales it back behind the sheet and
            rounds its corners, leaving a sliver visible at the top — that sliver is the whole
            reason the modal reads as a card you can dismiss rather than a new screen. */}
        <div className="m-frame-stage">
          {header}
          <div className={`m-frame-body${scroll ? ' is-scroll' : ''}`}>{children}</div>
          {tabBar}
        </div>

        {/* The sheet: inset from the top, rounded, above the tab bar AND the PlusMenu. Held one
            transition longer than the state that opened it, so it can leave the way it arrived. */}
        {(overlay || closing) && (
          <div
            className={`${overlayVariant === 'card' ? 'm-frame-card' : 'm-frame-sheet'}${
              closing ? ' is-closing' : ''
            }`}
            aria-hidden={closing || undefined}
          >
            {overlay ?? lastOverlay.current}
          </div>
        )}

        {/* Action sheets mount ABOVE the presented sheet, which is how a book sheet's “…” opens a
            menu over itself. The app does the same thing structurally: `src/modals/index.jsx`
            mounts every options modal at the navigator root, not inside the screen that opens it. */}
        {actionSheet}

        {kbOpen && <Keyboard onDismiss={dismissKeyboard} />}

        {d.bottom > 0 && !kbOpen && <div className="m-home-indicator" aria-hidden="true" />}
      </div>
    </div>
  )
}
