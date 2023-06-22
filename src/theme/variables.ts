import { PaletteColors, Typography } from '@/types'

import darkPalette from './dark-palette.module.scss'
import lightPalette from './light-palette.module.scss'
import theme from './theme.module.scss'

export const TYPOGRAPHY = theme as unknown as Typography
export const DARK_PALETTE = darkPalette as unknown as PaletteColors
export const LIGHT_PALETTE = lightPalette as unknown as PaletteColors
