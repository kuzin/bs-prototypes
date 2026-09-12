// Syntax highlighting for the Usage snippets.
//
// Deliberately hand-rolled rather than pulling in Prism/highlight.js: these
// snippets are a narrow, known subset — imports, JSX, strings, comments, and a
// handful of CSS custom properties — and a docs page in a prototype repo isn't
// worth a highlighting dependency.
//
// One global regex with ordered alternatives, matched in a single pass, so a
// token can never be re-highlighted inside another (the classic bug you get
// from chained .replace() calls). At any position the leftmost alternative
// wins, which is why comments and strings come first — everything inside them
// is swallowed whole.

const TOKEN = new RegExp(
  [
    String.raw`(\/\*[\s\S]*?\*\/|\/\/[^\n]*)`, // 1 comment
    String.raw`('[^'\n]*'|"[^"\n]*")`, // 2 string
    String.raw`(<\/?[A-Za-z][\w.]*|\/?>)`, // 3 JSX tag
    String.raw`(\b(?:import|from|export|const|let|await|function|return)\b)`, // 4 keyword
    String.raw`([A-Za-z][\w-]*)(?==)`, // 5 attribute / prop name
    String.raw`(--[a-z0-9-]+)`, // 6 CSS custom property
    String.raw`(\b\d+(?:\.\d+)?(?:px|%|em|rem|s|ms)?\b)`, // 7 number
  ].join('|'),
  'g',
)

const CLASS_FOR = ['comment', 'string', 'tag', 'keyword', 'attr', 'var', 'number']

function highlight(code) {
  const out = []
  let last = 0

  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    // m[1]…m[7] line up with CLASS_FOR — exactly one of them is set.
    const kind = CLASS_FOR[m.findIndex((g, i) => i > 0 && g !== undefined) - 1]
    out.push(
      <span key={m.index} className={`tok tok--${kind}`}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }

  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, className = '' }) {
  return (
    <pre className={`pt-code ${className}`.trim()}>
      <code>{highlight(code)}</code>
    </pre>
  )
}
