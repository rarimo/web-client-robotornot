import { Theme } from '@mui/material/styles'

import { FontWeight } from '@/enums'
import { ColorString } from '@/types'

export type BaseTheme = Omit<Theme, 'components'>

export type Typography = {
  txtFontFamily: string

  txtFontWeightLight: FontWeight.Light
  txtFontWeightRegular: FontWeight.Regular
  txtFontWeightMedium: FontWeight.Medium
  txtFontWeightSemiBold: FontWeight.SemiBold
  txtFontWeightBold: FontWeight.Bold
  txtFontWeightExtraBold: FontWeight.ExtraBold

  txtFontSizeRegular: string
  txtFontSizeH1: string
  txtFontSizeH2: string
  txtFontSizeH3: string
  txtFontSizeH4: string
  txtFontSizeSubtitle1: string
  txtFontSizeSubtitle2: string
  txtFontSizeBody1: string
  txtFontSizeButton: string
  txtFontSizeCaption: string

  txtFontLineHeightH1: number
  txtFontLineHeightH2: number
  txtFontLineHeightH3: number
  txtFontLineHeightH4: number
  txtFontLineHeightSubtitle1: number
  txtFontLineHeightSubtitle2: number
  txtFontLineHeightBody1: number
  txtFontLineHeightButton: number
  txtFontLineHeightCaption: number

  txtFontLetterSpacingH1: string | number
  txtFontLetterSpacingH2: string | number
  txtFontLetterSpacingH3: string | number
  txtFontLetterSpacingH4: string | number
  txtFontLetterSpacingSubtitle1: string | number
  txtFontLetterSpacingSubtitle2: string | number
  txtFontLetterSpacingBody1: string | number
  txtFontLetterSpacingButton: string | number
  txtFontLetterSpacingCaption: string | number

  txtFontWeightH1: number
  txtFontWeightH2: number
  txtFontWeightH3: number
  txtFontWeightH4: number
  txtFontWeightSubtitle1: number
  txtFontWeightSubtitle2: number
  txtFontWeightBody1: number
  txtFontWeightButton: number
  txtFontWeightCaption: number
}

export type PaletteColors = {
  colLight: ColorString
  colDark: ColorString
  colPrimaryLight: ColorString
  colPrimaryMain: ColorString
  colPrimaryDark: ColorString
  colSecondaryLight: ColorString
  colSecondaryMain: ColorString
  colSecondaryDark: ColorString
  colErrorLight: ColorString
  colErrorMain: ColorString
  colErrorDark: ColorString
  colWarningLight: ColorString
  colWarningMain: ColorString
  colWarningDark: ColorString
  colSuccessLight: ColorString
  colSuccessMain: ColorString
  colSuccessDark: ColorString
  colInfoLight: ColorString
  colInfoMain: ColorString
  colInfoDark: ColorString
  colLightLight: ColorString
  colLightMain: ColorString
  colLightDark: ColorString
  colBgPrimary: ColorString
  colBgSecondary: ColorString
  colBgPaper: ColorString
  colBgTertiary: ColorString
  colBgDivider: ColorString
  colTxtPrimaryLight: ColorString
  colTxtPrimaryDark: ColorString
  colTxtSecondaryLight: ColorString
  colTxtSecondaryDark: ColorString
  colTxtDisabledLight: ColorString
  colTxtDisabledDark: ColorString
  colBorderLight: ColorString
}
