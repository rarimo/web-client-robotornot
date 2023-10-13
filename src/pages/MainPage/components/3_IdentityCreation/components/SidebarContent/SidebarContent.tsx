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
      <div className='app__step-sidebar-content-img-wrp'>
        <img
          className='app__step-sidebar-content-img'
          src='/images/sidebar-img-3.svg'
          alt='sidebar-content'
        />
      </div>

      <p className='app__step-sidebar-content-text'>
        {`Create your profile is just one click and generates a unique identifier within the MetaMask Snap!`}
      </p>
    </motion.div>
  )
}

export default SidebarContent
