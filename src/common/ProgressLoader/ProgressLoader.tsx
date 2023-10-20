import './styles.scss'

import { AnimatePresence, motion, type MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { useInterval } from 'react-use'

import { ICON_NAMES } from '@/enums'
import { sleep } from '@/helpers'

import { ProgressLoaderPulse, ProgressLoaderSkeleton } from './components'

type Props = HTMLAttributes<HTMLDivElement> & {
  delay: number
  checkpoints: number[] | undefined
  checkpointIndex: number | undefined
  finishCb?: () => void
  variant?: 'pulse' | 'skeleton'
  iconNameOrImgUrl?: ICON_NAMES | string
} & MotionProps

const ProgressLoader: FC<Props> = ({
  delay,
  checkpoints,
  checkpointIndex,
  finishCb,
  variant = 'pulse',
  iconNameOrImgUrl,
  ...rest
}) => {
  const progressBarEl = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)

  const AnimationComponent = useMemo(
    () =>
      ({
        pulse: ProgressLoaderPulse,
        skeleton: ProgressLoaderSkeleton,
      }[variant]),
    [variant],
  )

  const border = useMemo(() => {
    if (!checkpoints) return null

    // FIXME
    return typeof checkpointIndex !== 'undefined'
      ? checkpoints?.[checkpointIndex + 1]
      : checkpoints?.[0]
  }, [checkpointIndex, checkpoints])

  useInterval(
    () => {
      /* stop progress until checkpoint will be set to 100 outside */
      if (!border || progress >= 98) return

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
        className={['progress-loader', rest.className].join(' ')}
      >
        <AnimationComponent
          className='progress-loader__variant'
          onAnimationComplete={async () => {
            if (progress < 100) return

            await sleep(500)
            finishCb?.()
          }}
          iconNameOrImgUrl={iconNameOrImgUrl}
        />

        <span className='progress-loader__progress'>{`${progress}%`}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProgressLoader
