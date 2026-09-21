import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * What React Native's `<Modal>` does for free, and what every sheet in this system needs.
 *
 * In the app an options modal can be rendered from anywhere — inside a list, inside a tab,
 * inside a card — and it still appears over the whole navigator, because RN's `Modal` is a
 * portal to the root window. Its position in the component tree says nothing about where it
 * paints. Our screens copy that structure faithfully and then get a different result: a `div`
 * with `z-index: 400` is only above things in the same stacking context, so a sheet rendered
 * inside a scrolling tab is bounded by that tab.
 *
 * That bit us the moment `.m-frame-body` became a stacking context (so scrolled content could
 * not paint over the tab bar): the challenge list's own View Options sheet went under the tab
 * bar, having previously escaped only because nothing was containing it. Both behaviours were
 * accidents of the same missing piece.
 *
 * So: portal to the `.m-frame-screen` this component is rendered inside. The nearest one, found
 * from a mounted anchor rather than `document.querySelector`, because the Pattern Library puts
 * several frames on one page and a sheet must land in its own.
 *
 * Renders only the anchor on the first pass — it has to exist before its ancestor can be found.
 * A sheet is opened by an interaction, never on first paint, so nothing is visibly delayed.
 *
 * NO FRAME, NO PORTAL. Outside a `.m-frame-screen` the children render exactly where they were
 * written. That is not a safety net, it is the Pattern Library's case: a showcase puts a sheet
 * in a plain bordered box to show its anatomy, and there is no device around it. Portalling
 * unconditionally made all four overlay showcases render nothing at all.
 */
export function FramePortal({ children }) {
  const anchor = useRef(null)
  // `undefined` = not looked yet, an element = portal there, `null` = no frame, render in place.
  const [host, setHost] = useState(undefined)

  useLayoutEffect(() => {
    setHost(anchor.current?.closest('.m-frame-screen') ?? null)
  }, [])

  if (host === undefined) return <span ref={anchor} hidden />
  return host ? createPortal(children, host) : children
}
