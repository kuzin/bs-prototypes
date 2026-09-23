import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { DlLayout } from './components/DlLayout'
import './index.css'

export function App() {
  return (
    <>
      <DlLayout />
      <PrototypeNav currentHref="/bs-prototypes/discover-lists/" />
    </>
  )
}
