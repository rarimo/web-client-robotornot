import { debounce } from 'lodash-es'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks'
import { setViewportWidth, viewportWidth as _viewportWidth } from '@/store'

export const useViewportSizes = () => {
  const dispatch = useAppDispatch()
  const viewportWidth = useAppSelector(_viewportWidth)

  const setViewportSizes = () => {
    assignVhCssVariable()
    dispatch(setViewportWidth(window.innerWidth))
  }

  const assignVhCssVariable = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  const setViewportSizesDebounced = debounce(setViewportSizes, 300)

  useEffect(
    () => {
      assignVhCssVariable()
      window.addEventListener('resize', setViewportSizesDebounced)

      return () =>
        window.removeEventListener('resize', setViewportSizesDebounced)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return { viewportWidth }
}
