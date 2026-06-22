import React from 'react'
import { CustomSelect } from 'bs-prototypes'

export const WithLabel = () => {
  const [value, setValue] = React.useState('alvarez')
  return (
    <CustomSelect
      label="Class"
      value={value}
      onChange={setValue}
      options={[
        { value: 'alvarez', label: 'Mrs. Alvarez — Grade 4' },
        { value: 'chen', label: 'Mr. Chen — Grade 4' },
        { value: 'okoye', label: 'Ms. Okoye — Grade 5' },
      ]}
    />
  )
}

export const Grouped = () => {
  const [value, setValue] = React.useState('fiction')
  return (
    <CustomSelect
      label="Book genre"
      value={value}
      onChange={setValue}
      options={[
        {
          group: 'Popular',
          options: [
            { value: 'fiction', label: 'Fiction' },
            { value: 'graphic', label: 'Graphic novels' },
          ],
        },
        {
          group: 'Nonfiction',
          options: [
            { value: 'biography', label: 'Biography' },
            { value: 'science', label: 'Science' },
          ],
        },
      ]}
    />
  )
}

export const Sizes = () => {
  const [a, setA] = React.useState('week')
  const [b, setB] = React.useState('minutes')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <CustomSelect
        size="sm"
        value={a}
        onChange={setA}
        options={[
          { value: 'week', label: 'This week' },
          { value: 'month', label: 'This month' },
        ]}
      />
      <CustomSelect
        size="lg"
        value={b}
        onChange={setB}
        options={[
          { value: 'minutes', label: 'Minutes read' },
          { value: 'books', label: 'Books finished' },
        ]}
      />
    </div>
  )
}

export const Disabled = () => (
  <CustomSelect
    label="District"
    value="all"
    disabled
    onChange={() => {}}
    options={[{ value: 'all', label: 'All schools (locked)' }]}
  />
)
