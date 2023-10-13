import { motion } from 'framer-motion'
import { FC, useState } from 'react'

import { AppButton } from '@/common'
import SidebarGame from '@/pages/MainPage/components/6_ProofGeneratingLoader/components/SidebarGame'
import { SidebarProps } from '@/pages/MainPage/components/types'

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const [isGameShown, setIsGameShown] = useState(false)

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
        {`Generating a Zero-Knowledge Proof (ZKP) can be time-consuming due to complex mathematical operations for ensuring privacy. But you know what they say: "Good proofs come to those who wait!" And given the unparalleled privacy offer, it's like waiting for a fine wine to age - totally worth it!`}
      </p>

      <div className='app__step-sidebar-content-actions'>
        <AppButton
          className='app__step-sidebar-content-actions-btn'
          text={`Play Game`}
          modification='border-circle'
          size='small'
          onClick={() => {
            setIsGameShown(prevState => !prevState)
          }}
        />
      </div>

      <SidebarGame isShown={isGameShown} setIsShown={setIsGameShown} />
    </motion.div>
  )
}

export default SidebarContent
