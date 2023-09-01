import './styles.scss'

import { AnimatePresence, motion, type MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { useInterval } from 'react-use'

import { sleep } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement> & {
  delay: number
  checkpoints: number[] | undefined
  checkpointIndex: number | undefined
  finishCb?: () => void
} & MotionProps

const ProgressBar: FC<Props> = ({
  delay,
  checkpoints,
  checkpointIndex,
  finishCb,
  ...rest
}) => {
  const progressBarEl = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)

  const border = useMemo(
    () =>
      typeof checkpointIndex !== 'undefined'
        ? checkpoints?.[checkpointIndex + 1]
        : checkpoints?.[0],
    [checkpointIndex, checkpoints],
  )

  useInterval(
    () => {
      if (!border) return

      if (progress <= border) {
        setProgress(prev => prev + 1)
      }
    },
    border && progress < 100 ? delay + progress * 10 : null,
  )

  useEffect(() => {
    if (
      typeof checkpointIndex === 'undefined' ||
      !checkpoints?.[checkpointIndex] ||
      progress >= checkpoints?.[checkpointIndex]
    )
      return

    setProgress(checkpoints?.[checkpointIndex])
  }, [checkpointIndex, checkpoints, progress])

  return (
    <AnimatePresence>
      <motion.div
        {...rest}
        ref={progressBarEl}
        className={['progress-bar', rest.className].join(' ')}
      >
        <motion.div
          className='progress-bar__thumb'
          animate={{
            width: `${progress}%`,
          }}
          onAnimationComplete={async () => {
            if (progress < 100) return

            await sleep(500)
            finishCb?.()
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default ProgressBar
