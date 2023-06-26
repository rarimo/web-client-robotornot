import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import { AppNavbar } from '@/common'
import { RoutesPaths } from '@/enums'

export const AppRoutes = () => {
  const StoreOverview = lazy(() => import('@/pages/StoreOverview'))
  const UiKit = lazy(() => import('@/pages/UiKit'))
  const ComplexForm = lazy(() => import('@/pages/ComplexForm'))

  const pageAnimationOpts = {
    initial: 'hide',
    animate: 'show',
    exit: 'hide',
    variants: {
      hide: {
        opacity: 0,
      },
      show: {
        opacity: 1,
      },
    },
    transition: { duration: 0.5 },
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Suspense fallback={<></>}>
          <AppNavbar className='app__navbar' />
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </Suspense>
      ),
      children: [
        {
          index: true,
          path: RoutesPaths.uiKit,
          element: <UiKit {...pageAnimationOpts} />,
        },
        {
          path: RoutesPaths.complexForm,
          element: <ComplexForm {...pageAnimationOpts} />,
        },
        {
          path: RoutesPaths.storeOverview,
          element: <StoreOverview {...pageAnimationOpts} />,
        },
        {
          path: '/',
          element: <Navigate replace to={RoutesPaths.uiKit} />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutesPaths.uiKit} />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
