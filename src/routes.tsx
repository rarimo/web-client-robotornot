import { AnimatePresence } from 'framer-motion'
import { Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import App from '@/App'
import {
  KycContextProvider,
  Web3ProviderContextProvider,
  ZkpContextProvider,
} from '@/contexts'
import FormStepperContextProvider from '@/contexts/FormStepperContext'
import MetamaskZkpSnapContextProvider from '@/contexts/MetamaskZkpSnapContext'
import { RoutesPaths } from '@/enums'
import MainPage from '@/pages/MainPage'

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: RoutesPaths.App,
      element: (
        <Suspense fallback={<></>}>
          <Web3ProviderContextProvider>
            <MetamaskZkpSnapContextProvider>
              <App>
                <AnimatePresence>
                  <ZkpContextProvider>
                    <KycContextProvider>
                      <AnimatePresence>
                        <Outlet />
                      </AnimatePresence>
                    </KycContextProvider>
                  </ZkpContextProvider>
                </AnimatePresence>
              </App>
            </MetamaskZkpSnapContextProvider>
          </Web3ProviderContextProvider>
        </Suspense>
      ),
      children: [
        {
          path: RoutesPaths.Main,
          element: (
            <FormStepperContextProvider>
              <MainPage />
            </FormStepperContextProvider>
          ),
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
