import { config } from '@config'
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
          src='/images/sidebar-img-6.png'
          alt='sidebar-content'
        />
      </div>

      <p className='app__step-sidebar-content-text'>
        {`Since this app is built on the Rarimo protocol, a cross-chain identity layer, This means you don't have to manually handle proofs for different chains. dApps can easily verify your credentials across blockchains, sparing you from additional fees and unnecessary steps.`}
      </p>

      <p className='app__step-sidebar-content-text'>
        {`Learn more about`}{' '}
        <a
          className='app__text-link'
          href={config.EXTERNAL_LANDING_URL}
          target='_blank'
          rel='noreferrer'
        >
          {`Rarimo`}
        </a>
      </p>
    </motion.div>
  )
}

export default SidebarContent
