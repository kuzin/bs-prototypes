import { MetricCard, PanelCard } from '../../insights/components'
import { Variant } from './_shared'

export const insightsSections = [
  {
    group: 'insights',
    id: 'insights-metric-card',
    name: 'MetricCard',
    desc: (
      <>
        The boxy metric tile from the production Insights dashboard. Renders one of three{' '}
        <code>state</code>s: <code>value</code>, <code>loading</code> (skeleton), and{' '}
        <code>empty</code> (with an <code>onLoad</code> affordance). When <code>state="value"</code>{' '}
        and <code>onClick</code> is set, the whole tile becomes a clickable button with a chevron.
        Insights-specific — lives in <code>prototypes/insights/</code>.
      </>
    ),
    render: () => (
      <div className="pt-variants pt-variants--4">
        <Variant label="value" bare>
          <MetricCard label="Active readers" note="this month" value={1284} />
        </Variant>
        <Variant label="value — clickable" bare>
          <MetricCard label="Books finished" note="this month" value={3271} onClick={() => {}} />
        </Variant>
        <Variant label="loading" bare>
          <MetricCard label="Minutes logged" note="this month" state="loading" />
        </Variant>
        <Variant label="empty — load" bare>
          <MetricCard label="Avg session" note="not yet loaded" state="empty" onLoad={() => {}} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'insights',
    id: 'insights-panel-card',
    name: 'PanelCard',
    desc: (
      <>
        A wider Insights panel (Top Books / Top Badges / Ages) with the same{' '}
        <code>value</code> / <code>loading</code> / <code>empty</code> state machine. The{' '}
        <code>kind</code> prop (<code>books</code> / <code>badges</code> / <code>ages</code>) picks a
        content-shaped skeleton so the layout doesn't jump when data lands. A clickable header{' '}
        <code>View details</code> link appears when <code>onClick</code> is set.
        Insights-specific — lives in <code>prototypes/insights/</code>.
      </>
    ),
    render: () => (
      <div className="pt-variants pt-variants--3">
        <Variant label="value (+ clickable header)" bare>
          <PanelCard title="Top Books" onClick={() => {}}>
            <div style={{ padding: '6px 2px', color: '#64748b', fontSize: 13 }}>
              Panel body content goes here.
            </div>
          </PanelCard>
        </Variant>
        <Variant label="loading — kind='books'" bare>
          <PanelCard title="Top Books" state="loading" kind="books" />
        </Variant>
        <Variant label="empty — load" bare>
          <PanelCard title="Top Badges" state="empty" kind="badges" onLoad={() => {}} />
        </Variant>
      </div>
    ),
  },
]
