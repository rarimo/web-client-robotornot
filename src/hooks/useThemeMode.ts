import { createTheme, useMediaQuery } from '@mui/material'
import { useEffect, useMemo } from 'react'

import { ThemeMode } from '@/enums'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setThemeMode, themeMode as _themeMode } from '@/store'
import {
  componentsTheme,
  darkPalette,
  lightPalette,
  typographyTheme,
} from '@/theme'

const THEME_CLASSES = {
  [ThemeMode.Light]: 'App__light',
  [ThemeMode.Dark]: 'App__dark',
}

export const useThemeMode = () => {
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector(_themeMode)
  const isPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const mode = useMemo(() => {
    if (themeMode) return themeMode
    if (isPrefersDarkMode) return ThemeMode.Dark
    return ThemeMode.Light
  }, [themeMode, isPrefersDarkMode])

  const isDarkThemeMode = useMemo(() => mode === ThemeMode.Dark, [mode])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        document.body.classList.remove(THEME_CLASSES[themeMode as ThemeMode])
        const newMode =
          themeMode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
        dispatch(setThemeMode(newMode))
        document.body.classList.add(THEME_CLASSES[newMode])
      },
    }),
    [dispatch, themeMode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(themeMode === ThemeMode.Dark ? darkPalette : lightPalette),
        },
        typography: typographyTheme,
        components: componentsTheme,
        shape: {
          borderRadius: 8,
        },
      }),
    [mode, themeMode],
  )

  useEffect(() => {
    document.body.classList.add(
      THEME_CLASSES[themeMode as ThemeMode] ||
        THEME_CLASSES[isPrefersDarkMode ? ThemeMode.Dark : ThemeMode.Light],
    )
    if (themeMode) return
    dispatch(setThemeMode(mode))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { colorMode, theme, isDarkThemeMode }
}
