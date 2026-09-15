import { useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { CardNote, ChartCard, StatCard } from '@components/Cards/Cards'
import { GoalStat, GoalStats } from '@components/GoalStat/GoalStat'
import {
  AXIS_BOTTOM,
  AXIS_LEFT,
  BarTooltip,
  ChartLegend,
  GradeTooltip,
  NIVO_THEME,
  SliceTooltip,
} from '@components/charts/charts'
import { SECTIONS as HEALTH_SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { Table } from '@components/Table/Table'
import { BarList } from '@components/BarList/BarList'
import { Funnel } from '@components/Funnel/Funnel'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { WordCloud } from '@components/WordCloud/WordCloud'
import { Toggle } from '@components/Toggle/Toggle'
import { ColorInput, Field, Input, RangeSlider, Select } from '@components/Form/Form'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { RMI_FACTORS } from '../../ris/data'
import { Knobs, Variant, TABLE_ROWS } from './_shared'

const fakeSlicePoints = (points) => ({
  points: points.map((p, i) => ({
    id: `${p.seriesId}.${i}`,
    seriesId: p.seriesId,
    seriesColor: p.color,
    data: { x: p.x, y: p.y },
  })),
})

const RMI_TREND_FIXTURE = [
  { month: 'Sep', school: 64, district: 68 },
  { month: 'Oct', school: 65, district: 69 },
  { month: 'Nov', school: 67, district: 71 },
  { month: 'Dec', school: 66, district: 70 },
  { month: 'Jan', school: 68, district: 72 },
]

const BL_DIET_DATA = [
  { label: 'Sci-Fi & Fantasy', value: 28, color: '#B43DD0' },
  { label: 'Sports & Adventure', value: 19, color: '#0CA7BC' },
  { label: 'Realistic Fiction', value: 17, color: '#0BA85F' },
  { label: 'Graphic & Manga', value: 14, color: '#F26430' },
  { label: 'Mystery & Thriller', value: 11, color: '#F0C050' },
  { label: 'Other', value: 11, color: '#D0D0D0' },
]

const BL_GRADE_BANDS = ['K–2', '3–5', '6–8', '9–12']

function BarListKnobs() {
  const [variant, setVariant] = useState('grouped')
  const [showBar, setShowBar] = useState(true)
  const [layout, setLayout] = useState('columns')
  const [showIcon, setShowIcon] = useState(true)
  const [showSublabel, setShowSublabel] = useState(true)
  const [showDelta, setShowDelta] = useState(true)
  const [showValueLabel, setShowValueLabel] = useState(true)
  const [showPrefix, setShowPrefix] = useState(true)
  const [labelWidth, setLabelWidth] = useState(0)
  const [barAlign, setBarAlign] = useState('start')
  const [barHeight, setBarHeight] = useState(0)
  const [divided, setDivided] = useState(true)
  const [showHeader, setShowHeader] = useState(false)

  const intrinsic = RMI_FACTORS.filter((f) => f.kind === 'intrinsic')
  const extrinsic = RMI_FACTORS.filter((f) => f.kind === 'extrinsic')
  const dietMax = Math.max(...BL_DIET_DATA.map((d) => d.value))

  const factorItem = (f) => ({
    icon: showIcon ? RMI_ICONS[f.iconKey] : undefined,
    iconColor: f.color,
    label: f.name,
    sublabel: showSublabel ? f.desc : undefined,
    value: f.score,
    max: f.max,
    color: f.color,
    valueLabel: showValueLabel ? String(f.score) : undefined,
    delta: showDelta ? f.delta : undefined,
  })

  const sharedBarProps = {
    showBar,
    labelWidth: labelWidth || undefined,
    barAlign: barAlign === 'center' ? 'center' : undefined,
    barHeight: barHeight || undefined,
    divided: divided,
  }

  let body
  if (variant === 'simple') {
    body = (
      <BarList
        {...sharedBarProps}
        header={showHeader ? { label: 'Genre', valueLabel: '% of logs' } : undefined}
        items={BL_DIET_DATA.map((d) => ({
          label: d.label,
          value: d.value,
          max: dietMax,
          color: d.color,
          valueLabel: showValueLabel ? `${d.value}%` : undefined,
        }))}
      />
    )
  } else if (variant === 'grouped') {
    body = (
      <BarList
        {...sharedBarProps}
        layout={layout}
        groups={[
          { label: 'Intrinsic', labelColor: '#F26430', items: intrinsic.map(factorItem) },
          { label: 'Extrinsic', labelColor: '#7CB5F5', items: extrinsic.map(factorItem) },
        ]}
      />
    )
  } else {
    body = (
      <BarList
        {...sharedBarProps}
        items={intrinsic.slice(0, 4).map((f, i) => ({
          prefix: showPrefix ? BL_GRADE_BANDS[i] : undefined,
          ...factorItem(f),
        }))}
      />
    )
  }

  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="simple">simple</option>
            <option value="grouped">grouped</option>
            <option value="iconList">iconList</option>
          </Select>
        </Field>
        <Field label="showBar">
          <Toggle checked={showBar} onChange={setShowBar} />
        </Field>
        {variant === 'grouped' && (
          <Field label="layout">
            <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
              <option value="stack">stack</option>
              <option value="columns">columns</option>
            </Select>
          </Field>
        )}
        {variant !== 'simple' && (
          <Field label="showIcon">
            <Toggle checked={showIcon} onChange={setShowIcon} />
          </Field>
        )}
        {variant !== 'simple' && (
          <Field label="showSublabel">
            <Toggle checked={showSublabel} onChange={setShowSublabel} />
          </Field>
        )}
        {variant !== 'simple' && (
          <Field label="showDelta">
            <Toggle checked={showDelta} onChange={setShowDelta} />
          </Field>
        )}
        {variant === 'iconList' && (
          <Field label="showPrefix">
            <Toggle checked={showPrefix} onChange={setShowPrefix} />
          </Field>
        )}
        <Field label="showValueLabel">
          <Toggle checked={showValueLabel} onChange={setShowValueLabel} />
        </Field>
        <Field label="labelWidth (0 = auto)">
          <Input
            type="number"
            min="0"
            max="240"
            value={labelWidth}
            onChange={(e) => setLabelWidth(Number(e.target.value))}
          />
        </Field>
        <Field label="barAlign">
          <Select value={barAlign} onChange={(e) => setBarAlign(e.target.value)}>
            <option value="start">start</option>
            <option value="center">center (funnel)</option>
          </Select>
        </Field>
        <Field label="barHeight (0 = default 6px)">
          <Input
            type="number"
            min="0"
            max="48"
            value={barHeight}
            onChange={(e) => setBarHeight(Number(e.target.value))}
          />
        </Field>
        {variant === 'simple' && (
          <Field label="divided">
            <Toggle checked={divided} onChange={setDivided} />
          </Field>
        )}
        {variant === 'simple' && (
          <Field label="header row">
            <Toggle checked={showHeader} onChange={setShowHeader} />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <ChartCard
          title={
            variant === 'simple'
              ? 'Reading Diet Breakdown'
              : variant === 'grouped'
                ? 'RMI Factor Breakdown'
                : 'Top Factor by Grade Band'
          }
          subtitle={
            variant === 'simple'
              ? 'Genre distribution'
              : variant === 'grouped'
                ? 'All 10 factors · scored 1–4'
                : 'What drives readers most'
          }
          accent={variant === 'simple' ? '#B43DD0' : '#F26430'}
          bodyPad="padded"
          span={variant === 'iconList' ? 1 : 2}
        >
          {body}
        </ChartCard>
      </div>
    </>
  )
}

function StatCardShowcase() {
  return (
    <>
      <Variant label="plain (default) — no icon, just the figure over its label">
        <div className="rc-stats-row" style={{ '--rc-stats-cols': 2 }}>
          <StatCard label="Minutes" value="3,252" color="var(--c-orange)" />
          <StatCard label="Active Readers" value="1,204" color="var(--c-yellow)" />
          <StatCard label="Lexile Average" value="665L" color="var(--c-purple)" />
          <StatCard label="Logged Every Day" value={38} color="var(--c-green)" />
        </div>
      </Variant>

      <Variant label="action — a link at the foot, for the stats that lead somewhere">
        <div className="rc-stats-row" style={{ '--rc-stats-cols': 2 }}>
          <StatCard
            label="Minutes"
            value="3,252"
            color="var(--c-orange)"
            action={{ label: 'Insights', href: '#/cards/stat-card' }}
          />
          <StatCard
            label="Lexile Average"
            value="665L"
            color="var(--c-purple)"
            action={{ label: 'Lexile Insights', href: '#/cards/stat-card' }}
          />
          <StatCard
            label="Logged Every Day"
            value={38}
            color="var(--c-green)"
            action={{ label: 'Number Cruncher', href: '#/cards/stat-card' }}
          />
          <StatCard
            label="Active Readers"
            value="1,204"
            color="var(--c-yellow)"
            action={{ label: 'Insights', href: '#/cards/stat-card' }}
          />
        </div>
      </Variant>

      <Variant label="icon — optional; the tile reads fine without one">
        <div className="rc-stats-row" style={{ '--rc-stats-cols': 2 }}>
          <StatCard
            label="Completed titles"
            value={12}
            color="var(--c-purple)"
            icon={<PlumpyIcon name="book" size={40} />}
          />
          <StatCard
            label="Reading time"
            value="3,043"
            unit="Minutes"
            color="var(--c-yellow)"
            icon={<PlumpyIcon name="clock" size={40} />}
          />
        </div>
      </Variant>

      <Variant label="trend — spread into a TrendChip, not a bare number">
        <div className="rc-stats-row" style={{ '--rc-stats-cols': 3 }}>
          <StatCard
            value={490}
            label="Words collected"
            color="var(--c-teal)"
            trend={{ delta: 101, format: (n) => `${n} in the last 7 days` }}
          />
          <StatCard
            value={12}
            label="Sessions flagged"
            color="var(--c-orange)"
            trend={{ delta: -3, inverse: true, format: (n) => `${n} fewer` }}
          />
          <StatCard
            value={68}
            unit="%"
            label="Logging weekly"
            color="var(--c-green)"
            trend={{ delta: 7, format: (n) => `${n}%`, showValue: true }}
          />
        </div>
      </Variant>
    </>
  )
}

function ChartCardShowcase() {
  return (
    <>
      <Variant label="title, subtitle, icon and accent">
        <ChartCard
          title="Minutes by grade"
          subtitle="This school year"
          icon={<Icon name="chart-bar" size={18} />}
          accent="var(--c-teal)"
        >
          <CardNote icon="info">
            The body is flush by default — children own their padding.
          </CardNote>
        </ChartCard>
      </Variant>

      <Variant label='bodyPad="padded" — the card supplies the padding'>
        <ChartCard title="Reading health" bodyPad="padded" accent="var(--c-green)">
          Body content sits on the card&apos;s own padding.
        </ChartCard>
      </Variant>

      <Variant label="info — the app’s own header affordance (hover the i)">
        <ChartCard
          title="Sessions to review"
          subtitle="12 flagged this week"
          info="Counts every session a reader flagged, plus anything the integrity rules caught."
          footer="Updated nightly"
          bodyPad="padded"
        >
          In the product the module title itself links to the detail view, and this slot holds the
          tooltip.
        </ChartCard>
      </Variant>

      <Variant label="action — for the cases that need a control instead">
        <ChartCard
          title="Sessions to review"
          subtitle="12 flagged this week"
          action={{ label: 'View all', href: '#/cards/chart-card' }}
          bodyPad="padded"
        >
          Pass <code>{'{ label, href }'}</code> for the standard chevron link, or any node to put
          your own control in the slot.
        </ChartCard>
      </Variant>
    </>
  )
}

const STAT_ICONS = ['none', 'book', 'reading', 'clock', 'calendar', 'fire', 'trophy', 'vocabulary']

function StatCardKnobs() {
  const [value, setValue] = useState('3,252')
  const [unit, setUnit] = useState('')
  const [label, setLabel] = useState('Minutes')
  const [color, setColor] = useState('#F26430')
  const [iconKey, setIconKey] = useState('clock')
  const [actionLabel, setActionLabel] = useState('Insights')
  const [showAction, setShowAction] = useState(true)
  const [showTrend, setShowTrend] = useState(false)
  const [trendDelta, setTrendDelta] = useState(7)
  const [showValueOnTrend, setShowValueOnTrend] = useState(false)
  const [footer, setFooter] = useState('')

  return (
    <>
      <Knobs>
        <Field label="value">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="unit">
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Minutes" />
        </Field>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="icon">
          <Select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
            {STAT_ICONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="color">
          <ColorInput chip size="sm" value={color} onChange={setColor} />
        </Field>
        <Field label="action label">
          <Input value={actionLabel} onChange={(e) => setActionLabel(e.target.value)} />
        </Field>
        <Field label="footer">
          <Input
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            placeholder="79% of the class"
          />
        </Field>
        <Field label="trend delta">
          <Input
            type="range"
            min="-40"
            max="40"
            value={trendDelta}
            onChange={(e) => setTrendDelta(Number(e.target.value))}
          />
        </Field>
        <Field label="action">
          <Toggle checked={showAction} onChange={setShowAction} />
        </Field>
        <Field label="trend">
          <Toggle checked={showTrend} onChange={setShowTrend} />
        </Field>
        <Field label="trend showValue">
          <Toggle checked={showValueOnTrend} onChange={setShowValueOnTrend} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <div className="rc-stats-row" style={{ '--rc-stats-cols': 2 }}>
          <StatCard
            value={value}
            unit={unit || undefined}
            label={label}
            footer={footer || undefined}
            color={color}
            icon={iconKey === 'none' ? undefined : <PlumpyIcon name={iconKey} size={40} />}
            action={
              showAction && actionLabel
                ? { label: actionLabel, href: '#/cards/stat-card' }
                : undefined
            }
            trend={
              showTrend
                ? { delta: trendDelta, format: (n) => `${n}%`, showValue: showValueOnTrend }
                : undefined
            }
          />
        </div>
      </div>
    </>
  )
}

const CHART_TREND = [
  { month: 'Sep', school: 64, district: 68 },
  { month: 'Oct', school: 65, district: 69 },
  { month: 'Nov', school: 67, district: 71 },
  { month: 'Dec', school: 66, district: 70 },
  { month: 'Jan', school: 68, district: 72 },
  { month: 'Feb', school: 69, district: 74 },
  { month: 'Mar', school: 68, district: 73 },
  { month: 'Apr', school: 70, district: 75 },
  { month: 'May', school: 71, district: 76 },
]

// Imports for the chart components live at top — re-export shortcuts here
// (declared lazily so we don't blow up the import block at the very top)

// ── Form showcase pieces ─────────────────────────────────────────────────

function ChartCardKnobs() {
  const [title, setTitle] = useState('Reading Motivation Index')
  const [subtitle, setSubtitle] = useState('Sep 2024 – May 2025')
  const [accent, setAccent] = useState('#F26430')
  const [showIcon, setShowIcon] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showAction, setShowAction] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [bodyPad, setBodyPad] = useState('padded')
  const [span, setSpan] = useState('1')
  const [capHeight, setCapHeight] = useState(false)

  const icon = HEALTH_SECTIONS.find((s) => s.key === 'motivation')?.icon
  return (
    <>
      <Knobs>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="subtitle">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Field>
        <Field label="accent" className="pt-knob-color">
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
        </Field>
        <Field label="bodyPad">
          <Select value={bodyPad} onChange={(e) => setBodyPad(e.target.value)}>
            <option value="flush">flush</option>
            <option value="padded">padded</option>
          </Select>
        </Field>
        <Field label="span">
          <Select value={span} onChange={(e) => setSpan(e.target.value)}>
            <option value="1">1 (normal)</option>
            <option value="2">2 (wide)</option>
          </Select>
        </Field>
        <Field label="bodyMaxHeight">
          <Toggle checked={capHeight} onChange={setCapHeight} />
        </Field>
        <Field label="icon">
          <Toggle checked={showIcon} onChange={setShowIcon} />
        </Field>
        <Field label="info">
          <Toggle checked={showInfo} onChange={setShowInfo} />
        </Field>
        <Field label="action">
          <Toggle checked={showAction} onChange={setShowAction} />
        </Field>
        <Field label="footer">
          <Toggle checked={showFooter} onChange={setShowFooter} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title={title}
          subtitle={subtitle}
          accent={accent}
          span={Number(span)}
          bodyMaxHeight={capHeight ? 120 : undefined}
          icon={showIcon ? icon : undefined}
          action={showAction ? { label: 'View all', href: '#/cards/chart-card' } : undefined}
          info={showInfo ? `What "${title}" counts, and over what window.` : undefined}
          bodyPad={bodyPad}
          footer={
            showFooter ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'This school' },
                  { color: '#D0D0D0', label: 'District avg', dashed: true },
                ]}
              />
            ) : undefined
          }
        >
          <div style={{ color: '#ACACAC', textAlign: 'center', padding: '32px 0' }}>
            {bodyPad === 'flush' ? 'Chart goes here (flush)' : 'Padded content goes here'}
            {capHeight && (
              <div style={{ marginTop: 16 }}>
                More content below the cap — scroll to see it (bodyMaxHeight = 120px).
                <br />
                <br />
                Line 1<br />
                Line 2<br />
                Line 3<br />
                Line 4<br />
                Line 5
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </>
  )
}

const TC_DATA = [
  { month: 'Sep', district: 68, school: 64, secondary: 22 },
  { month: 'Oct', district: 70, school: 67, secondary: 25 },
  { month: 'Nov', district: 71, school: 70, secondary: 24 },
  { month: 'Dec', district: 69, school: 72, secondary: 26 },
  { month: 'Jan', district: 73, school: 75, secondary: 30 },
  { month: 'Feb', district: 75, school: 76, secondary: 32 },
  { month: 'Mar', district: 76, school: 78, secondary: 33 },
  { month: 'Apr', district: 77, school: 79, secondary: 35 },
  { month: 'May', district: 78, school: 81, secondary: 38 },
]

const TC_HBAR_DATA = [
  { name: 'Adams High', completionRate: 88, isThis: false },
  { name: 'Jefferson El.', completionRate: 82, isThis: false },
  { name: 'Kennedy K-8', completionRate: 77, isThis: false },
  { name: 'Roosevelt Mid.', completionRate: 75, isThis: false },
  { name: 'Lincoln El.', completionRate: 71, isThis: true },
  { name: 'Washington Mid.', completionRate: 62, isThis: false },
]

function TrendChartKnobs() {
  const [type, setType] = useState('area')
  const [layout, setLayout] = useState('vertical')
  const [height, setHeight] = useState('md')
  const [dualAxis, setDualAxis] = useState(false)
  const [accent, setAccent] = useState('#0CA7BC')
  const [yUnit, setYUnit] = useState('')
  const [yMin, setYMin] = useState(60)
  const [yMax, setYMax] = useState(90)
  const [yTickCount, setYTickCount] = useState(5)
  const [yAxisHidden, setYAxisHidden] = useState(false)
  const [leftMargin, setLeftMargin] = useState(128)
  const [dashed, setDashed] = useState(true)
  const [strokeWidth, setStrokeWidth] = useState(2.5)
  const [fillOpacity, setFillOpacity] = useState(0.2)

  const isHorizontal = type === 'bar' && layout === 'horizontal'

  return (
    <>
      <Knobs>
        <Field label="type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="area">area</option>
            <option value="line">line</option>
            <option value="bar">bar</option>
          </Select>
        </Field>
        {type === 'bar' && (
          <Field label="layout">
            <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
            </Select>
          </Field>
        )}
        <Field label="height">
          <Select value={height} onChange={(e) => setHeight(e.target.value)}>
            <option value="sm">sm (180)</option>
            <option value="md">md (240)</option>
            <option value="lg">lg (320)</option>
            <option value="xl">xl (380)</option>
          </Select>
        </Field>
        <Field label="accent">
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
        </Field>
        <Field label="yUnit">
          <Select value={yUnit} onChange={(e) => setYUnit(e.target.value)}>
            <option value="">none</option>
            <option value="%">%</option>
            <option value="L">L</option>
            <option value=" pts"> pts</option>
          </Select>
        </Field>
        {!isHorizontal && (
          <Field label="yDomain min">
            <Input type="number" value={yMin} onChange={(e) => setYMin(Number(e.target.value))} />
          </Field>
        )}
        {!isHorizontal && (
          <Field label="yDomain max">
            <Input type="number" value={yMax} onChange={(e) => setYMax(Number(e.target.value))} />
          </Field>
        )}
        {!isHorizontal && (
          <Field label="yTickCount">
            <Input
              type="number"
              value={yTickCount}
              onChange={(e) => setYTickCount(Number(e.target.value))}
            />
          </Field>
        )}
        {!isHorizontal && (
          <Field label="yAxisHidden">
            <Toggle checked={yAxisHidden} onChange={setYAxisHidden} />
          </Field>
        )}
        {isHorizontal && (
          <Field label="leftMargin">
            <Input
              type="number"
              value={leftMargin}
              onChange={(e) => setLeftMargin(Number(e.target.value))}
            />
          </Field>
        )}
        {!isHorizontal && (
          <Field label="dual Y axis">
            <Toggle checked={dualAxis} onChange={setDualAxis} />
          </Field>
        )}
        {!isHorizontal && (
          <Field label="series dashed">
            <Toggle checked={dashed} onChange={setDashed} />
          </Field>
        )}
        {!isHorizontal && (
          <Field label="strokeWidth">
            <RangeSlider min={1} max={5} step={0.5} value={strokeWidth} onChange={setStrokeWidth} />
          </Field>
        )}
        {type === 'area' && (
          <Field label="fillOpacity">
            <RangeSlider
              min={0}
              max={1}
              step={0.05}
              value={fillOpacity}
              onChange={setFillOpacity}
            />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="RMI Trend"
          subtitle="District vs. school · Sep 2024 – May 2025"
          accent={accent}
          bodyPad="padded"
          span={2}
        >
          {isHorizontal ? (
            <TrendChart
              type="bar"
              layout="horizontal"
              data={TC_HBAR_DATA}
              xKey="name"
              yDomain={[0, 100]}
              yUnit={yUnit || '%'}
              yTicks={[0, 25, 50, 75, 100]}
              height={height}
              leftMargin={leftMargin}
              tooltipFormatter={(v) => `${v}%`}
              series={[
                {
                  key: 'completionRate',
                  name: 'Completion',
                  color: '#D0D0D0',
                  colorFn: (d) => (d.isThis ? accent : '#D0D0D0'),
                },
              ]}
            />
          ) : (
            <TrendChart
              type={type}
              data={TC_DATA}
              yDomain={[yMin, yMax]}
              yUnit={yUnit || undefined}
              yTickCount={yTickCount || undefined}
              yAxisHidden={yAxisHidden}
              height={height}
              yRight={dualAxis ? { domain: [20, 45] } : undefined}
              xPadding={type === 'bar' ? { left: 12, right: 12 } : undefined}
              series={[
                {
                  key: 'district',
                  name: 'District avg',
                  color: accent,
                  strokeWidth,
                  fillOpacity,
                },
                { key: 'school', name: 'School', color: '#196DD5', dashed },
                ...(dualAxis
                  ? [
                      {
                        key: 'secondary',
                        name: 'Incidents',
                        color: '#F26430',
                        yAxisId: 'right',
                        dashed: true,
                        strokeWidth: 2,
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </ChartCard>
      </div>
    </>
  )
}

function LineChartKnobs() {
  const [curve, setCurve] = useState('monotoneX')
  const [showArea, setArea] = useState(false)
  const [showPoints, setPoints] = useState(false)
  const [showLegend, setLegend] = useState(true)
  const [showAxes, setAxes] = useState(false)
  const [accent, setAccent] = useState('#F26430')

  const xLegend = showAxes ? 'Month' : undefined
  const yLegend = showAxes ? 'RMI score' : undefined
  return (
    <>
      <Knobs>
        <Field label="curve">
          <Select value={curve} onChange={(e) => setCurve(e.target.value)}>
            <option>monotoneX</option>
            <option>linear</option>
            <option>step</option>
            <option>natural</option>
          </Select>
        </Field>
        <Field label="accent">
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
        </Field>
        <Field label="area fill">
          <Toggle checked={showArea} onChange={setArea} />
        </Field>
        <Field label="points">
          <Toggle checked={showPoints} onChange={setPoints} />
        </Field>
        <Field label="axis legends">
          <Toggle checked={showAxes} onChange={setAxes} />
        </Field>
        <Field label="legend">
          <Toggle checked={showLegend} onChange={setLegend} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="RMI Trend — Lincoln vs. District"
          subtitle="Sep 2024 – May 2025"
          icon={HEALTH_SECTIONS.find((s) => s.key === 'motivation')?.icon}
          accent={accent}
          footer={
            showLegend ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'Lincoln' },
                  { color: '#D0D0D0', label: 'District avg', dashed: true },
                ]}
              />
            ) : undefined
          }
        >
          <div style={{ height: 220 }}>
            <ResponsiveLine
              data={[
                {
                  id: 'Lincoln',
                  color: accent,
                  data: CHART_TREND.map((d) => ({ x: d.month, y: d.school })),
                },
                {
                  id: 'District avg',
                  color: '#D0D0D0',
                  data: CHART_TREND.map((d) => ({ x: d.month, y: d.district })),
                },
              ]}
              theme={NIVO_THEME}
              margin={{ top: 12, right: 24, bottom: showAxes ? 48 : 32, left: showAxes ? 64 : 36 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 55, max: 90 }}
              curve={curve}
              colors={(d) => d.color}
              lineWidth={2.5}
              enablePoints={showPoints}
              pointSize={6}
              enableArea={showArea}
              areaBaselineValue={55}
              areaOpacity={0.08}
              enableGridX={false}
              axisBottom={{
                ...AXIS_BOTTOM,
                legend: xLegend,
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                ...AXIS_LEFT,
                tickValues: [60, 70, 80, 90],
                legend: yLegend,
                legendOffset: -48,
                legendPosition: 'middle',
              }}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={accent}
                  allData={CHART_TREND}
                  seriesMap={{ Lincoln: 'school', 'District avg': 'district' }}
                  formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pts`}
                />
              )}
            />
          </div>
        </ChartCard>
      </div>
    </>
  )
}

const GROUPED_BAR_DATA = [
  { month: 'Sep', intrinsic: 12.1, extrinsic: 11.4 },
  { month: 'Oct', intrinsic: 12.4, extrinsic: 11.5 },
  { month: 'Nov', intrinsic: 12.8, extrinsic: 11.6 },
  { month: 'Dec', intrinsic: 12.6, extrinsic: 11.5 },
  { month: 'Jan', intrinsic: 13.1, extrinsic: 11.6 },
  { month: 'Feb', intrinsic: 13.5, extrinsic: 11.7 },
  { month: 'Mar', intrinsic: 13.7, extrinsic: 11.6 },
  { month: 'Apr', intrinsic: 14.0, extrinsic: 11.7 },
  { month: 'May', intrinsic: 14.2, extrinsic: 11.8 },
]

function GroupedBarKnobs() {
  const [mode, setMode] = useState('grouped')
  const [showLegend, setLegend] = useState(true)
  const [decimals, setDecimals] = useState('1')
  const [showAxes, setAxes] = useState(false)
  const [accent, setAccent] = useState('#F26430')

  const dec = Number(decimals) || 0
  const formatVal = (v) => v.toFixed(dec)
  // Widest possible y-tick label width: "##." + dec digits @ ~7px char width
  const sampleTick = formatVal(mode === 'stacked' ? 30 : 16)
  const tickPx = sampleTick.length * 8 + 14
  const leftMargin = (showAxes ? 32 : 0) + tickPx

  const xLegend = showAxes ? 'Month' : undefined
  const yLegend = showAxes ? 'Score / 20' : undefined
  return (
    <>
      <Knobs>
        <Field label="groupMode">
          <Select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>grouped</option>
            <option>stacked</option>
          </Select>
        </Field>
        <Field label="decimals">
          <Select value={decimals} onChange={(e) => setDecimals(e.target.value)}>
            <option>0</option>
            <option>1</option>
            <option>2</option>
          </Select>
        </Field>
        <Field label="accent">
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
        </Field>
        <Field label="axis legends">
          <Toggle checked={showAxes} onChange={setAxes} />
        </Field>
        <Field label="legend">
          <Toggle checked={showLegend} onChange={setLegend} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="Intrinsic vs. Extrinsic Motivation"
          subtitle="RMI subscores out of 20"
          icon={HEALTH_SECTIONS.find((s) => s.key === 'motivation')?.icon}
          accent={accent}
          footer={
            showLegend ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'Intrinsic' },
                  { color: '#D0D0D0', label: 'Extrinsic' },
                ]}
              />
            ) : undefined
          }
        >
          <div style={{ height: 200 }}>
            <ResponsiveBar
              data={GROUPED_BAR_DATA}
              keys={['intrinsic', 'extrinsic']}
              indexBy="month"
              groupMode={mode}
              theme={NIVO_THEME}
              margin={{ top: 12, right: 20, bottom: showAxes ? 48 : 32, left: leftMargin }}
              padding={0.3}
              innerPadding={2}
              colors={({ id }) => (id === 'intrinsic' ? accent : '#D0D0D0')}
              borderRadius={3}
              axisBottom={{
                ...AXIS_BOTTOM,
                legend: xLegend,
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                ...AXIS_LEFT,
                format: formatVal,
                tickValues: 5,
                legend: yLegend,
                legendOffset: -(leftMargin - 16),
                legendPosition: 'middle',
              }}
              enableGridY
              enableLabel={false}
              minValue={mode === 'stacked' ? 0 : 9}
              maxValue={mode === 'stacked' ? 30 : 16}
              tooltip={({ indexValue, data }) => (
                <BarTooltip
                  data={data}
                  indexValue={indexValue}
                  accent={accent}
                  format={(v) => `${formatVal(v)} /20`}
                  keys={['intrinsic', 'extrinsic']}
                  labels={{
                    intrinsic: { label: 'Intrinsic', color: accent },
                    extrinsic: { label: 'Extrinsic', color: '#D0D0D0' },
                  }}
                />
              )}
            />
          </div>
        </ChartCard>
      </div>
    </>
  )
}

const H_BAR_DATA = [
  { id: 'adams', name: 'Adams High', completionRate: 96, isThis: false },
  { id: 'jefferson', name: 'Jefferson El.', completionRate: 88, isThis: false },
  { id: 'kennedy', name: 'Kennedy K-8', completionRate: 80, isThis: false },
  { id: 'roosevelt', name: 'Roosevelt Mid.', completionRate: 73, isThis: false },
  { id: 'lincoln', name: 'Lincoln El.', completionRate: 64, isThis: true },
  { id: 'washington', name: 'Washington Mid.', completionRate: 51, isThis: false },
]

function HorizontalBarKnobs() {
  const [showValueLabel, setVL] = useState(false)
  const [showAxes, setAxes] = useState(false)
  const [showLegend, setLegend] = useState(true)
  const [accent, setAccent] = useState('#F26430')

  // Derive left margin from the widest y-axis label (school name)
  const widestLabel = H_BAR_DATA.reduce((m, d) => Math.max(m, d.name.length), 0)
  const leftMargin = widestLabel * 7 + 24 + (showAxes ? 32 : 0)
  // Right margin: room for the last x-axis tick "100%" (centered on its position,
  // so half spills past the chart area) plus optional inline value labels on the bars.
  const rightMargin = showValueLabel ? 72 : 56

  const xLegend = showAxes ? 'Completion rate' : undefined
  const yLegend = showAxes ? 'School' : undefined

  return (
    <>
      <Knobs>
        <Field label="accent">
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
        </Field>
        <Field label="value labels">
          <Toggle checked={showValueLabel} onChange={setVL} />
        </Field>
        <Field label="axis legends">
          <Toggle checked={showAxes} onChange={setAxes} />
        </Field>
        <Field label="legend">
          <Toggle checked={showLegend} onChange={setLegend} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="District integrity ranking"
          subtitle="Book Talk completion rate · May 2025"
          icon={HEALTH_SECTIONS.find((s) => s.key === 'integrity')?.icon}
          accent="#196DD5"
          footer={
            showLegend ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'This school' },
                  { color: '#D0D0D0', label: 'Other schools' },
                ]}
              />
            ) : undefined
          }
        >
          <div style={{ height: 240 }}>
            <ResponsiveBar
              data={H_BAR_DATA}
              keys={['completionRate']}
              indexBy="name"
              layout="horizontal"
              theme={NIVO_THEME}
              margin={{ top: 12, right: rightMargin, bottom: showAxes ? 48 : 32, left: leftMargin }}
              colors={({ data }) => (data.isThis ? accent : '#D0D0D0')}
              borderRadius={4}
              axisBottom={{
                ...AXIS_BOTTOM,
                format: (v) => `${v}%`,
                tickValues: [0, 25, 50, 75, 100],
                legend: xLegend,
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                legend: yLegend,
                legendOffset: -(leftMargin - 16),
                legendPosition: 'middle',
              }}
              enableGridY={false}
              enableLabel={showValueLabel}
              label={(d) => `${d.value}%`}
              labelTextColor="#2A2A2A"
              maxValue={100}
              tooltip={({ data }) => (
                <div
                  className="sdb-tooltip"
                  style={{ '--tip-accent': data.isThis ? accent : '#196DD5' }}
                >
                  <div className="sdb-tooltip-header">{data.name}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{ '--series-color': data.isThis ? accent : '#ACACAC' }}
                  >
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Completion rate</span>
                      <span className="sdb-tooltip-val">{data.completionRate}%</span>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </ChartCard>
      </div>
    </>
  )
}

function ScatterKnobs() {
  const [accent, setAccent] = useState('#F26430')
  const [yTicks, setYTicks] = useState('5')
  const [showRef, setRef] = useState(true)
  const [showAxes, setAxes] = useState(true)
  const [showLegend, setLegend] = useState(true)

  const xLabel = showAxes ? 'Avg books / month' : undefined
  const yLabel = showAxes ? 'Lexile growth' : undefined
  return (
    <>
      <Knobs>
        <Field label="accent">
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
        </Field>
        <Field label="y ticks">
          <Select value={yTicks} onChange={(e) => setYTicks(e.target.value)}>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </Select>
        </Field>
        <Field label="ref line">
          <Toggle checked={showRef} onChange={setRef} />
        </Field>
        <Field label="axis legends">
          <Toggle checked={showAxes} onChange={setAxes} />
        </Field>
        <Field label="legend">
          <Toggle checked={showLegend} onChange={setLegend} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="Lexile Growth vs. Reading Volume"
          subtitle="Lincoln highlighted against district peers"
          icon={HEALTH_SECTIONS.find((s) => s.key === 'skills')?.icon}
          accent="#B43DD0"
          footer={
            showLegend ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'This school' },
                  { color: '#D0D0D0', label: 'Other schools' },
                  ...(showRef
                    ? [{ color: '#AB720A', label: 'Expected (+65L)', dashed: true }]
                    : []),
                ]}
              />
            ) : undefined
          }
        >
          <div style={{ height: 260 }}>
            <ResponsiveScatterPlot
              data={[
                {
                  id: 'This school',
                  data: [{ x: 41, y: 8, school: 'Lincoln', students: 1650, sid: 'lincoln' }],
                },
                {
                  id: 'Other schools',
                  data: [
                    { x: 38, y: 62, school: 'Jefferson', students: 1820, sid: 'jefferson' },
                    { x: 35, y: 74, school: 'Kennedy', students: 2340, sid: 'kennedy' },
                    { x: 28, y: 88, school: 'Roosevelt', students: 2100, sid: 'roosevelt' },
                    { x: 24, y: 22, school: 'Washington', students: 1980, sid: 'washington' },
                    { x: 22, y: 112, school: 'Adams', students: 2510, sid: 'adams' },
                  ],
                },
              ]}
              theme={NIVO_THEME}
              margin={{ top: 16, right: 28, bottom: showAxes ? 52 : 32, left: showAxes ? 76 : 44 }}
              xScale={{ type: 'linear', min: 15, max: 50 }}
              yScale={{ type: 'linear', min: 0, max: 130 }}
              colors={({ serieId }) => (serieId === 'This school' ? accent : '#D0D0D0')}
              nodeSize={(d) => Math.sqrt(d.data.students / 5)}
              axisBottom={{
                ...AXIS_BOTTOM,
                legend: xLabel,
                legendOffset: 40,
                legendPosition: 'middle',
                tickValues: 5,
              }}
              axisLeft={{
                ...AXIS_LEFT,
                format: (v) => `${v}L`,
                legend: yLabel,
                legendOffset: -60,
                legendPosition: 'middle',
                tickValues: Number(yTicks) || 5,
              }}
              enableGridX={false}
              markers={
                showRef
                  ? [
                      {
                        axis: 'y',
                        value: 65,
                        lineStyle: { stroke: '#AB720A', strokeDasharray: '4 3', strokeWidth: 1.5 },
                      },
                    ]
                  : []
              }
              tooltip={({ node }) => (
                <div
                  className="sdb-tooltip"
                  style={{ '--tip-accent': node.data.sid === 'lincoln' ? accent : '#656565' }}
                >
                  <div className="sdb-tooltip-header">{node.data.school}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{ '--series-color': node.data.sid === 'lincoln' ? accent : '#ACACAC' }}
                  >
                    <div className="sdb-tooltip-row">
                      <span className="sdb-tooltip-dot" />
                      <span className="sdb-tooltip-label">Lexile growth</span>
                      <span className="sdb-tooltip-val">+{node.data.y}L</span>
                    </div>
                  </div>
                  <div className="sdb-tooltip-context">
                    {node.data.students.toLocaleString()} students
                  </div>
                </div>
              )}
            />
          </div>
        </ChartCard>
      </div>
    </>
  )
}

function ChartLegendKnobs() {
  const [layout, setLayout] = useState('row')
  const [items, setItems] = useState('3')
  const palette = [
    { color: '#F26430', label: 'Lincoln' },
    { color: '#D0D0D0', label: 'District avg', dashed: true },
    { color: '#0BA85F', label: 'Target' },
    { color: '#B43DD0', label: 'Top quartile' },
    { color: '#0CA7BC', label: 'Elementary' },
  ]
  const visible = palette.slice(0, Number(items) || 2)
  return (
    <>
      <Knobs>
        <Field label="orientation">
          <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option>row</option>
            <option>column</option>
          </Select>
        </Field>
        <Field label="items">
          <Select value={items} onChange={(e) => setItems(e.target.value)}>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame" style={layout === 'column' ? {} : undefined}>
        <div
          style={{
            display: 'flex',
            flexDirection: layout === 'column' ? 'column' : 'row',
            gap: layout === 'column' ? 6 : 16,
            flexWrap: 'wrap',
          }}
        >
          <ChartLegend items={visible} />
        </div>
      </div>
    </>
  )
}

// ── Breakpoint indicator (fixed corner pill) ─────────────────────────────

// CardNote is meant to sit in a card body, and `accent` reads off the card's
// --rc-accent — so the examples show it in one rather than free-floating.
function CardNoteShowcase() {
  return (
    <>
      <Variant label="tones — each one of the app’s own infoboxes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <CardNote>Averaged across the last 30 days.</CardNote>
          <CardNote tone="info">
            Readers who log three days running are <strong>2×</strong> as likely to finish.
          </CardNote>
          <CardNote tone="warning">
            Two classes haven&apos;t logged since Friday — the figure above excludes them.
          </CardNote>
          <CardNote tone="success">Every class has logged this week.</CardNote>
          <CardNote tone="error">Sync failed last night; this is Thursday&apos;s data.</CardNote>
        </div>
      </Variant>

      <Variant label="icon — each tone brings its own, or pass one">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <CardNote tone="info" icon="bulb">
            An overridden glyph, for a note that isn&apos;t quite &ldquo;information&rdquo;.
          </CardNote>
          <CardNote tone="info" icon={false}>
            <code>icon={'{false}'}</code> drops it entirely.
          </CardNote>
          <CardNote icon="clock">
            Neutral has no glyph by default — pass one when it earns its place.
          </CardNote>
        </div>
      </Variant>

      <Variant label="in a card — accent picks up the card’s --rc-accent">
        <ChartCard title="Minutes by grade" accent="var(--c-teal)">
          <CardNote tone="accent">Up 12% on last month.</CardNote>
        </ChartCard>
      </Variant>
    </>
  )
}

// The glyphs a note actually reaches for: what this is, what to do about it,
// what to watch out for, and when it updates.
const NOTE_ICONS = ['default', 'none', 'info', 'bulb', 'alert-triangle', 'clock', 'check', 'flame']

function CardNoteKnobs() {
  const [tone, setTone] = useState('neutral')
  const [icon, setIcon] = useState('default')
  const [bodyPad, setBodyPad] = useState('padded')
  const [text, setText] = useState(
    'Intrinsic subscore rose from 12.1 to 14.2 /20, outpacing extrinsic motivation.',
  )
  return (
    <>
      <Knobs>
        <Field label="tone">
          <Select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="neutral">neutral</option>
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="success">success</option>
            <option value="error">error</option>
            <option value="accent">accent</option>
          </Select>
        </Field>
        <Field label="icon">
          <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
            {NOTE_ICONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="card bodyPad">
          <Select value={bodyPad} onChange={(e) => setBodyPad(e.target.value)}>
            <option value="padded">padded</option>
            <option value="flush">flush</option>
          </Select>
        </Field>
        <Field label="text" className="pt-knob-full">
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard title="Note" accent="#F26430" bodyPad={bodyPad}>
          <CardNote
            tone={tone}
            icon={icon === 'default' ? undefined : icon === 'none' ? false : icon}
          >
            {text}
          </CardNote>
        </ChartCard>
      </div>
    </>
  )
}

// A real vocabulary sample, so the cloud is judged at the density it ships at.
const WC_WORDS = [
  ['mischievous', 24],
  ['empathy', 23],
  ['grief', 22],
  ['precept', 20],
  ['desolate', 19],
  ['resilient', 19],
  ['resourceful', 18],
  ['destiny', 18],
  ['legacy', 17],
  ['instinct', 17],
  ['rivalry', 16],
  ['melancholy', 15],
  ['prodigy', 15],
  ['solace', 15],
  ['awkward', 14],
  ['tyrant', 14],
  ['imaginary', 14],
  ['defiance', 13],
  ['momentum', 13],
  ['peculiar', 12],
  ['futile', 12],
  ['suspicion', 12],
  ['clandestine', 11],
  ['ancestor', 11],
  ['conspicuous', 11],
  ['reluctant', 10],
  ['heritage', 10],
  ['earnest', 10],
  ['bargain', 9],
  ['conform', 9],
  ['coincidence', 8],
  ['superstition', 8],
  ['vivid', 7],
  ['infatuated', 7],
  ['narrator', 6],
  ['provisions', 6],
  ['motive', 5],
].map(([text, value]) => ({ text, value }))

function WordCloudKnobs() {
  const [accent, setAccent] = useState('#B43DD0')
  const [height, setHeight] = useState('lg')
  const [maxSize, setMaxSize] = useState(48)
  const [count, setCount] = useState(WC_WORDS.length)
  const [rotate, setRotate] = useState(false)
  const [clickable, setClickable] = useState(true)
  const [picked, setPicked] = useState(null)

  const words = WC_WORDS.slice(0, count)

  return (
    <>
      <Knobs>
        <Field label="Accent">
          <Select value={accent} onChange={(e) => setAccent(e.target.value)}>
            <option value="#B43DD0">Violet</option>
            <option value="#0CA7BC">Turquoise</option>
            <option value="#0BA85F">Green</option>
            <option value="#196DD5">Blue</option>
          </Select>
        </Field>
        <Field label="Height">
          <Select value={height} onChange={(e) => setHeight(e.target.value)}>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
            <option value="xl">xl</option>
          </Select>
        </Field>
        <Field label={`Largest word — ${maxSize}px`}>
          <RangeSlider min={24} max={72} value={maxSize} onChange={setMaxSize} />
        </Field>
        <Field label={`Words — ${count}`}>
          <RangeSlider min={4} max={WC_WORDS.length} value={count} onChange={setCount} />
        </Field>
        <Field label="Turn some words 90°">
          <Toggle checked={rotate} onChange={setRotate} />
        </Field>
        <Field label="Clickable">
          <Toggle checked={clickable} onChange={setClickable} />
        </Field>
      </Knobs>

      <Variant label={picked ? `Selected: ${picked}` : 'Class word wall'}>
        <ChartCard
          title="The class word wall"
          subtitle="Every word the class has collected — the bigger the word, the more students have it"
          accent={accent}
          bodyPad="padded"
        >
          <WordCloud
            words={words}
            accent={accent}
            height={height}
            maxSize={maxSize}
            rotate={rotate ? 0.25 : 0}
            selected={picked}
            valueLabel={(w) => `${w.value} of 24 students`}
            onWordClick={
              clickable ? (w) => setPicked(w.text === picked ? null : w.text) : undefined
            }
          />
        </ChartCard>
      </Variant>
    </>
  )
}

export const chartsSections = [
  {
    group: 'charts',
    id: 'trend-chart',
    name: 'TrendChart',
    usage: `import { TrendChart } from '@components/TrendChart/TrendChart'

<TrendChart
  type="line"
  data={data}
  xKey="month"
  series={[{ key: 'minutes', label: 'Minutes', color: 'var(--c-teal)' }]}
  yUnit="m"
/>`,
    desc: (
      <>
        The default reusable chart for area / line / bar visualizations. Wraps Nivo and locks in the
        project's standard margins, tick font, tooltip styling, axis padding, and height. Pass{' '}
        <code>type</code> (<code>'area' | 'line' | 'bar'</code>
        ), <code>data</code>, <code>xKey</code>, <code>yDomain</code>, <code>height</code> (
        <code>'sm' | 'md' | 'lg' | 'xl'</code>), and a <code>series</code> array of{' '}
        <code>
          {'{ key, name, color, dashed?, fillOpacity?, strokeWidth?, yAxisId?, colorFn? }'}
        </code>
        . Pass <code>yRight</code> for dual-axis trends; pass <code>layout="horizontal"</code> +{' '}
        <code>leftMargin</code> for horizontal-bar rankings. Always use this for new charts — only
        drop down to Nivo directly for one-off shapes like scatter plots or custom layers.
      </>
    ),
    render: () => (
      <>
        <TrendChartKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-line',
    name: 'Line Chart (Nivo)',
    usage: `import { ResponsiveLine } from '@nivo/line'
import { NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT } from '@components/charts/charts'

/* Prefer <TrendChart type="line" /> — drop to raw nivo only for custom layers */
<ResponsiveLine data={series} theme={NIVO_THEME} axisBottom={AXIS_BOTTOM} axisLeft={AXIS_LEFT} />`,
    desc: (
      <>
        Nivo <code>ResponsiveLine</code> + <code>SliceTooltip</code> wrapped in a{' '}
        <code>ChartCard</code>. Used in school-detail pages where the rich Nivo SliceTooltip is
        needed. For new district-level trend lines, prefer <code>TrendChart</code> above.
      </>
    ),
    render: () => (
      <>
        <LineChartKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-bar-grouped',
    name: 'Grouped Bar Chart',
    usage: `import { TrendChart } from '@components/TrendChart/TrendChart'

<TrendChart
  type="bar"
  data={data}
  xKey="grade"
  series={[{ key: 'fall', label: 'Fall' }, { key: 'spring', label: 'Spring' }]}
/>`,
    desc: (
      <>
        Nivo <code>ResponsiveBar</code> with <code>groupMode="grouped"</code> +{' '}
        <code>BarTooltip</code>. Use for side-by-side comparisons — "this school vs district" or
        "actual vs expected".
      </>
    ),
    render: () => (
      <>
        <GroupedBarKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-bar-h',
    name: 'Horizontal Bar Chart',
    usage: `import { TrendChart } from '@components/TrendChart/TrendChart'

<TrendChart type="bar" layout="horizontal" data={data} xKey="title" series={series} />`,
    desc: (
      <>
        Nivo <code>ResponsiveBar</code> with <code>layout="horizontal"</code>. Use for ranked lists
        — school rankings and per-grade growth comparisons.
      </>
    ),
    render: () => (
      <>
        <HorizontalBarKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-scatter',
    name: 'Scatter Chart',
    usage: `import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { NIVO_THEME, AXIS_BOTTOM, AXIS_LEFT } from '@components/charts/charts'

<ResponsiveScatterPlot data={points} theme={NIVO_THEME} axisBottom={AXIS_BOTTOM} axisLeft={AXIS_LEFT} />`,
    desc: (
      <>
        Nivo <code>ResponsiveScatterPlot</code> with a highlighted primary series and a reference
        marker. Used on the Skills (Lexile) page to show individual school positioning.
      </>
    ),
    render: () => (
      <>
        <ScatterKnobs />
      </>
    ),
  },
  {
    group: 'cards',
    id: 'goal-stat',
    name: 'GoalStat',
    usage: `import { GoalStat, GoalStats } from '@components/GoalStat/GoalStat'

<GoalStats>
  {goals.map((g) => (
    <GoalStat key={g.label} goal={g} onClick={() => setTab(g.tab)} />
  ))}
</GoalStats>

/* a requirement with a denominator — a ring around the share done */
{ label: 'Minutes Completed', have: 240, need: 300, tab: 'badges' }
/* a total with nothing to reach — its own glyph and colour in the ring's place */
{ label: 'Total Raised', value: '$95', icon: 'coin', accent: '#0F7A55', tab: 'donations' }`,
    desc: (
      <>
        One tile of an <strong>&ldquo;Overall Progress&rdquo;</strong> strip — the row a challenge
        and a fundraiser both open with (<code>programs/_overview_list_goals</code>,{' '}
        <code>fundraisers/overview/_overall_progress</code>).
        <br />
        <br />
        The app has two shapes and this is both, on the design system&apos;s own{' '}
        <code>StatCard</code> rather than a second stat tile beside it.{' '}
        <strong>A progress tile has a denominator</strong> (<code>_progress_card</code>), so it
        wears a <code>ProgressRing</code> in the icon slot and reads &ldquo;240 / 300&rdquo;; a{' '}
        <strong>total tile has only a count</strong> (<code>_total_card</code>) — badges earned,
        dollars raised — so it takes its own glyph and colour, because a ring around a figure with
        nothing to reach is a decoration pretending to be data. The glyph gets the ring&apos;s cell
        and the tone the ring&apos;s track carries, so a mixed strip lines up instead of alternating
        a drawn disc and a bare glyph.
        <br />
        <br />A finished requirement goes green, ring and figure together. <code>onClick</code> puts
        the whole card in a button, which is what every one of these is in the app: a link to the
        tab that explains its number.
      </>
    ),
    render: () => (
      <Variant label="a mixed strip — three totals and three with a ring" full>
        <div style={{ padding: 20, background: 'var(--c-gray-0)' }}>
          <GoalStats>
            <GoalStat
              goal={{ label: 'Total Raised', value: '$95', icon: 'coin', accent: '#0F7A55' }}
            />
            <GoalStat
              goal={{ label: 'Badges Earned', value: 3, icon: 'award', accent: '#B45309' }}
            />
            <GoalStat
              goal={{ label: 'Rewards Earned', value: 2, icon: 'gift', accent: '#7C5CFA' }}
            />
            <GoalStat goal={{ label: 'Minutes Completed', have: 240, need: 300 }} />
            <GoalStat goal={{ label: 'Activities Completed', have: 3, need: 3 }} />
            <GoalStat goal={{ label: 'Reviews', have: 1, need: 2 }} />
          </GoalStats>
        </div>
      </Variant>
    ),
  },
  {
    group: 'cards',
    id: 'stat-card',
    name: 'StatCard',
    usage: `import { StatCard } from '@components/Cards/Cards'
import '@components/Cards/Cards.css'

/* One shape: the figure, bold, over its label on a tint of \`color\`. */
<StatCard label="Minutes" value="3,252" color="var(--c-orange)" />

/* \`icon\` is optional, and takes a NODE */
<StatCard
  label="Completed titles"
  value={12}
  color="var(--c-purple)"
  icon={<PlumpyIcon name="book" size={40} />}
/>

/* \`action\` — a link at the foot, for the stats that lead somewhere */
<StatCard
  label="Lexile Average"
  value="665L"
  color="var(--c-purple)"
  action={{ label: 'Lexile Insights', href: '/insights/lexile' }}
/>

/* \`trend\` is spread into <TrendChip>, so it takes the chip's own props */
<StatCard
  label="Words collected"
  value={490}
  color="var(--c-teal)"
  trend={{ delta: 101, format: (n) => \`\${n} in the last 7 days\` }}
/>`,
    desc: (
      <>
        The reading-summary tile: a flat pastel card with the figure, bold, over its label. No
        border and no shadow — the fill is the card. <code>color</code> supplies the hue: the fill
        is a light tint of it, and the icon and action take it at full strength, so a caller still
        states one colour. The <code>icon</code> is optional — without one the tile is just figure,
        label and action.
        <br />
        <br />
        <code>action</code> puts a link at the foot of the tile ({'{ label, href }'}), for the stats
        that lead somewhere — Insights, Number Cruncher, a Lexile report.
        <br />
        <br />
        <br />
        <br />
        <code>trend</code> is spread straight into a <code>{'<TrendChip>'}</code>, so it takes that
        component&apos;s own props (<code>{'{ delta, format, suffix, inverse, showValue }'}</code>)
        — not a bare number. Pass it instead of spelling a delta out in <code>footer</code>:
        &ldquo;+101 in the last 7 days&rdquo; beside a 490 puts two numbers on the tile and makes
        the eye pick between them. <code>footer</code> stays for the things that aren&apos;t trends.
        <br />
        <br />
        <code>onClick</code> puts the whole card in a button, for a tile that goes somewhere — the
        hit area is the card rather than the four words in it. Pass it <em>or</em>{' '}
        <code>action</code>, not both.
        <br />
        <br />
        <strong>
          <code>ProgressRing</code>
        </strong>{' '}
        is the icon a requirement with a denominator wears —{' '}
        <code>fundraisers/overview/_progress_card</code> and <code>_overview_list_goals</code>, the
        &ldquo;Overall Progress&rdquo; strip a challenge and a fundraiser both open with. It fills
        whatever the icon slot is, so a strip sizes it by sizing <code>.rc-stat-ico</code>; a
        finished one goes green. It is inline SVG rather than a glyph because{' '}
        <strong>the percentage is the reading</strong> — a number in a footer is not the same thing
        as an arc you take in at a glance. A tile with no denominator gets its own glyph instead: a
        ring around a figure with nothing to reach is a decoration pretending to be data.
      </>
    ),
    render: () => (
      <>
        <StatCardKnobs />
        <StatCardShowcase />
      </>
    ),
  },
  {
    group: 'cards',
    id: 'chart-card',
    name: 'ChartCard',
    usage: `import { ChartCard } from '@components/Cards/Cards'

<ChartCard title="Minutes by grade" subtitle="This school year" span={2}>
  <TrendChart … />
</ChartCard>`,
    desc: (
      <>
        Wide rectangle with a consistent header / body / footer used for every chart and panel.
        Props: <code>title</code>, <code>subtitle</code>, <code>icon</code>, <code>accent</code>,{' '}
        <code>info</code>, <code>action</code>, <code>footer</code>, <code>bodyPad</code>,{' '}
        <code>bodyMaxHeight</code> (px — caps body height and scrolls vertically while keeping
        sticky table / bar-list headers visible).
        <br />
        <br />
        The header is the app&apos;s <code>.insights-metric-label</code>: 12px 14px on a{' '}
        <code>#f4f4f4</code> hairline, lighter than the card&apos;s own <code>$gray200</code>{' '}
        outline so the division inside doesn&apos;t compete with the edge.
        <br />
        <br />
        <code>info</code> is the affordance that actually sits at the right of a module header in
        the product — a 15px disc with a white &ldquo;i&rdquo; carrying a tooltip. The title itself
        is the link to the detail view there, so a &ldquo;View all&rdquo; control is the exception:{' '}
        <code>action</code> covers it, and renders as the app&apos;s plain{' '}
        <code>.detail_metric_link</code> rather than a button.
      </>
    ),
    render: () => (
      <>
        <ChartCardKnobs />
        <ChartCardShowcase />
        <Variant
          label={
            <>
              Table inside ChartCard — <code>bodyPad=&quot;flush&quot;</code> + <code>flush</code>{' '}
              on Table
            </>
          }
        >
          <ChartCard
            title="Schools by RMI"
            subtitle="Current year average"
            accent="#F26430"
            bodyPad="flush"
          >
            <Table
              flush
              columns={[
                { key: 'name', label: 'School' },
                {
                  key: 'students',
                  label: 'Students',
                  align: 'right',
                  render: (v) => v.toLocaleString(),
                },
                { key: 'rmi', label: 'RMI', align: 'right' },
                {
                  key: 'delta',
                  label: 'YoY',
                  align: 'right',
                  render: (v) => (
                    <span style={{ color: v >= 0 ? '#16A34A' : '#E85648', fontWeight: 700 }}>
                      {v >= 0 ? '↑' : '↓'}
                      {Math.abs(v)} pts
                    </span>
                  ),
                },
              ]}
              rows={TABLE_ROWS}
              zebra
            />
          </ChartCard>
        </Variant>
      </>
    ),
  },
  {
    group: 'cards',
    id: 'card-note',
    name: 'CardNote',
    usage: `import { CardNote } from '@components/Cards/Cards'

<CardNote>Averaged across the last 30 days.</CardNote>
<CardNote tone="warning">Two classes haven't logged since Friday.</CardNote>
<CardNote tone="info" icon="bulb">Three days running doubles completion.</CardNote>`,
    desc: (
      <>
        Inline note inside a card body — the app&apos;s own <code>.infobox</code>: 15px/1.5 on a
        flat tint, <code>12px 16px</code>, radius 10, no border. The tone <em>is</em> the fill.
        <br />
        <br />
        <code>tone</code> names the intent, and each maps to one of the app&apos;s boxes:{' '}
        <code>neutral</code> (<code>.greybox</code>), <code>info</code> (<code>.helpbox</code>),{' '}
        <code>warning</code> (<code>.alertbox</code>), <code>success</code> (
        <code>.successbox</code>) and <code>error</code> (<code>.errorbox</code>).{' '}
        <code>accent</code> isn&apos;t one of them — it takes the card&apos;s own{' '}
        <code>--rc-accent</code>, for a note tied to the chart it sits under.
        <br />
        <br />
        <code>icon</code> takes an <code>{'<Icon>'}</code> name. Every tone but <code>neutral</code>{' '}
        and <code>accent</code> supplies its own by default, matching the app&apos;s{' '}
        <code>*-icon</code> classes — pass <code>icon</code> to override it, or{' '}
        <code>icon={'{false}'}</code> to drop it.
      </>
    ),
    render: () => (
      <>
        <CardNoteKnobs />
        <CardNoteShowcase />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-legend',
    name: 'ChartLegend',
    usage: `import { ChartLegend } from '@components/charts/charts'

<ChartLegend items={[{ label: 'Fall', color: 'var(--c-teal)' }]} />`,
    desc: (
      <>
        Footer legend rendered below the chart body. <code>items</code> is an array of{' '}
        <code>{'{ color, label, dashed? }'}</code>.
      </>
    ),
    render: () => (
      <>
        <ChartLegendKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'bar-list',
    name: 'BarList',
    usage: `import { BarList } from '@components/BarList/BarList'
import '@components/BarList/BarList.css'

<BarList items={[{ label: 'Fiction', value: 320 }]} labelWidth={120} />
<BarList variant="grouped" groups={groups} layout="columns" />`,
    desc: (
      <>
        Horizontal bar-list for ranked breakdowns, factor scores, and icon lists. Three variants:{' '}
        <code>simple</code> (label + bar + value), <code>grouped</code> (icon + sublabel + bar +
        score/delta, optionally side-by-side via <code>layout="columns"</code>), and{' '}
        <code>iconList</code> (prefix + icon + label, no bar). Set <code>labelWidth</code> to pin
        the meta column width and align bars across rows. Simple-mode rows are separated by hairline
        rules by default; pass <code>divided={'{false}'}</code> to opt out. Pass{' '}
        <code>header={'{ label, valueLabel }'}</code> to add a table-style header row above the
        bars.
        <br />
        <br />
        The list is a <strong>container</strong> (and so is each group, since{' '}
        <code>layout="columns"</code> puts two side by side), so a row responds to the width it
        actually has rather than the viewport&apos;s — these sit in cards and in a ~300px profile
        flyout. Under <strong>330px</strong> the bar track is dropped from the grid: at that width
        the meta column leaves it around 24px, which is a dash rather than a length you can compare
        against the row above, so the figure and its trend carry the row on their own.
      </>
    ),
    render: () => (
      <>
        <BarListKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'word-cloud',
    name: 'WordCloud',
    usage: `import { WordCloud } from '@components/WordCloud/WordCloud'

<WordCloud words={[{ text: 'dragon', value: 42 }]} height={280} onWordClick={pick} />`,
    desc: (
      <>
        A real weighted word cloud — words are measured in the font they render in, then packed
        heaviest-first along a spiral, and drawn as SVG fitted to whatever box the card gives it.
        The packing is deterministic, so the same list always lays out the same way. Pass{' '}
        <code>words</code> as <code>{'[{ text, value, color?, title? }]'}</code>, plus{' '}
        <code>accent</code> (size and weight drive a ramp from slate up to the accent),{' '}
        <code>height</code> (<code>'sm' | 'md' | 'lg' | 'xl'</code> or a number),{' '}
        <code>minSize</code>/<code>maxSize</code>, and <code>rotate</code> (0–1: roughly what share
        of words turn 90°). Pass <code>onWordClick</code> + <code>selected</code> to make it a
        filter — hovering then quiets the rest of the cloud. Reach for it when the shape of a whole
        vocabulary is the point; for a ranking anyone has to read values off, use{' '}
        <code>BarList</code>.
      </>
    ),
    render: () => (
      <>
        <WordCloudKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'funnel',
    name: 'Funnel',
    usage: `import { Funnel } from '@components/Funnel/Funnel'
import '@components/Funnel/Funnel.css'

<Funnel items={[{ label: 'Enrolled', value: 820 }, { label: 'Logged', value: 540 }]} />`,
    desc: (
      <>
        Stage funnel for conversion / habit-depth flows. Each step shows the count, % of total,
        stage label, and an optional <code>↑Δpp</code> revealed on hover. Stacks vertically —
        mobile-friendly by default. Pass <code>items</code> as{' '}
        <code>{'[{ stage, count, pct, delta }]'}</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="Student Engagement Funnel" bare>
          <ChartCard
            title="Student Engagement Funnel"
            subtitle="Habit depth across 1,650 students"
            accent="#0CA7BC"
            bodyPad="padded"
            span={2}
          >
            <Funnel
              items={[
                {
                  stage: 'Enrolled Students',
                  note: 'Active roster in Beanstack',
                  count: 1650,
                  pct: 100,
                },
                {
                  stage: 'Logged This Month',
                  note: 'At least 1 log in May 2025',
                  count: 1040,
                  pct: 63,
                  delta: 4,
                },
                {
                  stage: 'Weekly Habit',
                  note: '1+ log every week for 4+ weeks',
                  count: 660,
                  pct: 40,
                  delta: 6,
                },
                {
                  stage: 'Daily Habit',
                  note: '5+ days logged per week',
                  count: 297,
                  pct: 18,
                  delta: 3,
                },
                {
                  stage: '30-Day Streak',
                  note: 'Unbroken streak ≥ 30 days',
                  count: 165,
                  pct: 10,
                  delta: 2,
                },
              ]}
            />
          </ChartCard>
        </Variant>
      </>
    ),
  },
  {
    group: 'charts',
    id: 'tooltips',
    name: 'Tooltips',
    usage: `import { SliceTooltip, BarTooltip } from '@components/charts/charts'

/* nivo line charts take a sliceTooltip — not a per-point tooltip */
<ResponsiveLine sliceTooltip={(p) => <SliceTooltip {...p} allData={data} />} />`,
    desc: (
      <>
        The rich Nivo tooltip pattern: colored accent stripe on the left, uppercase header,
        per-series row with optional MoM delta, optional context footer.
      </>
    ),
    render: () => (
      <>
        <div className="pt-variants pt-variants--3">
          <Variant label="SliceTooltip — line chart">
            <SliceTooltip
              slice={fakeSlicePoints([
                { seriesId: 'Lincoln', color: '#F26430', x: 'Jan', y: 68 },
                { seriesId: 'District avg', color: '#D0D0D0', x: 'Jan', y: 72 },
              ])}
              accent="#F26430"
              allData={RMI_TREND_FIXTURE}
              seriesMap={{ Lincoln: 'school', 'District avg': 'district' }}
              formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pts`}
              context={() => (
                <>
                  <strong>Lincoln</strong> −4 pts below district
                </>
              )}
            />
          </Variant>
          <Variant label="BarTooltip — grouped bars">
            <BarTooltip
              data={{ intrinsic: 14.2, extrinsic: 11.8 }}
              indexValue="May"
              accent="#F26430"
              format={(v) => `${v.toFixed(1)} /20`}
              keys={['intrinsic', 'extrinsic']}
              labels={{
                intrinsic: { label: 'Intrinsic', color: '#F26430' },
                extrinsic: { label: 'Extrinsic', color: '#D0D0D0' },
              }}
              context={(d) => (
                <>
                  <strong>Intrinsic</strong> +{(d.intrinsic - d.extrinsic).toFixed(1)} pts above
                  extrinsic
                </>
              )}
            />
          </Variant>
          <Variant label="GradeTooltip — Lexile bars">
            <GradeTooltip data={{ grade: '4th', growth: 78, expected: 55 }} accent="#B43DD0" />
          </Variant>
        </div>
      </>
    ),
  },
]
