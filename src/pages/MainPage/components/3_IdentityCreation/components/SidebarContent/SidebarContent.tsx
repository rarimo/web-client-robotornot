import { motion } from 'framer-motion'
import { FC, useEffect } from 'react'

import { TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTIONS = [
  'Create your profile is just one click and generates a unique identifier within the MetaMask Snap!',
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-3/3_000', 37)
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
          src='/images/sequences/sidebar-3/3_0000.png'
          alt='sidebar-content'
        />
      </div>

      <TypingAnimatedText
        className='app__step-sidebar-content-text'
        ref={textTyping}
        isAutoplay={false}
        text={DESCRIPTIONS.join('\n\n')}
        duration={2}
      />
    </motion.div>
  )
}

export default SidebarContent
