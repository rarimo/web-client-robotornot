import { motion } from 'framer-motion'
import { FC, useEffect } from 'react'

import { TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-5/5_000', 32)
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
          src='/images/sequences/sidebar-5/5_0000.png'
          alt='sidebar-content'
        />
      </div>
      <TypingAnimatedText
        className='app__step-sidebar-content-text'
        ref={textTyping}
        isAutoplay={false}
        text={`Zero-Knowledge Proofs (ZKPs) have been a theoretical concept in cryptography since the 1980s. However, their widespread practical use and adoption in identity systems have predominantly emerged in the 2020s.In a sense, you're part of a historic moment.`}
        duration={5}
      />
    </motion.div>
  )
}

export default SidebarContent
