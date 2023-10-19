import { motion } from 'framer-motion'
import { FC } from 'react'
import { useEffectOnce } from 'react-use'

import { TypingAnimatedText } from '@/common'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTION = [
  `Identity credential is a piece of evidence or an attestation that verifies the identity or attributes of you.`,
  `The credential is encrypted within the MetaMask Snap (RariMe) wallet and only you the owner have the ability to unlock and access them.`,
  `Do you know the most significant innovation here? Once you're verified as a human, you can use this credential universally across various blockchain dApps and channels. This means you won't need to re-authorize or provide any additional information repeatedly.`,
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()

  useEffectOnce(() => {
    if (!imageSeq.current) return

    animateSequence('/images/sequences/sidebar-5/5_000', 32)
  })

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
          ref={imageSeq}
          className='app__step-sidebar-content-img'
          src='/images/sidebar-img-5.svg'
          alt='sidebar-content'
        />
      </div>

      <TypingAnimatedText
        className='app__step-sidebar-content-text'
        ref={textTyping}
        isAutoplay={false}
        text={DESCRIPTION.join('\n\n')}
      />
    </motion.div>
  )
}

export default SidebarContent
