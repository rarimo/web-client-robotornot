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
          src='/images/sidebar-img-2.svg'
          alt='sidebar-content'
        />
      </div>

      <p className='app__step-sidebar-content-text'>
        {`RariMe Snap allows users to store and manage identity credentials through MetaMask wallet`}
      </p>
      <p className='app__step-sidebar-content-text'>
        {`You can utilize the RariMe Identity Snap to seamlessly integrate any identity credential and use them across various blockchains without any additional effort.`}
      </p>
      <p className='app__step-sidebar-content-text'>
        {`Is not that cool? Same wallet for managing your Crypto and identity`}
      </p>
    </motion.div>
  )
}

export default SidebarContent
