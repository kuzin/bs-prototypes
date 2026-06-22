// Generates .design-sync/groups/<Name>.md frontmatter stubs that assign each
// component to a Pattern-Library group via `category:`. Body is intentionally
// empty so the converter keeps the synthesized (JSDoc + props + examples)
// .prompt.md while still picking up the group. Re-run after editing GROUPS.
import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'groups')

const GROUPS = {
  atoms: ['Avatar', 'Button', 'Divider', 'Icon', 'IconButton', 'Pill', 'ProgressBar', 'Skeleton', 'Spinner', 'Toggle', 'Tooltip'],
  molecules: ['Accordion', 'Banner', 'Breadcrumb', 'EmptyState', 'Flyout', 'Modal', 'SectionHeading', 'SettingList', 'SettingRow', 'Stepper', 'Table', 'Tabs'],
  'form-fields': ['Checkbox', 'CheckboxGroup', 'CheckboxGroupItem', 'ColorInput', 'DateInput', 'Field', 'FileInput', 'ImageDropzone', 'Input', 'MultiSelect', 'NumberInput', 'Radio', 'RadioGroup', 'RangeSlider', 'RichText', 'SearchInput', 'Select', 'Textarea', 'TimeInput'],
  'form-patterns': ['ActiveFilters', 'CustomSelect', 'DatePicker', 'FilterBar', 'FilterItem', 'TimePicker'],
  charts: ['BarList', 'CardNote', 'ChartCard', 'ChartLegend', 'Funnel', 'StatCard', 'TrendChart'],
  domain: ['AlertRow', 'AlertsBanner', 'BennyBubble', 'HealthStat', 'ReadingHealth'],
  layout: ['AppShell', 'BackBar', 'Hero', 'MainRail', 'PrototypeNav', 'SchoolPicker', 'SectionCard', 'Sidebar'],
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
let n = 0
for (const [group, names] of Object.entries(GROUPS)) {
  for (const name of names) {
    writeFileSync(join(OUT, `${name}.md`), `---\ncategory: ${group}\n---\n`)
    n++
  }
}
console.log(`wrote ${n} group stubs to .design-sync/groups/`)
console.log('files:', readdirSync(OUT).length)
