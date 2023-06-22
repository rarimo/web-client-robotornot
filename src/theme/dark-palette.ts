import { PaletteOptions } from '@mui/material/styles'

import { DARK_PALETTE } from '@/theme/variables'

export const darkPalette: PaletteOptions = {
  divider: DARK_PALETTE.colBgDivider,
  common: {
    black: DARK_PALETTE.colDark,
    white: DARK_PALETTE.colLight,
  },
  text: {
    primary: DARK_PALETTE.colTxtPrimaryLight,
    secondary: DARK_PALETTE.colTxtSecondaryLight,
    disabled: DARK_PALETTE.colTxtDisabledLight,
  },
  background: {
    default: DARK_PALETTE.colBgPrimary,
    paper: DARK_PALETTE.colBgPaper,
  },
  primary: {
    light: DARK_PALETTE.colPrimaryLight,
    main: DARK_PALETTE.colPrimaryMain,
    dark: DARK_PALETTE.colPrimaryDark,
    contrastText: DARK_PALETTE.colTxtPrimaryLight,
  },
  secondary: {
    light: DARK_PALETTE.colSecondaryLight,
    main: DARK_PALETTE.colSecondaryMain,
    dark: DARK_PALETTE.colSecondaryDark,
    contrastText: DARK_PALETTE.colTxtPrimaryLight,
  },
  error: {
    light: DARK_PALETTE.colErrorLight,
    main: DARK_PALETTE.colErrorMain,
    dark: DARK_PALETTE.colErrorDark,
    contrastText: DARK_PALETTE.colTxtPrimaryLight,
  },
  success: {
    light: DARK_PALETTE.colSuccessLight,
    main: DARK_PALETTE.colSuccessMain,
    dark: DARK_PALETTE.colSuccessDark,
    contrastText: DARK_PALETTE.colTxtPrimaryLight,
  },
  warning: {
    light: DARK_PALETTE.colWarningLight,
    main: DARK_PALETTE.colWarningMain,
    dark: DARK_PALETTE.colWarningDark,
    contrastText: DARK_PALETTE.colTxtPrimaryLight,
  },
  info: {
    light: DARK_PALETTE.colInfoLight,
    main: DARK_PALETTE.colInfoMain,
    dark: DARK_PALETTE.colInfoDark,
    contrastText: DARK_PALETTE.colTxtPrimaryLight,
  },
}
