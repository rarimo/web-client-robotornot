import '@/styles/index.scss'
import '@/localization'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'

const root = createRoot(document.getElementById('root') as Element)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
