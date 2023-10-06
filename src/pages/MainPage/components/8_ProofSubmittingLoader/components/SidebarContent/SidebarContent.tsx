import { motion } from 'framer-motion'
import { FC } from 'react'

import { SidebarProps } from '@/pages/MainPage/components/types'

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  return (
    <motion.div
      className={[
        'sidebar-content',
        'app__step-sidebar-content',
        className,
      ].join(' ')}
      {...rest}
    >
      {`Proof Submitting Loader Sidebar Content`}
    </motion.div>
  )
}

export default SidebarContent
