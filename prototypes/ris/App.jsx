import { useState } from 'react'
import { RisLayout } from './components/RisLayout'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import './index.css'

export function App() {
  const [page, setPage] = useState('dashboard')
  const [schoolId, setSchoolId] = useState('lincoln')

  return (
    <>
      <div className="ris-shell">
        <RisLayout
          scope="school"
          schoolId={schoolId}
          onSchoolId={setSchoolId}
          page={page}
          onPage={setPage}
        />
      </div>
      <PrototypeNav currentHref="/bs-prototypes/ris/" />
    </>
  )
}
