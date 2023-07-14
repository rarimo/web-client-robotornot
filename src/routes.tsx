import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import App from '@/App'
import { Web3ProviderContextProvider } from '@/contexts'
import MetamaskZkpSnapContextProvider from '@/contexts/MetamaskZkpSnapContext'
import { RoutesPaths } from '@/enums'
import { AuthLayout } from '@/layouts'

export const AppRoutes = () => {
  const AuthProviders = lazy(() => import('@/pages/AuthProviders'))
  const AuthPreview = lazy(() => import('@/pages/AuthPreview'))
  const AuthConfirmation = lazy(() => import('@/pages/AuthConfirmation'))
  const AuthSuccess = lazy(() => import('@/pages/AuthSuccess'))

  const router = createBrowserRouter([
    {
      path: RoutesPaths.app,
      element: (
        <Suspense fallback={<></>}>
          <Web3ProviderContextProvider>
            <MetamaskZkpSnapContextProvider>
              <App>
                <AnimatePresence>
                  <Outlet />
                </AnimatePresence>
              </App>
            </MetamaskZkpSnapContextProvider>
          </Web3ProviderContextProvider>
        </Suspense>
      ),
      children: [
        {
          path: RoutesPaths.auth,
          element: <AuthLayout />,
          children: [
            {
              index: true,
              path: RoutesPaths.authProviders,
              element: <AuthProviders />,
            },
            {
              path: RoutesPaths.authPreview,
              element: <AuthPreview />,
            },
            {
              path: RoutesPaths.authConfirmation,
              element: <AuthConfirmation />,
            },
            {
              path: RoutesPaths.authSuccess,
              element: <AuthSuccess />,
            },
          ],
        },
        {
          path: '/',
          element: <Navigate replace to={RoutesPaths.authProviders} />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutesPaths.authProviders} />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
