import React from 'react'
import { SchoolPicker } from 'bs-prototypes'

// SchoolPicker = the school avatar + dropdown that lives in the sidebar footer.
// The dropdown portals/position-fixes when open (would clip in the card), so we
// author the closed/in-flow state with a selected school. It sits on the blue
// sidebar gradient in real use, so frame it on that background.
const SCHOOLS = [
  { id: 'lincoln', name: 'Lincoln Elementary', grades: 'K–5', color: '#E8866A' },
  { id: 'roosevelt', name: 'Roosevelt Middle', grades: '6–8', color: '#0DA7BC' },
  { id: 'kennedy', name: 'Kennedy High', grades: '9–12', color: '#7C3AED' },
]

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: 240,
      padding: 16,
      borderRadius: 14,
      background: 'linear-gradient(180deg,#0B4F8A,#0A3E6E)',
    }}
  >
    {children}
  </div>
)

export const Lincoln = () => {
  const [schoolId, setSchoolId] = React.useState('lincoln')
  return (
    <Frame>
      <SchoolPicker schools={SCHOOLS} schoolId={schoolId} onSchoolId={setSchoolId} />
    </Frame>
  )
}

export const HighSchool = () => {
  const [schoolId, setSchoolId] = React.useState('kennedy')
  return (
    <Frame>
      <SchoolPicker schools={SCHOOLS} schoolId={schoolId} onSchoolId={setSchoolId} />
    </Frame>
  )
}
