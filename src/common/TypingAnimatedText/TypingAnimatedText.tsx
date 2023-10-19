import './styles.scss'

import {
  animate,
  motion,
  MotionProps,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { forwardRef, HTMLAttributes, useImperativeHandle, useMemo } from 'react'
import { useEffectOnce } from 'react-use'

type Props = HTMLAttributes<HTMLParagraphElement> &
  MotionProps & {
    text: string
    isAutoplay?: boolean
  }

const TypingAnimatedText = forwardRef<
  {
    play: () => void
    stop: () => void
  },
  Props
>(({ text, className, isAutoplay = true, ...rest }: Props, ref) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))
  const displayText = useTransform(rounded, latest => text.slice(0, latest))
  const controls = useMemo(
    () =>
      animate(count, text.length, {
        duration: 10,
        ease: 'easeInOut',
        autoplay: false,
      }),
    [count, text.length],
  )

  useImperativeHandle(ref, () => ({
    play() {
      controls.play()
    },
    stop() {
      controls.stop()
    },
  }))

  useEffectOnce(() => {
    if (!isAutoplay) return

    controls.play()

    return controls.stop

    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  return (
    <div className={['typing-animated-text', className].join(' ')}>
      <motion.span className='typing-animated-text__stub'>{text}</motion.span>
      <motion.span className='typing-animated-text__content' {...rest}>
        {displayText}
      </motion.span>
    </div>
  )
})

export default TypingAnimatedText
