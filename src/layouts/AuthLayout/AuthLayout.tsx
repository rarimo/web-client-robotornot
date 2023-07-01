import { AnimatePresence } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'
import { Outlet } from 'react-router-dom'

import { KycContextProvider } from '@/contexts'

type Props = HTMLAttributes<HTMLDivElement>

const AuthLayout: FC<Props> = () => {
  return (
    <KycContextProvider>
      <AnimatePresence>
        <Outlet />
      </AnimatePresence>
    </KycContextProvider>
  )
}

export default AuthLayout
