import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { CeLayout } from './components/CeLayout'

export function App() {
  return (
    <>
      <CeLayout scope="school" />
      <PrototypeNav currentHref="/bs-prototypes/collection-engine/" />
    </>
  )
}
