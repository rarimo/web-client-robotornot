import { AnimatePresence } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'
import { Outlet } from 'react-router-dom'

type Props = HTMLAttributes<HTMLDivElement>

const AuthLayout: FC<Props> = () => {
  return (
    <AnimatePresence>
      <Outlet />
    </AnimatePresence>
  )
}

export default AuthLayout
