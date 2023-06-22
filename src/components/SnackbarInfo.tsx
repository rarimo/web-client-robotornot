import {
  Alert,
  AlertColor,
  AlertTitle,
  Snackbar,
  SnackbarOrigin,
  useTheme,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import { Check, WarningCircle, WarningTriangle } from 'iconoir-react'
import { SyntheticEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const getIconBySeverity = (theme: Theme, severity: AlertColor) => {
  const color = theme.palette[severity].dark
  const iconProps = {
    'aria-hidden': true,
    color,
  }

  const icon = {
    error: <WarningCircle {...iconProps} />,
    info: <WarningCircle {...iconProps} />,
    success: <Check {...iconProps} />,
    warning: <WarningTriangle {...iconProps} />,
  }[severity]

  return { icon, color }
}

const SnackbarInfo = ({
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  autoHideDuration = 5000,
  isOpened,
  message,
  close,
  severity = 'info',
}: {
  anchorOrigin?: SnackbarOrigin
  autoHideDuration?: number
  isOpened: boolean
  message: string
  close?: () => void
  severity: AlertColor
}) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const { icon, color } = getIconBySeverity(theme, severity || 'info')

  const onClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    close && close()
  }

  const title = useMemo(() => {
    if (severity === 'error') return t('snackbar-info.title-error')
    if (severity === 'success') return t('snackbar-info.title-success')
    if (severity === 'warning') return t('snackbar-info.title-warning')
    if (severity === 'info') return t('snackbar-info.title-info')
  }, [severity, t])

  const topPadding = `calc(var(--ui-appbar-height) + ${theme.spacing(2)})`

  return (
    <Snackbar
      {...(anchorOrigin && { anchorOrigin })}
      {...(autoHideDuration && { autoHideDuration })}
      {...(close && { onClose })}
      open={isOpened}
      sx={{
        top: { xs: topPadding, md: topPadding },
        minWidth: { xs: '80vw', md: 400 },
        maxWidth: { xs: '80vw', md: 400 },
        '& > .MuiPaper-root': {
          borderColor: color,
        },
      }}
    >
      <Alert
        {...(close && { onClose })}
        sx={{
          width: '100%',
          '& > .MuiAlert-message': {
            wordBreak: 'break-word',
          },
        }}
        icon={icon}
        severity={severity}
        elevation={6}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarInfo
