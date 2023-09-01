import './styles.scss'

import { AnimatePresence, motion, type MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { useInterval } from 'react-use'

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

  useEffect(() => {
    if (progress >= 100) {
      finishCb?.()
    }
  }, [finishCb, progress])

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
