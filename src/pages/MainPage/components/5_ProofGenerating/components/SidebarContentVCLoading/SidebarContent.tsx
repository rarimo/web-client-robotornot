import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'

import { AppButton, TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import SidebarGame from '@/pages/MainPage/components/5_ProofGenerating/components/SidebarGame'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTION = [
  `Identity credential is a piece of evidence or an attestation that verifies the identity or attributes of you.`,
  `The credential is encrypted within the MetaMask Snap (RariMe) wallet and only you the owner have the ability to unlock and access them.`,
  `Do you know the most significant innovation here? Once you're verified as a human, you can use this credential universally across various blockchain dApps and channels. This means you won't need to re-authorize or provide any additional information repeatedly.`,
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const [isGameBtnShown, setIsGameBtnShown] = useState(false)
  const { setIsSidebarClosingDisabled } = useFormStepperContext()

  const [isGameShown, setIsGameShown] = useState(false)

  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-5/5_000', 32)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarAnimationCompleted, imageSeq])

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
        onAnimationComplete={() => {
          setIsGameBtnShown(true)
        }}
      />
      <motion.div className='app__step-sidebar-content-actions'>
        <AnimatePresence>
          {isGameBtnShown && (
            <motion.div
              className='app__step-sidebar-content-actions-btn-wrp'
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{
                opacity: 1,
                y: [20, 0],
                scale: [0.9, 1],
                height: 'auto',
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: 'backInOut',
              }}
            >
              <AppButton
                className='app__step-sidebar-content-actions-btn'
                color='secondary'
                text={`Play Game`}
                modification='border-circle'
                size='small'
                onClick={() => {
                  setIsGameShown(prevState => !prevState)
                  setIsSidebarClosingDisabled(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <SidebarGame isShown={isGameShown} setIsShown={setIsGameShown} />
    </motion.div>
  )
}

export default SidebarContent
