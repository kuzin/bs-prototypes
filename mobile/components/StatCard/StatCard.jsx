import { Img } from '../Img/Img'
import './StatCard.css'

/**
 * A single statistic, carded.
 *
 * DIVERGENCE — `Statistics.tsx` draws these as bare rows: `marginLeft: 32`, `marginTop: 48`, a
 * 24pt icon beside a 12pt uppercase label, then a 41pt number with its unit dropped to the
 * baseline. No container at all, so six stats run about 500pt down the page with nothing to say
 * where one ends and the next begins.
 *
 * The treatment is the WEB prototype's `StatCard` (`components/Cards/Cards.jsx`), brought across:
 * the whole tile takes a light tint of the stat's own colour, and the icon sits in a white circle
 * on top of it at full strength. That is the house pattern for a figure, and it does the job the
 * bare rows did not — you learn the colour before you read the label, so the set is scannable.
 *
 * `value2`/`unit2` are the two-part stats — READING TIME is "4 hours 35 minutes" and LONGEST
 * SESSION the same, so the pair has to stay one card rather than becoming two.
 */
export function StatCard({ icon, tint, title, value, unit, value2, unit2 }) {
  return (
    <article className="m-statcard" style={tint ? { background: tint } : undefined}>
      <span className="m-statcard-tile">
        <Img name={icon} size={24} />
      </span>

      <div className="m-statcard-main">
        {/* Each value+unit is one unbreakable PAIR. A flat row of four spans wraps wherever it
            runs out of room, which strands the second unit on its own line — the break has to
            fall between the pairs, not inside one. */}
        <p className="m-statcard-val">
          <span className="m-statcard-pair">
            <span className="m-statcard-num">{value}</span>
            {unit && <span className="m-statcard-unit">{unit}</span>}
          </span>
          {value2 != null && (
            <span className="m-statcard-pair">
              <span className="m-statcard-num">{value2}</span>
              {unit2 && <span className="m-statcard-unit">{unit2}</span>}
            </span>
          )}
        </p>

        <p className="m-statcard-title">{title}</p>
      </div>
    </article>
  )
}
