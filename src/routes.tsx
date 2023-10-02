import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import App from '@/App'
import { KycContextProvider, Web3ProviderContextProvider } from '@/contexts'
import MetamaskZkpSnapContextProvider from '@/contexts/MetamaskZkpSnapContext'
import { RoutesPaths } from '@/enums'

export const AppRoutes = () => {
  const MainPage = lazy(() => import('src/pages/MainPage'))

  const router = createBrowserRouter([
    {
      path: RoutesPaths.App,
      element: (
        <Suspense fallback={<></>}>
          <Web3ProviderContextProvider>
            <MetamaskZkpSnapContextProvider>
              <App>
                <AnimatePresence>
                  <KycContextProvider>
                    <AnimatePresence>
                      <Outlet />
                    </AnimatePresence>
                  </KycContextProvider>
                </AnimatePresence>
              </App>
            </MetamaskZkpSnapContextProvider>
          </Web3ProviderContextProvider>
        </Suspense>
      ),
      children: [
        {
          path: RoutesPaths.Main,
          element: <MainPage />,
        },

        {
          path: '/',
          element: <Navigate replace to={RoutesPaths.Main} />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutesPaths.Main} />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
