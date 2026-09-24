// Injected into every page of a recording (addInitScript). A headless browser
// draws no pointer, so this draws one — an arrow that glides to each target and
// a ripple on every click — and hides the prototype-only chrome (the switcher
// at the bottom, the preview bar at the top) so the video shows the product.
// The cursor's position rides in sessionStorage so it doesn't jump back to the
// middle of the screen on every navigation.
;(() => {
  const POS_KEY = '__demo-pos'
  let pos = [720, 420]
  try {
    const saved = JSON.parse(sessionStorage.getItem(POS_KEY))
    if (Array.isArray(saved)) pos = saved
  } catch {
    // no storage — start in the middle
  }
  const css = `
    .proto-nav, .pvb { display: none !important; }
    :root, body { --chrome-bottom: 0px !important; }
    #__demo-cursor { position: fixed; left: 0; top: 0; z-index: 2147483647; pointer-events: none;
      width: 30px; height: 30px; will-change: transform; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
    #__demo-ripple { position: fixed; left: 0; top: 0; z-index: 2147483646; pointer-events: none;
      width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%;
      background: rgba(50,110,206,.28); border: 2px solid rgba(50,110,206,.7); opacity: 0; }
    #__demo-ripple.on { animation: __demo-ripple .5s ease-out; }
    @keyframes __demo-ripple { from { opacity: 1; transform: scale(.3); } to { opacity: 0; transform: scale(1.4); } }
  `
  // The arrow's tip sits at (5, 3) in its 30px box.
  const place = (el, x, y, ms) => {
    el.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,.05,.25,1)` : 'none'
    el.style.transform = `translate(${x - 5}px, ${y - 3}px)`
  }
  const install = () => {
    if (document.getElementById('__demo-cursor')) return
    const style = document.createElement('style')
    style.textContent = css
    document.documentElement.appendChild(style)
    const cursor = document.createElement('div')
    cursor.id = '__demo-cursor'
    cursor.innerHTML =
      '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 3l14 9.6-6.4 1.2 3.9 7.1-2.8 1.5-3.9-7.2L5 19.8z" fill="#1f2937" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'
    document.documentElement.appendChild(cursor)
    const ripple = document.createElement('div')
    ripple.id = '__demo-ripple'
    document.documentElement.appendChild(ripple)
    place(cursor, pos[0], pos[1], 0)
  }
  window.__demo = {
    move(x, y, ms) {
      install()
      pos = [x, y]
      try {
        sessionStorage.setItem(POS_KEY, JSON.stringify(pos))
      } catch {
        // fine — the next page starts in the middle
      }
      place(document.getElementById('__demo-cursor'), x, y, ms)
    },
    ripple() {
      const r = document.getElementById('__demo-ripple')
      r.style.left = pos[0] + 'px'
      r.style.top = pos[1] + 'px'
      r.classList.remove('on')
      void r.offsetWidth
      r.classList.add('on')
    },
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install)
  else install()
})()
