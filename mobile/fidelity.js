import { FIDELITY, STRUCTURE, DEVIATIONS } from './fidelity.spec'

/**
 * Style assertions — computed CSS against the values in the RN source.
 *
 * `missing` is not a failure: it means the selector is not on this page (a component the current
 * tab does not render), so the check simply has nothing to say. Only a value that IS present and
 * disagrees counts.
 *
 * Two fields, and an entry may carry either or both:
 *   expect  { prop: literal }        — the value is fixed in the source
 *   sameAs  { selector, props }      — the value is DERIVED, so only the agreement is assertable
 *
 * `sameAs` exists because some of the app's colours are computed from the tenant's `primaryColor`
 * at runtime. A literal would be a claim about one tenant; what the source actually fixes is that
 * two surfaces are fed the same expression, so that is what gets asserted.
 */
export function checkFidelity({ root = document } = {}) {
  const results = FIDELITY.map((entry) => {
    const el = root.querySelector(entry.selector)
    if (!el) return { ...entry, status: 'missing', diffs: [] }

    const cs = getComputedStyle(el)
    const diffs = Object.entries(entry.expect ?? {})
      .map(([prop, want]) => (cs[prop] === want ? null : { prop, want, got: cs[prop] }))
      .filter(Boolean)

    if (entry.sameAs) {
      const other = root.querySelector(entry.sameAs.selector)
      if (!other) {
        diffs.push({
          prop: 'sameAs',
          want: `${entry.sameAs.selector} present`,
          got: 'missing',
        })
      } else {
        const ocs = getComputedStyle(other)
        for (const prop of entry.sameAs.props) {
          if (cs[prop] !== ocs[prop]) {
            diffs.push({
              prop: `${prop} (same as ${entry.sameAs.selector})`,
              want: ocs[prop],
              got: cs[prop],
            })
          }
        }
      }
    }

    return { ...entry, status: diffs.length ? 'fail' : 'pass', diffs }
  })

  return {
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
    missing: results.filter((r) => r.status === 'missing').length,
    results,
  }
}

/**
 * Is this element actually painted where it overlaps, or is something covering it?
 *
 * `elementFromPoint` answers what the browser would hit-test there, which is the only way to catch
 * a sibling painting over it — the exact failure the fundraiser banner had while every one of its
 * measurements was correct.
 *
 * WHERE it probes decides what it can detect. The centre is the right default, but it is the wrong
 * probe for the `marginTop: -h/2` idiom this app uses repeatedly: there the overlap IS the top
 * half, so a centre probe lands just past it and reports a clean pass over a fully hidden overlap.
 * `probe: 'top'` samples a quarter of the way down instead, which is inside that overlap.
 *
 * The element has to be on screen for the hit test to mean anything, and the phone frame scrolls
 * internally, so it is scrolled into view first.
 */
function paintedOnTop(el, probe = 'center') {
  el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })
  const r = el.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return { ok: false, covering: '(zero size)' }

  const x = Math.round(r.left + r.width / 2)
  const y = Math.round(r.top + r.height * (probe === 'top' ? 0.25 : 0.5))
  const hit = document.elementFromPoint(x, y)
  if (!hit) return { ok: false, covering: '(outside the viewport)' }
  if (hit === el || el.contains(hit)) return { ok: true }

  const name = hit.className
    ? `${hit.tagName.toLowerCase()}.${String(hit.className).split(' ').join('.')}`
    : hit.tagName.toLowerCase()
  return { ok: false, covering: name }
}

/** Structural assertions — what rendered, rather than what it computes to. */
export function checkStructure({ root = document } = {}) {
  const results = STRUCTURE.map((entry) => {
    // An assertion scoped to a component this page does not render has nothing to say. Without
    // this, `required` would mean "must exist on every page" — and every Home assertion would
    // fail on the Log tab.
    if (entry.scope && !root.querySelector(entry.scope)) {
      return { ...entry, status: 'missing', diffs: [] }
    }

    const el = root.querySelector(entry.selector)

    if (!el) {
      // Inside its scope, `required` is the whole point of this list: a part that should be there
      // and is not is a failure, not a component this page happens not to render.
      return entry.required
        ? {
            ...entry,
            status: 'fail',
            diffs: [{ prop: 'presence', want: 'present', got: 'missing' }],
          }
        : { ...entry, status: 'missing', diffs: [] }
    }

    const diffs = []

    if (entry.children != null && el.children.length !== entry.children) {
      diffs.push({ prop: 'children', want: entry.children, got: el.children.length })
    }
    if (entry.childrenAtMost != null && el.children.length > entry.childrenAtMost) {
      diffs.push({ prop: 'children', want: `<= ${entry.childrenAtMost}`, got: el.children.length })
    }
    if (entry.text != null) {
      const got = el.textContent.trim()
      if (got !== entry.text) diffs.push({ prop: 'text', want: entry.text, got })
    }
    if (entry.textOneOf != null) {
      const got = el.textContent.trim()
      if (!entry.textOneOf.includes(got)) {
        diffs.push({ prop: 'text', want: `one of ${entry.textOneOf.join(' | ')}`, got })
      }
    }
    // Two screens can be structurally identical and still differ in what CONTAINS what — the
    // achievement sheet's header is a sibling of its scroll view, the badge sheet's is a child, and
    // that is the whole difference between a fixed header and one that scrolls away.
    if (entry.notInside) {
      const container = root.querySelector(entry.notInside)
      if (container && container.contains(el)) {
        diffs.push({
          prop: 'containment',
          want: `outside ${entry.notInside}`,
          got: `inside ${entry.notInside}`,
        })
      }
    }
    // Centring is a GEOMETRY fact, and the only one that matters for a three-slot header: equal
    // flex bases on the two ends IMPLY a centred middle, but the implication dies the moment a
    // slot gains a min-width or its content overflows — and computed style still reads `flex: 1`
    // either way. So measure it. 1.5px of tolerance covers subpixel layout, nothing more.
    if (entry.centeredIn) {
      const container = root.querySelector(entry.centeredIn)
      if (!container) {
        diffs.push({ prop: 'centered', want: `${entry.centeredIn} present`, got: 'missing' })
      } else {
        const a = el.getBoundingClientRect()
        const b = container.getBoundingClientRect()
        const drift = a.left + a.width / 2 - (b.left + b.width / 2)
        if (Math.abs(drift) > 1.5) {
          diffs.push({
            prop: 'centered',
            want: `centred in ${entry.centeredIn}`,
            got: `off by ${drift.toFixed(1)}px`,
          })
        }
      }
    }
    if (entry.onTop) {
      const { ok, covering } = paintedOnTop(el, entry.probe)
      if (!ok)
        diffs.push({ prop: 'painted', want: 'nothing covering it', got: `covered by ${covering}` })
    }

    return { ...entry, status: diffs.length ? 'fail' : 'pass', diffs }
  })

  return {
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
    missing: results.filter((r) => r.status === 'missing').length,
    results,
  }
}

/** A compact report over both layers — the shape you want when driving this from outside. */
export function reportFidelity(opts) {
  const style = checkFidelity(opts)
  const structure = checkStructure(opts)

  const failuresOf = (r) =>
    r.results
      .filter((x) => x.status === 'fail')
      .map((x) => ({
        group: x.group,
        selector: x.selector,
        source: x.source,
        diffs: x.diffs.map((d) => `${d.prop}: want ${d.want}, got ${d.got}`),
      }))

  return {
    style: { pass: style.pass, fail: style.fail, missing: style.missing },
    structure: { pass: structure.pass, fail: structure.fail, missing: structure.missing },
    failures: [...failuresOf(style), ...failuresOf(structure)],
    missingSelectors: [...style.results, ...structure.results]
      .filter((x) => x.status === 'missing')
      .map((x) => x.selector),
    deviations: DEVIATIONS,
  }
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__mobileFidelity = reportFidelity
}
