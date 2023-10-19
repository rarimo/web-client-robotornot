import { motion } from 'framer-motion'
import { FC, useEffect } from 'react'

import { TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTIONS = [
  'RariMe Snap allows users to store and manage identity credentials through MetaMask wallet',
  'You can utilize the RariMe Identity Snap to seamlessly integrate any identity credential and use them across various blockchains without any additional effort.',
  'Is not that cool? Same wallet for managing your Crypto and identity',
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-2/2_000', 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarAnimationCompleted])

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
        <motion.img
          ref={imageSeq}
          className='app__step-sidebar-content-img'
          src='/images/sequences/sidebar-2/2_0000.png'
          alt='sidebar-content'
        />
      </div>

      <TypingAnimatedText
        ref={textTyping}
        isAutoplay={false}
        text={DESCRIPTIONS.join('\n\n')}
      />
    </motion.div>
  )
}

export default SidebarContent
