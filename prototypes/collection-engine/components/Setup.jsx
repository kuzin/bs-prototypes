import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { ChartCard } from '@components/Cards/Cards'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Table } from '@components/Table/Table'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { Select } from '@components/Form/Form'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/SectionCard/SectionCard.css'
import '@components/SettingRow/SettingRow.css'
import '@components/Pill/Pill.css'
import '@components/Table/Table.css'
import '@components/InfoBox/InfoBox.css'
import '@components/Form/Form.css'

import { SOURCES, DISTRICT, SIGNALS, SIGNAL_ORDER, SIGNAL_KINDS, WEIGHTS } from '../data'
import { schoolRows, FEED_STATE } from '../derive'
import { AiMark, FeedCard, FeedState, AsOf } from './Bits'
import { MarcUpload } from './MarcUpload'
import { useSyncRuns } from '../useSyncRuns'

export function Setup({ scope, school }) {
  return scope === 'school' ? <SchoolSetup school={school} /> : <DistrictSetup />
}

// ─── School ──────────────────────────────────────────────────────────────────

function SchoolSetup({ school }) {
  const [pool, setPool] = useStickyState('ce:pool', {
    destiny: true,
    clc: true,
    sora: true,
    comicsplus: true,
  })
  const [scopeWide, setScopeWide] = useState(false)
  const [requireReview, setRequireReview] = useStickyState('ce:require-review', false)
  const [band, setBand] = useStickyState('ce:band', 'stretch')
  const [weights, setWeights] = useStickyState('ce:weights', {})
  // A sync per catalog, and the one dialog the MARC feed goes through first.
  const { runs, start, dismiss } = useSyncRuns()
  const [uploading, setUploading] = useState(null)

  return (
    <>
      <PageHeader title="Setup" />

      <SectionCard title="Catalogs the engine recommends from" header="divider">
        <div className="ce-feeds">
          {school.feeds.map((feed) => (
            <FeedCard
              key={feed.source}
              feed={feed}
              on={pool[feed.source]}
              onToggle={() => setPool((p) => ({ ...p, [feed.source]: !p[feed.source] }))}
              run={runs[feed.source]}
              onSync={() => start(feed)}
              onUpload={() => setUploading(feed)}
              onDismissRun={() => dismiss(feed.source)}
            />
          ))}
        </div>
      </SectionCard>

      {/* The second half of the setup, and the other half of the product: the
          catalogs above decide what the engine may recommend, these decide how
          it picks from them. Grouped by the question each signal answers —
          would they want it, and can they read it — because a title that wins
          on taste and loses on fit is the 400-page novel handed to a reader who
          logs eight minutes a day. */}
      {/* A card per kind rather than one card with two runs inside it. They are
          two different questions — whether a reader would want the book, and
          whether they could read it — and a school tuning one is rarely
          touching the other. Each card carries the setting that qualifies its
          own signals, instead of both of them sitting in a list at the end
          belonging to neither. */}
      {Object.entries(SIGNAL_KINDS).map(([kind, meta]) => (
        <SectionCard
          key={kind}
          header="divider"
          title={
            <>
              {meta.label}
              <AiMark label={meta.ai} />
            </>
          }
        >
          <SettingList>
            {SIGNAL_ORDER.filter((id) => SIGNALS[id].kind === kind).map((id) => {
              const sig = SIGNALS[id]
              return (
                <SettingRow
                  key={id}
                  label={sig.label}
                  sub={sig.blurb}
                  control={
                    <Select
                      size="sm"
                      value={weights[id] ?? sig.weight}
                      onChange={(e) => setWeights((w) => ({ ...w, [id]: e.target.value }))}
                      aria-label={`How much ${sig.label} counts`}
                    >
                      {Object.entries(WEIGHTS).map(([k, w]) => (
                        <option key={k} value={k}>
                          {w.label}
                        </option>
                      ))}
                    </Select>
                  }
                />
              )
            })}

            {/* Ratings have nothing to work from until the reader is asked. */}
            {kind === 'taste' && (
              <SettingRow
                label="Ask for a rating when a book is finished"
                sub="The Ratings signal has nothing to work from until this is on — and it gets readers writing about books."
                checked={requireReview}
                onChange={() => setRequireReview((v) => !v)}
              />
            )}

            {/* And Reading level needs a range before it means anything. */}
            {kind === 'fit' && (
              <SettingRow
                label="How far past their level to reach"
                sub="Qualifies the Reading level signal above."
                control={
                  <Select
                    size="sm"
                    value={band}
                    onChange={(e) => setBand(e.target.value)}
                    aria-label="Reading level range"
                  >
                    <option value="comfort">Stay at their level</option>
                    <option value="stretch">Allow a stretch (+100L)</option>
                    <option value="open">Anything age-appropriate</option>
                  </Select>
                }
              />
            )}
          </SettingList>
        </SectionCard>
      ))}

      {/* The MARC feed can't sync itself — somebody carries a file over. The
          dialog is that step; the run it kicks off is the same one the other
          catalogs start from their own button. */}
      <MarcUpload
        open={Boolean(uploading)}
        feed={uploading}
        run={uploading ? runs[uploading.source] : null}
        onUpload={() => start(uploading)}
        onClose={() => setUploading(null)}
      />

      <SectionCard title="What these records cover" header="divider">
        {scopeWide && (
          <InfoBox level="warning" title="These records aren't limited to this school">
            A reader here can be pointed at a copy that lives across town.
          </InfoBox>
        )}
        <SettingList>
          <SettingRow
            label="Records are for this school only"
            sub="Holdings in the MARC file carry a location code we can match to this building."
            checked={!scopeWide}
            onChange={() => setScopeWide((v) => !v)}
          />
          <SettingRow
            label="Location field"
            sub="Which MARC subfield identifies the holding library."
            control={
              <Select size="sm" defaultValue="852b" aria-label="Location field">
                <option value="852b">852 $b — Sublocation</option>
                <option value="852a">852 $a — Location</option>
                <option value="049a">049 $a — Holding code</option>
              </Select>
            }
          />
        </SettingList>
      </SectionCard>
    </>
  )
}

// ─── District ────────────────────────────────────────────────────────────────

function DistrictSetup() {
  const rows = schoolRows()
  const connected = rows.filter((r) => r.fresh.problems === 0).length

  return (
    <>
      <PageHeader
        title="Setup"
        actions={
          <span className="ce-asof">
            <Icon name="circle-check" size={14} />
            {connected} of {rows.length} fully connected
          </span>
        }
      />

      <InfoBox level="info" title="A school is only as good as its feed">
        Conversion tracks catalog freshness more closely than it tracks collection size.
      </InfoBox>

      <ChartCard title="Catalog connections" accent="#0F766E" bodyPad="flush">
        <Table
          flush
          scrollX
          columns={[
            {
              key: 'name',
              label: 'School',
              render: (_, r) => (
                <div className="ce-title-text">
                  <span className="ce-title-name">{r.name}</span>
                  <span className="ce-title-sub">{r.readers} readers</span>
                </div>
              ),
            },
            {
              key: 'sources',
              label: 'Sources',
              render: (_, r) => (
                <span className="ce-holdings">
                  {r.school.feeds.map((f) => {
                    /* A source that was never connected loses its brand
                       colour entirely — an outline in the same hue is too
                       quiet to read down a column of six schools. A *stale*
                       source keeps its colour: it is connected, and the
                       Library catalog column already says how far behind it
                       is. Greying it here would contradict that. */
                    const on = f.state === 'ok' || f.state === 'stale'
                    return (
                      <Pill
                        key={f.source}
                        color={on ? SOURCES[f.source].color : '#ACACAC'}
                        variant={on ? 'soft' : 'outline'}
                      >
                        {SOURCES[f.source].short}
                      </Pill>
                    )
                  })}
                </span>
              ),
            },
            {
              key: 'fresh',
              label: 'Library catalog',
              render: (_, r) => <AsOf fresh={r.fresh} prefix="" />,
            },
            {
              key: 'state',
              label: 'Status',
              render: (_, r) => (
                <FeedState
                  state={
                    r.fresh.problems === 0
                      ? 'ok'
                      : r.fresh.asOf
                        ? r.fresh.staleDays > 30
                          ? 'stale'
                          : 'ok'
                        : 'off'
                  }
                />
              ),
            },
          ]}
          rows={rows}
          getRowKey={(r) => r.id}
        />
      </ChartCard>

      <SectionCard title="District defaults" header="divider">
        <SettingList>
          <SettingRow
            label="Require a location code in MARC files"
            sub="Reject a district-wide file that can't be split by building, rather than recommending books from another school."
            checked
            onChange={() => {}}
          />
          <SettingRow
            label="Let schools override what's in the pool"
            sub="Librarians can turn a source off for their own readers; they can't turn one on that the district hasn't licensed."
            checked
            onChange={() => {}}
          />
          <SettingRow
            label="Share Ask Benny queries with the district"
            sub="Query volume and what the collection could answer, aggregated. No reader is named."
            checked
            onChange={() => {}}
          />
        </SettingList>
      </SectionCard>
    </>
  )
}
