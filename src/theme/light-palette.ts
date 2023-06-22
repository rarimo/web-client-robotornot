import { PaletteOptions } from '@mui/material/styles'

import { LIGHT_PALETTE } from './variables'

export const lightPalette: PaletteOptions = {
  divider: LIGHT_PALETTE.colBgDivider,
  common: {
    black: LIGHT_PALETTE.colDark,
    white: LIGHT_PALETTE.colLight,
  },
  text: {
    primary: LIGHT_PALETTE.colTxtPrimaryLight,
    secondary: LIGHT_PALETTE.colTxtSecondaryLight,
    disabled: LIGHT_PALETTE.colTxtDisabledLight,
  },
  background: {
    default: LIGHT_PALETTE.colBgPrimary,
    paper: LIGHT_PALETTE.colBgPaper,
  },
  primary: {
    light: LIGHT_PALETTE.colPrimaryLight,
    main: LIGHT_PALETTE.colPrimaryMain,
    dark: LIGHT_PALETTE.colPrimaryDark,
    contrastText: LIGHT_PALETTE.colTxtPrimaryDark,
  },
  secondary: {
    light: LIGHT_PALETTE.colSecondaryLight,
    main: LIGHT_PALETTE.colSecondaryMain,
    dark: LIGHT_PALETTE.colSecondaryDark,
    contrastText: LIGHT_PALETTE.colTxtPrimaryDark,
  },
  error: {
    light: LIGHT_PALETTE.colErrorLight,
    main: LIGHT_PALETTE.colErrorMain,
    dark: LIGHT_PALETTE.colErrorDark,
    contrastText: LIGHT_PALETTE.colTxtPrimaryDark,
  },
  success: {
    light: LIGHT_PALETTE.colSuccessLight,
    main: LIGHT_PALETTE.colSuccessMain,
    dark: LIGHT_PALETTE.colSuccessDark,
    contrastText: LIGHT_PALETTE.colTxtPrimaryDark,
  },
  warning: {
    light: LIGHT_PALETTE.colWarningLight,
    main: LIGHT_PALETTE.colWarningMain,
    dark: LIGHT_PALETTE.colWarningDark,
    contrastText: LIGHT_PALETTE.colTxtPrimaryDark,
  },
  info: {
    light: LIGHT_PALETTE.colInfoLight,
    main: LIGHT_PALETTE.colInfoMain,
    dark: LIGHT_PALETTE.colInfoDark,
    contrastText: LIGHT_PALETTE.colTxtPrimaryLight,
  },
  action: {
    selected: 'rgba(0,0,0,0.08)',
  },
}
