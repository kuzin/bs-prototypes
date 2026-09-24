import { ChartCard } from '@components/Cards/Cards'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import '@components/BennyBubble/BennyBubble.css'

/**
 * Benny's read of the collection, at the top of an Overview.
 *
 * Same block the Student Profile opens with — the shared <BennyBubble> in a
 * card with a "Benny says…" title — because it is the same move: the page
 * leads with what the numbers below it add up to, so a librarian who reads one
 * thing reads the right one.
 *
 * The summary itself is derived (`bennySchool` / `bennyDistrict` in derive.js):
 * which sentences appear depends on what the figures say. `**bold**` marks the
 * figures, and is turned into <strong> here rather than in the deriver, which
 * has no business knowing how it will be drawn.
 */
export function BennySummary({ summary, asOf }) {
  return (
    <ChartCard title="Benny says..." bodyPad="padded" className="ce-benny">
      <BennyBubble timestamp={asOf}>{emphasize(summary)}</BennyBubble>
    </ChartCard>
  )
}

/* `**…**` → <strong>. Odd indices are the captured runs. */
export function emphasize(text) {
  if (typeof text !== 'string' || !text.includes('**')) return text
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}
