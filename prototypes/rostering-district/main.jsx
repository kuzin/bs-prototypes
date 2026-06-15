import '@components/ui/tokens.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '../rostering/App'

// District version of the Rostering prototype. Reuses the entire school-version
// App, flipping it into district mode via the `scope` prop (district framing +
// a school picker that scopes the live filter preview).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App scope="district" />
  </StrictMode>,
)
