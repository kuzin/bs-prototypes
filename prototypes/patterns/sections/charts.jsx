import { useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { CardNote, ChartCard, StatCard } from '@components/Cards/Cards'
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
import { Toggle } from '@components/Toggle/Toggle'
import { Field, Input, RangeSlider, Select } from '@components/Form/Form'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { RMI_FACTORS } from '../../ris/data'
import { Knobs, Variant, TABLE_ROWS } from './_shared'

const fakeSlicePoints = (points) => ({
  points: points.map((p, i) => ({
    id: `${p.serieId}.${i}`,
    serieId: p.serieId,
    serieColor: p.color,
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
  { label: 'Sci-Fi & Fantasy', value: 28, color: '#7C3AED' },
  { label: 'Sports & Adventure', value: 19, color: '#0DA7BC' },
  { label: 'Realistic Fiction', value: 17, color: '#16A97A' },
  { label: 'Graphic & Manga', value: 14, color: '#E8866A' },
  { label: 'Mystery & Thriller', value: 11, color: '#F0C050' },
  { label: 'Other', value: 11, color: '#CBD5E1' },
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
          { label: 'Intrinsic', labelColor: '#E8866A', items: intrinsic.map(factorItem) },
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
          accent={variant === 'simple' ? '#7C3AED' : '#E8866A'}
          bodyPad="padded"
          span={variant === 'iconList' ? 1 : 2}
        >
          {body}
        </ChartCard>
      </div>
    </>
  )
}

function StatCardKnobs() {
  const [value, setValue] = useState('71')
  const [unit, setUnit] = useState('')
  const [label, setLabel] = useState('Reading Motivation Index')
  const [footer, setFooter] = useState('↑ 7 pts since Sep 2024')
  const [color, setColor] = useState('#0F172A')
  const [footerColor, setFc] = useState('#94A3B8')
  return (
    <>
      <Knobs>
        <Field label="value">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="unit">
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="/40" />
        </Field>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="footer">
          <Input value={footer} onChange={(e) => setFooter(e.target.value)} />
        </Field>
        <Field label="color">
          <input
            className="pt-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Field>
        <Field label="footerColor">
          <input
            className="pt-color"
            type="color"
            value={footerColor}
            onChange={(e) => setFc(e.target.value)}
          />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <StatCard
          value={value}
          unit={unit || undefined}
          label={label}
          footer={footer}
          color={color}
          footerColor={footerColor}
        />
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
  const [accent, setAccent] = useState('#E8866A')
  const [showIcon, setShowIcon] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showAction, setShowAction] = useState(true)
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
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
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
          action={showAction ? <button className="rc-card-drill">View →</button> : undefined}
          bodyPad={bodyPad}
          footer={
            showFooter ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'This school' },
                  { color: '#CBD5E1', label: 'District avg', dashed: true },
                ]}
              />
            ) : undefined
          }
        >
          <div style={{ color: '#94A3B8', textAlign: 'center', padding: '32px 0' }}>
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
  const [accent, setAccent] = useState('#0DA7BC')
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
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
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
                  color: '#CBD5E1',
                  colorFn: (d) => (d.isThis ? accent : '#CBD5E1'),
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
                { key: 'school', name: 'School', color: '#1D4ED8', dashed },
                ...(dualAxis
                  ? [
                      {
                        key: 'secondary',
                        name: 'Incidents',
                        color: '#E8866A',
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
  const [accent, setAccent] = useState('#E8866A')

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
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
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
                  { color: '#CBD5E1', label: 'District avg', dashed: true },
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
                  color: '#CBD5E1',
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
  const [accent, setAccent] = useState('#E8866A')

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
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
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
                  { color: '#CBD5E1', label: 'Extrinsic' },
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
              colors={({ id }) => (id === 'intrinsic' ? accent : '#CBD5E1')}
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
                    extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
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
  const [accent, setAccent] = useState('#E8866A')

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
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
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
          accent="#1D4ED8"
          footer={
            showLegend ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'This school' },
                  { color: '#CBD5E1', label: 'Other schools' },
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
              colors={({ data }) => (data.isThis ? accent : '#CBD5E1')}
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
              labelTextColor="#1E293B"
              maxValue={100}
              tooltip={({ data }) => (
                <div
                  className="sdb-tooltip"
                  style={{ '--tip-accent': data.isThis ? accent : '#1D4ED8' }}
                >
                  <div className="sdb-tooltip-header">{data.name}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{ '--series-color': data.isThis ? accent : '#94A3B8' }}
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
  const [accent, setAccent] = useState('#E8866A')
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
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
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
          accent="#7C3AED"
          footer={
            showLegend ? (
              <ChartLegend
                items={[
                  { color: accent, label: 'This school' },
                  { color: '#CBD5E1', label: 'Other schools' },
                  ...(showRef
                    ? [{ color: '#D97706', label: 'Expected (+65L)', dashed: true }]
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
              colors={({ serieId }) => (serieId === 'This school' ? accent : '#CBD5E1')}
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
                        lineStyle: { stroke: '#D97706', strokeDasharray: '4 3', strokeWidth: 1.5 },
                      },
                    ]
                  : []
              }
              tooltip={({ node }) => (
                <div
                  className="sdb-tooltip"
                  style={{ '--tip-accent': node.data.sid === 'lincoln' ? accent : '#475569' }}
                >
                  <div className="sdb-tooltip-header">{node.data.school}</div>
                  <div
                    className="sdb-tooltip-series"
                    style={{ '--series-color': node.data.sid === 'lincoln' ? accent : '#94A3B8' }}
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
    { color: '#E8866A', label: 'Lincoln' },
    { color: '#CBD5E1', label: 'District avg', dashed: true },
    { color: '#16A97A', label: 'Target' },
    { color: '#7C3AED', label: 'Top quartile' },
    { color: '#0DA7BC', label: 'Elementary' },
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

function CardNoteKnobs() {
  const [tone, setTone] = useState('neutral')
  const [text, setText] = useState(
    'Intrinsic subscore rose from 12.1 to 14.2 /20, outpacing extrinsic motivation.',
  )
  return (
    <>
      <Knobs>
        <Field label="tone">
          <Select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="neutral">neutral</option>
            <option value="accent">accent</option>
          </Select>
        </Field>
        <Field label="text" className="pt-knob-full">
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard title="Note" accent="#E8866A" bodyPad="padded">
          <CardNote tone={tone}>{text}</CardNote>
        </ChartCard>
      </div>
    </>
  )
}

export const chartsSections = [
  {
    group: 'charts',
    id: 'trend-chart',
    name: 'TrendChart',
    desc: (
      <>
        The default reusable chart for area / line / bar visualizations. Wraps Recharts and locks in
        the project's standard margins, tick font, tooltip styling, axis padding, and height. Pass{' '}
        <code>type</code> (<code>'area' | 'line' | 'bar'</code>
        ), <code>data</code>, <code>xKey</code>, <code>yDomain</code>, <code>height</code> (
        <code>'sm' | 'md' | 'lg' | 'xl'</code>), and a <code>series</code> array of{' '}
        <code>
          {'{ key, name, color, dashed?, fillOpacity?, strokeWidth?, yAxisId?, colorFn? }'}
        </code>
        . Pass <code>yRight</code> for dual-axis trends; pass <code>layout="horizontal"</code> +{' '}
        <code>leftMargin</code> for horizontal-bar rankings. Always use this for new charts — only
        drop down to Recharts directly for one-off shapes like scatter or reference lines.
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
    group: 'charts',
    id: 'stat-card',
    name: 'StatCard',
    desc: (
      <>
        Small metric tile shown in a row at the top of a bucket page. Props: <code>value</code>,{' '}
        <code>unit</code>, <code>label</code>, <code>footer</code>, <code>color</code>,{' '}
        <code>footerColor</code>.
      </>
    ),
    render: () => (
      <>
        <StatCardKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-card',
    name: 'ChartCard',
    desc: (
      <>
        Wide rectangle with a consistent header / body / footer used for every chart and panel.
        Props: <code>title</code>, <code>subtitle</code>, <code>icon</code>, <code>accent</code>,{' '}
        <code>action</code>, <code>footer</code>, <code>bodyPad</code>, <code>bodyMaxHeight</code>{' '}
        (px — caps body height and scrolls vertically while keeping sticky table / bar-list headers
        visible). Knobs below to preview combinations.
      </>
    ),
    render: () => (
      <>
        <ChartCardKnobs />
        <div style={{ marginTop: 20 }}>
          <div className="pt-variant-label">
            Table inside ChartCard — <code>bodyPad="flush"</code> + <code>flush</code> on Table
          </div>
          <ChartCard
            title="Schools by RMI"
            subtitle="Current year average"
            accent="#E8866A"
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
                    <span style={{ color: v >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
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
        </div>
      </>
    ),
  },
  {
    group: 'charts',
    id: 'card-note',
    name: 'CardNote',
    desc: (
      <>
        Inline note inside a card body. Two tones: <code>neutral</code> (slate) and{' '}
        <code>accent</code> (uses the card's <code>--rc-accent</code>).
      </>
    ),
    render: () => (
      <>
        <CardNoteKnobs />
      </>
    ),
  },
  {
    group: 'charts',
    id: 'chart-legend',
    name: 'ChartLegend',
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
    id: 'funnel',
    name: 'Funnel',
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
            accent="#0DA7BC"
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
                { serieId: 'Lincoln', color: '#E8866A', x: 'Jan', y: 68 },
                { serieId: 'District avg', color: '#CBD5E1', x: 'Jan', y: 72 },
              ])}
              accent="#E8866A"
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
              accent="#E8866A"
              format={(v) => `${v.toFixed(1)} /20`}
              keys={['intrinsic', 'extrinsic']}
              labels={{
                intrinsic: { label: 'Intrinsic', color: '#E8866A' },
                extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
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
            <GradeTooltip data={{ grade: '4th', growth: 78, expected: 55 }} accent="#7C3AED" />
          </Variant>
        </div>
      </>
    ),
  },
]
