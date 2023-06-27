import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import { AppFooter, AppNavbar } from '@/common'
import { RoutesPaths } from '@/enums'
import { AuthLayout } from '@/layouts'

export const AppRoutes = () => {
  const AuthProviders = lazy(
    () => import('@/pages/AuthProviders/AuthProviders'),
  )

  const router = createBrowserRouter([
    {
      path: RoutesPaths.app,
      element: (
        <Suspense fallback={<></>}>
          <AppNavbar />
          <AnimatePresence>
            <div className='app__main'>
              <Outlet />
            </div>
          </AnimatePresence>
          <AppFooter />
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
