import './styles.scss'

import { config } from '@config'
import { motion } from 'framer-motion'
import { FC, useEffect, useRef } from 'react'

import { TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTIONS = [
  "Since this app is built on the Rarimo protocol, a cross-chain identity layer, This means you don't have to manually handle proofs for different chains. dApps can easily verify your credentials across blockchains, sparing you from additional fees and unnecessary steps.",
  'Learn more about ',
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()
  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-7/7_000', 40)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarAnimationCompleted])

  const preLinkTyping = useRef<{ play: () => void; stop: () => void }>(null)
  const linkTyping = useRef<{ play: () => void; stop: () => void }>(null)

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
        ref={textTyping}
        isAutoplay={false}
        text={DESCRIPTIONS[0]}
        onAnimationComplete={() => {
          preLinkTyping?.current?.play()
        }}
        duration={3}
      />

      <br />
      <br />

      <div className='proof-submitting__sidebar-text-wrp'>
        <TypingAnimatedText
          ref={preLinkTyping}
          isAutoplay={false}
          text={DESCRIPTIONS[1]}
          onAnimationComplete={() => {
            linkTyping?.current?.play()
          }}
          duration={1}
        />

        <a
          className='app__text-link proof-submitting__sidebar-link'
          href={config.EXTERNAL_LANDING_URL}
          target='_blank'
          rel='noreferrer'
        >
          <TypingAnimatedText
            ref={linkTyping}
            isAutoplay={false}
            text={`Rarimo`}
            duration={1}
          />
        </a>
      </div>
    </motion.div>
  )
}

export default SidebarContent
