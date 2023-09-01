import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'react-use'

export const useFakeProgress = (
  delay: number,
  checkpoints: number[] | undefined,
  finishCb?: () => void,
) => {
  const [progress, setProgress] = useState(0)
  const [checkpointIndex, _setCheckpointIndex] = useState<number | undefined>(
    undefined,
  )

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

      if (progress < border) {
        setProgress(prev => prev + 1)
      }
    },
    border && progress < 100 ? delay + progress * 10 : null,
  )

  const setCheckpointIndex = useCallback(
    (index: number) => {
      if (!checkpoints) return

      _setCheckpointIndex(index)
      setProgress(checkpoints[index])
    },
    [checkpoints],
  )

  useEffect(() => {
    if (progress < 100) return

    finishCb?.()
  }, [finishCb, progress])

  return {
    progress,
    setProgress,

    checkpointIndex,
    setCheckpointIndex,
  }
}
