import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'

import { AppButton, TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import SidebarGame from '@/pages/MainPage/components/6_ProofGeneratingLoader/components/SidebarGame'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTIONS = [
  'Generating a Zero-Knowledge Proof (ZKP) can be time-consuming due to complex mathematical operations for ensuring privacy. But you know what they say: "Good proofs come to those who wait!" And given the unparalleled privacy offer, it\'s like waiting for a fine wine to age - totally worth it!',
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const [isGameShown, setIsGameShown] = useState(false)
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-6/6_000', 32)
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
          src='/images/sequences/sidebar-6/6_0000.png'
          alt='sidebar-content'
        />
      </div>

      <TypingAnimatedText
        className='app__step-sidebar-content-text'
        ref={textTyping}
        isAutoplay={false}
        text={DESCRIPTIONS.join('\n\n')}
      />

      <div className='app__step-sidebar-content-actions'>
        <AppButton
          className='app__step-sidebar-content-actions-btn'
          color='secondary'
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
