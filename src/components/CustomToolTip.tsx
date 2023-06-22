import { Box, useTheme } from '@mui/material'
import { FC, ReactNode } from 'react'

export interface CustomToolTipData {
  legendKey: string
  percentKey?: string
  value: string
  rawValue: number
  percent: string
  fill: string
  legendText: string
}

type CustomToolTipProps = {
  className?: string
  children: (data: CustomToolTipData) => ReactNode
  active?: boolean
  payload?: Array<{
    payload: CustomToolTipData
  }>
}

/**
 * Custom tooltips for recharts
 */
const CustomToolTip: FC<CustomToolTipProps> = props => {
  const { active, payload, children } = props
  const theme = useTheme()

  if (active && payload && payload.length) {
    const { payload: data } = payload?.[0] ?? {}
    return (
      <Box
        sx={{
          maxWidth: 300,
          backgroundColor: theme.palette.background.default,
          padding: theme.spacing(2),
          boxShadow: 'var(--ui-box-shadow)',
          borderRadius: theme.spacing(2),
        }}
      >
        {children(data)}
      </Box>
    )
  }

  return null
}

export default CustomToolTip
