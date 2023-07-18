import '@/styles/index.scss'
import '@/localization'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

import { config } from '@config'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { initApi } from '@/api'
import { AppRoutes } from '@/routes'

const root = createRoot(document.getElementById('root') as Element)

initApi(config.API_URL)

// root.render(<StrictMode><AppRoutes /></StrictMode>)
root.render(<AppRoutes />)
