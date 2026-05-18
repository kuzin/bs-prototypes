import { useState } from 'react'
import { RisLayout } from '../ris/components/RisLayout'
import { PrototypeNav } from '../PrototypeNav'
import '../ris/index.css'

export function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <>
      <div className="ris-shell">
        <RisLayout scope="district" page={page} onPage={setPage} />
      </div>
      <PrototypeNav currentHref="/bs-prototypes/ris-district/" />
    </>
  )
}
