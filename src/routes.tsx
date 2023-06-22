import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import { Layout, StatusMessage } from '@/components'
import { RoutePaths } from '@/enums'
import Dashboard from '@/pages/Dashboard'

const Proposals = lazy(() => import('@/pages/Proposals'))
const Transactions = lazy(() => import('@/pages/Transactions'))
const Proposal = lazy(() => import('@/pages/Proposal'))
const Transaction = lazy(() => import('@/pages/Transaction'))
const Account = lazy(() => import('@/pages/Account'))
const Blocks = lazy(() => import('@/pages/Blocks'))
const Block = lazy(() => import('@/pages/Block'))
const Validators = lazy(() => import('@/pages/Validators'))
const Validator = lazy(() => import('@/pages/Validator'))
const Params = lazy(() => import('@/pages/Params'))

const router = createBrowserRouter([
  {
    path: RoutePaths.Dashboard,
    element: (
      <Layout>
        <Suspense fallback={<> </>}>
          <Outlet />
          <StatusMessage />
        </Suspense>
      </Layout>
    ),
    children: [
      {
        index: true,
        path: RoutePaths.Dashboard,
        element: <Dashboard />,
      },
      {
        path: '*',
        element: <Navigate replace to={RoutePaths.Dashboard} />,
      },
      {
        path: RoutePaths.Proposals,
        element: <Proposals />,
      },
      {
        path: RoutePaths.Proposal,
        element: <Proposal />,
      },
      {
        path: RoutePaths.Transactions,
        element: <Transactions />,
      },
      {
        path: RoutePaths.Transaction,
        element: <Transaction />,
      },
      {
        path: RoutePaths.Blocks,
        element: <Blocks />,
      },
      {
        path: RoutePaths.Block,
        element: <Block />,
      },
      {
        path: RoutePaths.Account,
        element: <Account />,
      },
      {
        path: RoutePaths.Validators,
        element: <Validators />,
      },
      {
        path: RoutePaths.Validator,
        element: <Validator />,
      },
      {
        path: RoutePaths.Params,
        element: <Params />,
      },
    ],
  },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
