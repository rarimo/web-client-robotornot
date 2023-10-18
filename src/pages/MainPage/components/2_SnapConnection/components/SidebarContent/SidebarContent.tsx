import { motion } from 'framer-motion'
import { FC, useCallback, useEffect, useRef } from 'react'

import { TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { sleep } from '@/helpers'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTIONS = [
  'RariMe Snap allows users to store and manage identity credentials through MetaMask wallet',
  'You can utilize the RariMe Identity Snap to seamlessly integrate any identity credential and use them across various blockchains without any additional effort.',
  'Is not that cool? Same wallet for managing your Crypto and identity',
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const imageSeq = useRef<HTMLImageElement>(null)
  const textTyping = useRef<{ play: () => void; stop: () => void }>(null)

  const { isSidebarAnimationCompleted } = useFormStepperContext()

  const animateText = useCallback(() => {
    textTyping.current?.play()
  }, [])

  const animateSequence = useCallback(async () => {
    if (!imageSeq.current) return

    for (let i = 0; i < 59; i++) {
      await sleep(1000 / 59)

      imageSeq.current.src = `/images/sequences/sidebar-2/2_000${i + 10}.png`
    }

    animateText()
  }, [animateText, imageSeq])

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence()
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
          src='/images/sequences/sidebar-2/2_00010.png'
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
