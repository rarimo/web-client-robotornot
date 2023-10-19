import { config } from '@config'
import { motion } from 'framer-motion'
import { FC, useEffect } from 'react'

import { TypingAnimatedText } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const DESCRIPTIONS = [
  "Since this app is built on the Rarimo protocol, a cross-chain identity layer, This means you don't have to manually handle proofs for different chains. dApps can easily verify your credentials across blockchains, sparing you from additional fees and unnecessary steps.",
]

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, textTyping, animateSequence } = useSidebarAnimation()
  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-7/7_000', 40)
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
        text={DESCRIPTIONS.join('\n\n')}
      />

      <motion.p
        className='app__step-sidebar-content-text'
        animate={{ display: isSidebarAnimationCompleted ? 'inline' : 'none' }}
        initial={{ display: 'none' }}
        transition={{
          duration: 1,
          ease: 'backInOut',
        }}
      >
        {`Learn more about`}{' '}
        <a
          className='app__text-link'
          href={config.EXTERNAL_LANDING_URL}
          target='_blank'
          rel='noreferrer'
        >
          {`Rarimo`}
        </a>
      </motion.p>
    </motion.div>
  )
}

export default SidebarContent
