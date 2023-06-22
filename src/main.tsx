import '@/styles/index.scss'
import '@/localization'

import { ApolloProvider } from '@apollo/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'

import App from '@/App'
import { apolloClient } from '@/graphql'
import { store } from '@/store'

const rootRef = document.getElementById('root')

if (rootRef) {
  const root = createRoot(rootRef)

  root.render(
    <StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <ApolloProvider client={apolloClient}>
            <App />
          </ApolloProvider>
        </HelmetProvider>
      </Provider>
    </StrictMode>,
  )
}
