import React from 'react'
import { FilterBar, FilterItem, CustomSelect, Button, Icon } from 'bs-prototypes'

const GRADE_OPTS = [
  { value: 'k-2', label: 'Grades K–2' },
  { value: '3-5', label: 'Grades 3–5' },
  { value: '6-8', label: 'Grades 6–8' },
]
const STATUS_OPTS = [
  { value: 'all', label: 'All readers' },
  { value: 'on-track', label: 'On track' },
  { value: 'behind', label: 'Behind goal' },
]
const SCHOOL_OPTS = [
  { value: 'lincoln', label: 'Lincoln Elementary' },
  { value: 'whitman', label: 'Whitman Middle' },
  { value: 'all', label: 'All schools' },
]

export const Default = () => {
  const [grade, setGrade] = React.useState('3-5')
  const [status, setStatus] = React.useState('on-track')
  const [school, setSchool] = React.useState('lincoln')
  return (
    <FilterBar action={<Button variant="secondary">Save view</Button>}>
      <FilterItem label="Grade band">
        <CustomSelect options={GRADE_OPTS} value={grade} onChange={setGrade} />
      </FilterItem>
      <FilterItem label="Reading status">
        <CustomSelect options={STATUS_OPTS} value={status} onChange={setStatus} />
      </FilterItem>
      <FilterItem label="School">
        <CustomSelect options={SCHOOL_OPTS} value={school} onChange={setSchool} />
      </FilterItem>
    </FilterBar>
  )
}

export const WithAction = () => {
  const [grade, setGrade] = React.useState('k-2')
  const [status, setStatus] = React.useState('behind')
  return (
    <FilterBar
      action={
        <Button variant="primary" icon={<Icon name="trophy" size={16} />}>
          New challenge
        </Button>
      }
    >
      <FilterItem label="Grade band">
        <CustomSelect options={GRADE_OPTS} value={grade} onChange={setGrade} />
      </FilterItem>
      <FilterItem label="Reading status">
        <CustomSelect options={STATUS_OPTS} value={status} onChange={setStatus} />
      </FilterItem>
    </FilterBar>
  )
}
