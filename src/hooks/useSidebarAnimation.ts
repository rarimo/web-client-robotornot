import { useCallback, useRef } from 'react'

import { sleep } from '@/helpers'

export const useSidebarAnimation = () => {
  const imageSeq = useRef<HTMLImageElement>(null)
  const textTyping = useRef<{ play: () => void; stop: () => void }>(null)

  const animateText = useCallback(() => {
    textTyping.current?.play()
  }, [])

  const animateSequence = useCallback(
    async (imagePrefix: string, imagesAmount: number, durationMs = 1000) => {
      if (!imageSeq.current) return

      for (let i = 0; i < imagesAmount; i++) {
        await sleep(durationMs / imagesAmount)

        imageSeq.current.src = `${imagePrefix}${i}.png`
      }

      animateText()
    },
    [animateText, imageSeq],
  )

  return {
    imageSeq,
    textTyping,

    animateText,
    animateSequence,
  }
}
