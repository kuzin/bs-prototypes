import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { CeLayout } from '../collection-engine/components/CeLayout'
import '../collection-engine/index.css'

export function App() {
  return (
    <>
      <CeLayout scope="district" />
      <PrototypeNav currentHref="/bs-prototypes/collection-engine-district/" />
    </>
  )
}
