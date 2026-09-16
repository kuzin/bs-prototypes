import '@components/ui/tokens.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Arms window.__mobileFidelity in dev — see mobile/fidelity.spec.js.
import '@mobile/fidelity'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
