import './styles.scss'

import { AnimatePresence, motion, type MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useEffect, useRef } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  progress: number
} & MotionProps

const ProgressBar: FC<Props> = ({ progress, ...rest }) => {
  const progressBarEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!progressBarEl) return

    progressBarEl?.current?.style?.setProperty(
      '--progress-bar-progress-value',
      `${progress}%`,
    )
  }, [progress])

  return (
    <AnimatePresence>
      <motion.div
        {...rest}
        ref={progressBarEl}
        className={['progress-bar', rest.className].join(' ')}
      />
    </AnimatePresence>
  )
}

export default ProgressBar
