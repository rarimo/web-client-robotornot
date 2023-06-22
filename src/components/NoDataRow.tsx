import { Stack, Typography, useTheme } from '@mui/material'
import { DbError, DbWarning } from 'iconoir-react'
import { useTranslation } from 'react-i18next'

interface INoDataTableRowProps {
  message?: string
  error?: boolean
}

const NoDataRow = ({ message, error }: INoDataTableRowProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const msg = error ? t('common.loading-error-msg') : message

  const color = error ? theme.palette.error.main : theme.palette.primary.main

  const iconProps = {
    color,
    width: '1.35rem',
    height: '1.35rem',
    'aria-hidden': true,
    style: { minWidth: '1.35rem', minHeight: '1.35rem' },
  }
  const icon = error ? <DbError {...iconProps} /> : <DbWarning {...iconProps} />

  return (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      spacing={theme.spacing(1)}
      direction={'row'}
    >
      {icon}
      <Typography
        color={color}
        variant={'body1'}
        sx={{ fontWeight: theme.typography.fontWeightMedium }}
      >
        {msg}
      </Typography>
    </Stack>
  )
}

export default NoDataRow
