import { useState, useRef, useLayoutEffect } from 'react'
import { Icon } from '@components/Icon/Icon'

// A clamped paragraph that reveals the rest behind a "View more" toggle —
// the toggle only appears when the text actually overflows the clamp.
export function ExpandableText({ text, lines = 3, className = '' }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (el) setOverflows(el.scrollHeight - el.clientHeight > 4)
  }, [text, lines])

  return (
    <div className="bk-expandable">
      <p
        ref={ref}
        className={`${className} bk-clamp ${expanded ? 'is-expanded' : ''}`.trim()}
        style={expanded ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <button className="bk-viewmore" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'View less' : 'View more'}
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={14} />
        </button>
      )}
    </div>
  )
}
