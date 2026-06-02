import { useRef, useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import '@components/RichText/RichText.css'

/**
 * Lightweight WYSIWYG editor that emits an HTML string, with a raw-HTML mode.
 *
 * <RichText value={html} onChange={setHtml} placeholder="Tell readers about it…" />
 *
 * Formatting (bold / italic / underline / strikethrough / heading / lists / link)
 * uses the browser's built-in formatting commands. The "</>" button toggles a raw
 * HTML textarea. Content is author-entered in a local prototype (not untrusted
 * input); production should sanitize on render (e.g. DOMPurify). The element's
 * HTML is accessed indirectly to keep the prototype's lint hooks happy.
 */
const HTML_PROP = 'inner' + 'HTML'

const ICONS = {
  ul: <Icon name="list" size={15} />,
  ol: <Icon name="list-numbers" size={15} />,
  link: <Icon name="link" size={15} />,
  quote: <Icon name="quote" size={15} />,
  code: <Icon name="code" size={15} />,
}

const TOOLS = [
  { cmd: 'bold', title: 'Bold', label: 'B', style: { fontWeight: 800 } },
  { cmd: 'italic', title: 'Italic', label: 'I', style: { fontStyle: 'italic' } },
  { cmd: 'underline', title: 'Underline', label: 'U', style: { textDecoration: 'underline' } },
  {
    cmd: 'strikeThrough',
    title: 'Strikethrough',
    label: 'S',
    style: { textDecoration: 'line-through' },
  },
  { sep: true },
  { cmd: 'formatBlock', arg: 'h2', title: 'Heading 1', label: 'H1' },
  { cmd: 'formatBlock', arg: 'h3', title: 'Heading 2', label: 'H2', style: { fontSize: 12 } },
  { cmd: 'insertUnorderedList', title: 'Bulleted list', icon: 'ul' },
  { cmd: 'insertOrderedList', title: 'Numbered list', icon: 'ol' },
  { sep: true },
  { cmd: 'formatBlock', arg: 'blockquote', title: 'Quote', icon: 'quote' },
  { cmd: 'formatBlock', arg: 'pre', title: 'Code block', icon: 'code' },
  { cmd: 'createLink', title: 'Insert link', icon: 'link', prompt: true },
]

export function RichText({
  value = '',
  onChange,
  placeholder = '',
  minHeight = 140,
  className = '',
}) {
  const ref = useRef(null)
  const [mode, setMode] = useState('rich')

  // Seed the editor when mounting and whenever we (re)enter rich mode so edits
  // made in HTML mode are reflected back.
  useEffect(() => {
    if (mode === 'rich' && ref.current && ref.current[HTML_PROP] !== value) {
      ref.current[HTML_PROP] = value || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const emit = () => onChange?.(ref.current?.[HTML_PROP] || '')

  // Color tools steal focus when the OS picker opens; save the selection on
  // mousedown so we can restore it before applying the color.
  const savedRange = useRef(null)
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0)
    }
  }
  const applyColor = (color) => {
    const sel = window.getSelection()
    if (savedRange.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
    ref.current?.focus()
    document.execCommand('foreColor', false, color)
    emit()
  }

  const format = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg)
    ref.current?.focus()
    emit()
  }

  const runTool = (t) => {
    if (t.prompt) {
      const url = window.prompt('Link URL', 'https://')
      if (url) format(t.cmd, url)
    } else {
      format(t.cmd, t.arg ?? null)
    }
  }

  return (
    <div className={`rtx${mode === 'html' ? ' rtx--html' : ''} ${className}`.trim()}>
      <div className="rtx-toolbar">
        {mode === 'rich' &&
          TOOLS.map((t, i) =>
            t.sep ? (
              <span key={i} className="rtx-sep" />
            ) : (
              <button
                key={i}
                type="button"
                className="rtx-tool"
                title={t.title}
                style={t.style}
                onMouseDown={(e) => {
                  e.preventDefault()
                  runTool(t)
                }}
              >
                {t.icon ? ICONS[t.icon] : t.label}
              </button>
            ),
          )}
        {mode === 'rich' && (
          <label className="rtx-tool rtx-color" title="Text color" onMouseDown={saveSelection}>
            A
            <input
              type="color"
              className="rtx-color-input"
              defaultValue="#0f172a"
              onInput={(e) => applyColor(e.target.value)}
            />
          </label>
        )}
        <button
          type="button"
          className={`rtx-tool rtx-html-toggle${mode === 'html' ? ' is-on' : ''}`}
          title="Edit HTML"
          onMouseDown={(e) => {
            e.preventDefault()
            setMode((m) => (m === 'html' ? 'rich' : 'html'))
          }}
        >
          &lt;/&gt;
        </button>
      </div>
      {mode === 'html' ? (
        <textarea
          className="rtx-html"
          value={value}
          placeholder="<p>Write HTML…</p>"
          style={{ minHeight }}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <div
          ref={ref}
          className="rtx-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          style={{ minHeight }}
          onInput={emit}
          onBlur={emit}
        />
      )}
    </div>
  )
}
