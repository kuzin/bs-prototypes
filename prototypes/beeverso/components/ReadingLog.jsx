import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'

import { PARTNERS, PARTNER_BY_ID } from '../connections'
import { OWN_SESSIONS, TITLE_BY_ID, importedSessions } from '../data'
import { TitleCover, KIND_LABEL } from './TitleCover'
import './ReadingLog.css'

import '@components/Pill/Pill.css'

// Newest first — everything from today, then yesterday, then the rest.
const ORDER = ['Today', 'Yesterday']
const rank = (w) => (ORDER.indexOf(w) === -1 ? ORDER.length : ORDER.indexOf(w))

/**
 * The reader's log. Sessions Carla entered herself and sessions her linked apps
 * sent over sit in one list — the imported ones carry their app's mark and an
 * "Imported from <app>" line, and can't be edited by hand, because the partner
 * is the system of record for them.
 *
 * This is the surface that makes a second connection worth showing: two apps,
 * two languages, one log.
 */
export function ReadingLog({ connections }) {
  const imported = importedSessions(connections).map((s) => {
    const t = TITLE_BY_ID[s.title]
    return {
      id: s.id,
      when: s.when,
      minutes: s.minutes,
      finished: s.finished,
      title: t.title,
      author: t.author,
      kind: t.kind,
      cover: t,
      partnerId: s.partnerId,
    }
  })

  const own = OWN_SESSIONS.map((s) => ({
    ...s,
    cover: { title: s.title, author: s.author, kind: 'book', cover: ['#94A3B8', '#475569'] },
  }))

  const rows = [...imported, ...own].sort((a, b) => rank(a.when) - rank(b.when))

  const total = rows.reduce((sum, r) => sum + r.minutes, 0)
  const importedMinutes = imported.reduce((sum, r) => sum + r.minutes, 0)
  const linked = PARTNERS.filter((p) => connections[p.id])
  const unlinked = PARTNERS.filter((p) => !connections[p.id])

  // "Beeverso", or "Beeverso and Comics Plus" — the sentence has to read right
  // whether one app is connected or both.
  const listNames = (partners) =>
    partners.length === 2
      ? `${partners[0].name} and ${partners[1].name}`
      : partners.map((p) => p.name).join(', ')

  return (
    <div className="bvlog">
      <div className="bvlog-head">
        <h1 className="bvlog-h1">Reading Log</h1>
        <p className="bvlog-sub">
          Everything Carla has read this week — {total} minutes across {rows.length} sessions.
          {linked.length > 0 && (
            <>
              {' '}
              <strong>
                {importedMinutes} of those minutes arrived from {listNames(linked)}
              </strong>{' '}
              without her logging a thing.
            </>
          )}
        </p>
      </div>

      {unlinked.length > 0 && (
        <div className="bvlog-empty">
          <Icon name="plug-connected" size={18} />
          <span>
            {listNames(unlinked)} {unlinked.length === 1 ? "isn't" : "aren't"} linked yet, so that
            reading is missing from this log. Link the accounts to backfill it.
          </span>
        </div>
      )}

      <ul className="bvlog-list">
        {rows.map((r) => (
          <li
            key={r.id}
            className={`bvlog-row${r.partnerId ? ' bvlog-row--imported' : ''}`}
            // Each source colors its own row edge, so two linked apps stay
            // tellable apart at a glance.
            style={
              r.partnerId ? { '--bvlog-accent': PARTNER_BRANDS[r.partnerId].accent } : undefined
            }
          >
            <TitleCover title={r.cover} size="md" />
            <div className="bvlog-row-main">
              <div className="bvlog-row-title">{r.title}</div>
              <div className="bvlog-row-author">{r.author}</div>
              <div className="bvlog-row-tags">
                {r.partnerId ? (
                  <span className="bvlog-imported">
                    <PartnerMark id={r.partnerId} size={15} />
                    Imported from {PARTNER_BY_ID[r.partnerId].name}
                  </span>
                ) : (
                  <span className="bvlog-manual">
                    <Icon name="pencil" size={13} /> Logged by Carla
                  </span>
                )}
                {r.kind && r.kind !== 'book' && (
                  <Pill
                    color={r.partnerId ? PARTNER_BRANDS[r.partnerId].accent : '#662D91'}
                    variant="soft"
                    size="sm"
                  >
                    {KIND_LABEL[r.kind]}
                  </Pill>
                )}
                {r.finished && (
                  <Pill color="#16A97A" variant="soft" size="sm">
                    Finished
                  </Pill>
                )}
              </div>
            </div>
            <div className="bvlog-row-right">
              <span className="bvlog-row-min">{r.minutes} min</span>
              <span className="bvlog-row-when">{r.when}</span>
            </div>
          </li>
        ))}
      </ul>

      {linked.length > 0 && (
        <p className="bvlog-foot">
          Imported sessions can&apos;t be edited here — {listNames(linked)}{' '}
          {linked.length === 1 ? 'keeps' : 'keep'} the record, and Beanstack mirrors it.
        </p>
      )}
    </div>
  )
}
