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
      <div className='app__step-sidebar-content-img-wrp app__step-sidebar-content-img-wrp--single'>
        <img
          className='app__step-sidebar-content-img'
          src='/images/sidebar-img-7.svg'
          alt='sidebar-content'
        />
      </div>
    </motion.div>
  )
}

export default SidebarContent
