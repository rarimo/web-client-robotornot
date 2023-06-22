// eslint-disable-next-line no-restricted-imports
import { TypographyOptions } from '@mui/material/styles/createTypography'

import { TYPOGRAPHY } from '@/theme/variables'

export const typographyTheme: TypographyOptions = {
  htmlFontSize: 16,
  fontFamily: TYPOGRAPHY.txtFontFamily,
  fontSize: Number(TYPOGRAPHY.txtFontSizeRegular),
  fontWeightLight: TYPOGRAPHY.txtFontWeightLight,
  fontWeightRegular: TYPOGRAPHY.txtFontWeightRegular,
  fontWeightMedium: TYPOGRAPHY.txtFontWeightMedium,
  fontWeightBold: TYPOGRAPHY.txtFontWeightBold,
  h1: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightH1,
    fontSize: TYPOGRAPHY.txtFontSizeH1,
    lineHeight: TYPOGRAPHY.txtFontLineHeightH1,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingH1,
  },
  h2: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightH2,
    fontSize: TYPOGRAPHY.txtFontSizeH2,
    lineHeight: TYPOGRAPHY.txtFontLineHeightH2,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingH2,
  },
  h3: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightH3,
    fontSize: TYPOGRAPHY.txtFontSizeH3,
    lineHeight: TYPOGRAPHY.txtFontLineHeightH3,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingH3,
  },
  h4: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightH4,
    fontSize: TYPOGRAPHY.txtFontSizeH4,
    lineHeight: TYPOGRAPHY.txtFontLineHeightH4,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingH4,
  },
  subtitle1: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightSubtitle1,
    fontSize: TYPOGRAPHY.txtFontSizeSubtitle1,
    lineHeight: TYPOGRAPHY.txtFontLineHeightSubtitle1,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingSubtitle1,
  },
  subtitle2: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightSubtitle2,
    fontSize: TYPOGRAPHY.txtFontSizeSubtitle2,
    lineHeight: TYPOGRAPHY.txtFontLineHeightSubtitle2,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingSubtitle2,
  },
  body1: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightBody1,
    fontSize: TYPOGRAPHY.txtFontSizeBody1,
    lineHeight: TYPOGRAPHY.txtFontLineHeightBody1,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingBody1,
  },
  button: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightButton,
    fontSize: TYPOGRAPHY.txtFontSizeButton,
    lineHeight: TYPOGRAPHY.txtFontLineHeightButton,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingButton,
    textTransform: 'none',
  },
  caption: {
    fontFamily: TYPOGRAPHY.txtFontFamily,
    fontWeight: TYPOGRAPHY.txtFontWeightCaption,
    fontSize: TYPOGRAPHY.txtFontSizeCaption,
    lineHeight: TYPOGRAPHY.txtFontLineHeightCaption,
    letterSpacing: TYPOGRAPHY.txtFontLetterSpacingCaption,
  },
}
