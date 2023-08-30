import '@/styles/index.scss'
import '@/localization'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

import { config } from '@config'
import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'

import { initApi } from '@/api'
import { AppRoutes } from '@/routes'

const root = createRoot(document.getElementById('root') as Element)

initApi(config.API_URL)

if (config.GA_ID) ReactGA.initialize(config.GA_ID)

try {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', window.location.origin],
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,

    beforeSend: event => event,
  })
} catch (error) {
  /* empty */
}

root.render(
  import.meta.env.DEV ? (
    <AppRoutes />
  ) : (
    <StrictMode>
      <AppRoutes />
    </StrictMode>
  ),
)
