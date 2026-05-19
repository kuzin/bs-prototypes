import { useState, useEffect } from 'react'
import { StatCard, ChartCard, CardNote } from '../ris/components/Cards'
import {
  ChartLegend, SliceTooltip, GradeTooltip, BarTooltip,
} from '../ris/components/charts'
import { SECTIONS } from '../ris/components/ReadingHealth'
import { RMI_ICONS } from '../ris/components/RmiIcons'
import { RMI_FACTORS } from '../ris/data'
import { PrototypeNav } from '../PrototypeNav'

// Bring in CSS for the components so they render properly here
import '../ris/components/Cards.css'
import '../ris/components/SchoolDashboard.css'

import './App.css'

const SECTIONS_LIST = [
  { id: 'stat-card',   name: 'StatCard' },
  { id: 'chart-card',  name: 'ChartCard' },
  { id: 'card-note',   name: 'CardNote' },
  { id: 'chart-legend', name: 'ChartLegend' },
  { id: 'tooltips',    name: 'Tooltips' },
  { id: 'rmi-icons',   name: 'RMI Icons' },
  { id: 'health-icons', name: 'Reading Health Icons' },
]

// ── Static slice fixtures so the tooltips can render outside a chart ────────
const fakeSlicePoints = (points) => ({
  points: points.map((p, i) => ({
    id:         `${p.serieId}.${i}`,
    serieId:    p.serieId,
    serieColor: p.color,
    data:       { x: p.x, y: p.y },
  })),
})

const RMI_TREND_FIXTURE = [
  { month: 'Sep', school: 64, district: 68 },
  { month: 'Oct', school: 65, district: 69 },
  { month: 'Nov', school: 67, district: 71 },
  { month: 'Dec', school: 66, district: 70 },
  { month: 'Jan', school: 68, district: 72 },
]

function ChartCardKnobs() {
  const [title, setTitle]       = useState('Reading Motivation Index')
  const [subtitle, setSubtitle] = useState('Sep 2024 – May 2025')
  const [accent, setAccent]     = useState('#E8866A')
  const [showIcon, setShowIcon] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showAction, setShowAction] = useState(true)
  const [bodyPad, setBodyPad]   = useState('padded')

  const icon = SECTIONS.find(s => s.key === 'motivation')?.icon
  return (
    <>
      <div className="pt-knobs">
        <div className="pt-knob">
          <label htmlFor="t">title</label>
          <input id="t" type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="pt-knob">
          <label htmlFor="s">subtitle</label>
          <input id="s" type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
        </div>
        <div className="pt-knob">
          <label htmlFor="a">accent</label>
          <input id="a" type="color" value={accent} onChange={e => setAccent(e.target.value)} />
        </div>
        <div className="pt-knob">
          <label htmlFor="b">bodyPad</label>
          <select id="b" value={bodyPad} onChange={e => setBodyPad(e.target.value)}>
            <option value="flush">flush</option>
            <option value="padded">padded</option>
          </select>
        </div>
        <div className="pt-knob">
          <label><input type="checkbox" checked={showIcon} onChange={e => setShowIcon(e.target.checked)} /> icon</label>
        </div>
        <div className="pt-knob">
          <label><input type="checkbox" checked={showAction} onChange={e => setShowAction(e.target.checked)} /> action</label>
        </div>
        <div className="pt-knob">
          <label><input type="checkbox" checked={showFooter} onChange={e => setShowFooter(e.target.checked)} /> footer</label>
        </div>
      </div>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title={title}
          subtitle={subtitle}
          accent={accent}
          icon={showIcon ? icon : undefined}
          action={showAction ? <button className="rc-card-drill">View →</button> : undefined}
          bodyPad={bodyPad}
          footer={showFooter ? (
            <ChartLegend items={[
              { color: accent,   label: 'This school' },
              { color: '#CBD5E1', label: 'District avg', dashed: true },
            ]} />
          ) : undefined}
        >
          <div style={{ color: '#94A3B8', textAlign: 'center', padding: '32px 0' }}>
            {bodyPad === 'flush' ? 'Chart goes here (flush)' : 'Padded content goes here'}
          </div>
        </ChartCard>
      </div>
    </>
  )
}

function Section({ id, title, desc, children }) {
  return (
    <section id={id} className="pt-section">
      <h2>{title}</h2>
      {desc && <div className="pt-section-desc">{desc}</div>}
      {children}
    </section>
  )
}

function Variant({ label, children, bare }) {
  return (
    <div className="pt-variant">
      <div className="pt-variant-label">{label}</div>
      <div className={`pt-variant-frame${bare ? ' pt-variant-frame--bare' : ''}`}>{children}</div>
    </div>
  )
}

export function App() {
  const [active, setActive] = useState('stat-card')

  useEffect(() => {
    function onScroll() {
      const sections = SECTIONS_LIST.map(s => document.getElementById(s.id))
      const top = document.querySelector('.pt-content').scrollTop + 60
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= top) {
          setActive(SECTIONS_LIST[i].id)
          return
        }
      }
    }
    const content = document.querySelector('.pt-content')
    content?.addEventListener('scroll', onScroll, { passive: true })
    return () => content?.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="pt-shell">
        <aside className="pt-sidebar">
          <div className="pt-sidebar-title">Pattern Library</div>
          <div className="pt-sidebar-sub">Shared components used across all RIS prototype pages</div>
          {SECTIONS_LIST.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`pt-nav-link${active === s.id ? ' pt-nav-link--active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              {s.name}
            </a>
          ))}
        </aside>

        <main className="pt-content">
          <div className="pt-header">
            <h1>Pattern Library</h1>
            <p>Edit the source CSS / JSX and every prototype updates via HMR. Knobs let you preview prop combinations without touching code.</p>
          </div>

          <Section
            id="stat-card"
            title="StatCard"
            desc={<>Small metric tile shown in a row at the top of a bucket page. Props: <code>value</code>, <code>unit</code>, <code>label</code>, <code>footer</code>, <code>color</code>, <code>footerColor</code>.</>}
          >
            <div className="pt-variants pt-variants--4">
              <Variant label="basic" bare>
                <StatCard value={71} label="Reading Motivation Index" footer="↑ 7 pts since Sep 2024" />
              </Variant>
              <Variant label="with unit + color" bare>
                <StatCard value={26.0} unit="/40" label="School RMI score" footer="↑ 7 pts since Sep" color="#E8866A" />
              </Variant>
              <Variant label="semantic footer (good)" bare>
                <StatCard value="+18" unit="L" label="YTD Lexile growth" footer="Above expected +65L" color="#16A97A" footerColor="#16A34A" />
              </Variant>
              <Variant label="semantic footer (bad)" bare>
                <StatCard value="+8" unit="L" label="YTD Lexile growth" footer="Below expected +65L" color="#DC2626" footerColor="#DC2626" />
              </Variant>
            </div>
          </Section>

          <Section
            id="chart-card"
            title="ChartCard"
            desc={<>Wide rectangle with a consistent header / body / footer used for every chart and panel. Props: <code>title</code>, <code>subtitle</code>, <code>icon</code>, <code>accent</code>, <code>action</code>, <code>footer</code>, <code>bodyPad</code>. Knobs below to preview combinations.</>}
          >
            <ChartCardKnobs />
          </Section>

          <Section
            id="card-note"
            title="CardNote"
            desc={<>Inline note inside a card body. Two tones: <code>neutral</code> (slate) and <code>accent</code> (uses the card's <code>--rc-accent</code>).</>}
          >
            <div className="pt-variants pt-variants--2">
              <Variant label="tone='neutral'" bare>
                <ChartCard title="Neutral" accent="#1D4ED8" bodyPad="padded">
                  <CardNote tone="neutral">
                    Sample neutral note text — used for grayscale callouts that don't need the card's accent color.
                  </CardNote>
                </ChartCard>
              </Variant>
              <Variant label="tone='accent'" bare>
                <ChartCard title="Accent" accent="#E8866A" bodyPad="padded">
                  <CardNote tone="accent">
                    Intrinsic subscore rose from <strong>12.1</strong> to <strong>14.2 /20</strong>, outpacing extrinsic motivation.
                  </CardNote>
                </ChartCard>
              </Variant>
            </div>
          </Section>

          <Section
            id="chart-legend"
            title="ChartLegend"
            desc={<>Footer legend rendered below the chart body. <code>items</code> is an array of <code>{'{ color, label, dashed? }'}</code>.</>}
          >
            <div className="pt-variants pt-variants--2">
              <Variant label="solid + dashed">
                <ChartLegend items={[
                  { color: '#E8866A', label: 'Lincoln' },
                  { color: '#CBD5E1', label: 'District avg', dashed: true },
                ]} />
              </Variant>
              <Variant label="three series">
                <ChartLegend items={[
                  { color: '#0DA7BC', label: 'Elementary' },
                  { color: '#16A97A', label: 'Middle' },
                  { color: '#C084FC', label: 'High' },
                ]} />
              </Variant>
            </div>
          </Section>

          <Section
            id="tooltips"
            title="Tooltips"
            desc={<>The rich Nivo tooltip pattern: colored accent stripe on the left, uppercase header, per-series row with optional MoM delta, optional context footer.</>}
          >
            <div className="pt-variants pt-variants--3">
              <Variant label="SliceTooltip — line chart">
                <SliceTooltip
                  slice={fakeSlicePoints([
                    { serieId: 'Lincoln',      color: '#E8866A', x: 'Jan', y: 68 },
                    { serieId: 'District avg', color: '#CBD5E1', x: 'Jan', y: 72 },
                  ])}
                  accent="#E8866A"
                  allData={RMI_TREND_FIXTURE}
                  seriesMap={{ Lincoln: 'school', 'District avg': 'district' }}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d} pts`}
                  context={() => <><strong>Lincoln</strong> −4 pts below district</>}
                />
              </Variant>
              <Variant label="BarTooltip — grouped bars">
                <BarTooltip
                  data={{ intrinsic: 14.2, extrinsic: 11.8 }}
                  indexValue="May"
                  accent="#E8866A"
                  format={v => `${v.toFixed(1)} /20`}
                  keys={['intrinsic', 'extrinsic']}
                  labels={{
                    intrinsic: { label: 'Intrinsic', color: '#E8866A' },
                    extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
                  }}
                  context={d => <><strong>Intrinsic</strong> +{(d.intrinsic - d.extrinsic).toFixed(1)} pts above extrinsic</>}
                />
              </Variant>
              <Variant label="GradeTooltip — Lexile bars">
                <GradeTooltip
                  data={{ grade: '4th', growth: 78, expected: 55 }}
                  accent="#7C3AED"
                />
              </Variant>
            </div>
          </Section>

          <Section
            id="rmi-icons"
            title="RMI Icons"
            desc={<>10 SVG icons keyed by motivation factor. Use via <code>{'<RMI_ICONS[factor.iconKey] />'}</code>. Inherit color from CSS <code>color</code>.</>}
          >
            <div className="pt-icons">
              {RMI_FACTORS.map(f => (
                <div key={f.name} className="pt-icon-cell">
                  <div
                    className="pt-icon-bg"
                    style={{ '--c': f.color, '--bg': `color-mix(in srgb, ${f.color} 10%, white)` }}
                  >
                    {RMI_ICONS[f.iconKey]}
                  </div>
                  <div className="pt-icon-name">{f.name}</div>
                  <div className="pt-icon-key">{f.iconKey}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="health-icons"
            title="Reading Health Icons"
            desc={<>The four health-area icons from <code>SECTIONS</code> (Motivation, Integrity, Habits, Skills). Used in dashboard cards and bucket page heroes.</>}
          >
            <div className="pt-icons">
              {SECTIONS.map(s => (
                <div key={s.key} className="pt-icon-cell">
                  <div
                    className="pt-icon-bg"
                    style={{ '--c': s.color, '--bg': s.bg }}
                  >
                    {s.icon}
                  </div>
                  <div className="pt-icon-name">{s.label}</div>
                  <div className="pt-icon-key">{s.key}</div>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
      <PrototypeNav currentHref="/bs-prototypes/patterns/" />
    </>
  )
}
