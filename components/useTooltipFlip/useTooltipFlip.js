import { useEffect } from 'react'

/**
 * Re-positions Nivo (.sdb-tooltip) chart tooltips so they never cross into
 * the sidebar (the .rl-content's left edge) or off the right edge of the
 * viewport. The chart library
 * keeps writing its own transform on every mousemove, so this observer
 * re-applies the clamp every time the wrapper's style changes — guarded
 * with a data-attribute flag so it doesn't recurse on its own writes.
 *
 * Mount once near the top of the layout (RisLayout). Self-cleans on
 * unmount.
 */
export function useTooltipFlip({ leftBoundSelector = '.rl-content', margin = 12 } = {}) {
  useEffect(() => {
    const FLAG = 'data-ttipflip-pending'

    function bounds() {
      const el = leftBoundSelector ? document.querySelector(leftBoundSelector) : null
      const left = el?.getBoundingClientRect().left ?? 0
      return { left: left + margin, right: window.innerWidth - margin }
    }

    // Find the actual positioning wrapper (the absolutely-positioned div
    // whose transform the library mutates) given any node in the chart's
    // tooltip subtree.
    function findWrapper(node) {
      if (!node || node.nodeType !== 1) return null
      if (node.classList?.contains('sdb-tooltip')) return node.parentElement
      const sdb = node.querySelector?.('.sdb-tooltip')
      if (sdb) return sdb.parentElement
      return null
    }

    function clamp(wrapper) {
      if (!wrapper) return
      // Skip writes triggered by ourselves to break the observe→write→observe loop.
      if (wrapper.getAttribute(FLAG) === '1') {
        wrapper.removeAttribute(FLAG)
        return
      }

      const r = wrapper.getBoundingClientRect()
      const v = bounds()
      let shift = 0
      if (r.left < v.left) shift = v.left - r.left
      else if (r.right > v.right) shift = v.right - r.right
      if (shift === 0) return

      wrapper.setAttribute(FLAG, '1')
      // Append our translateX to whatever the library wrote. Strip any
      // prior `translateX(...)` we appended so shifts don't accumulate.
      const existing = (wrapper.style.transform || '').replace(/\s*translateX\([^)]*\)\s*$/, '')
      wrapper.style.transform = `${existing} translateX(${shift}px)`.trim()
    }

    function handleNode(node) {
      const w = findWrapper(node)
      if (w) clamp(w)
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) handleNode(n)
        } else if (m.type === 'attributes') {
          // style mutation on a tooltip wrapper — re-clamp.
          const t = m.target
          if (t.querySelector?.('.sdb-tooltip')) clamp(t)
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    })

    return () => observer.disconnect()
  }, [leftBoundSelector, margin])
}
