import React from 'react'
import { FilterBar, FilterItem, CustomSelect } from 'bs-prototypes'

// FilterItem is a labeled cell within a FilterBar — author it inside its parent.
export const InBar = () => {
  const [logType, setLogType] = React.useState('minutes')
  const [range, setRange] = React.useState('week')
  return (
    <FilterBar>
      <FilterItem label="Log type">
        <CustomSelect
          value={logType}
          onChange={setLogType}
          options={[
            { value: 'minutes', label: 'Minutes read' },
            { value: 'books', label: 'Books finished' },
            { value: 'pages', label: 'Pages read' },
          ]}
        />
      </FilterItem>
      <FilterItem label="Time range">
        <CustomSelect
          value={range}
          onChange={setRange}
          options={[
            { value: 'week', label: 'This week' },
            { value: 'month', label: 'This month' },
            { value: 'year', label: 'School year' },
          ]}
        />
      </FilterItem>
    </FilterBar>
  )
}

export const SingleItem = () => {
  const [view, setView] = React.useState('class')
  return (
    <FilterItem label="View as…">
      <CustomSelect
        value={view}
        onChange={setView}
        options={[
          { value: 'class', label: 'Class' },
          { value: 'student', label: 'Individual student' },
          { value: 'grade', label: 'Grade level' },
        ]}
      />
    </FilterItem>
  )
}
