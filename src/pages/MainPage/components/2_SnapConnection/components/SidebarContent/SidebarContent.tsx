import { animate, motion, stagger } from 'framer-motion'
import { FC, useCallback, useEffect, useRef } from 'react'

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

  const { isSidebarAnimationCompleted } = useFormStepperContext()

  // const count = useMotionValue(0)
  // const rounded = useTransform(count, latest => Math.round(latest))
  // eslint-disable-next-line max-len
  // const displayText = useTransform(rounded, latest => baseText.slice(0, latest))

  const animateText = useCallback(() => {
    animate(
      '.app__step-sidebar-content-text',
      {
        opacity: 1,
      },
      {
        ease: 'easeInOut',
        delay: stagger(0.4),
      },
    )
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

      <div className='app__step-sidebar-content-text-wrp'>
        {DESCRIPTIONS.map((el, idx) => (
          <p key={idx} className='app__step-sidebar-content-text'>
            {el}
          </p>
        ))}
      </div>
    </motion.div>
  )
}

export default SidebarContent
