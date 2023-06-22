import {
  SxProps,
  Tooltip as TooltipBase,
  Typography,
  useTheme,
} from '@mui/material'
import { isString } from 'lodash-es'
import { useState } from 'react'

const Tooltip = ({
  children,
  message,
  sx = { minWidth: 300 },
  disabled = false,
}: {
  children: JSX.Element
  message: string | JSX.Element
  sx?: SxProps
  disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)

  const theme = useTheme()

  const handleClose = () => {
    if (disabled) return
    setOpen(false)
  }

  const handleOpen = () => {
    if (disabled) return
    setOpen(true)
  }

  const title = isString(message) ? (
    <Typography variant='caption' color={theme.palette.text.secondary}>
      {message}
    </Typography>
  ) : (
    message
  )

  return (
    <TooltipBase
      disableFocusListener
      title={title}
      enterDelay={500}
      leaveDelay={200}
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      componentsProps={{ tooltip: { sx } }}
    >
      {children}
    </TooltipBase>
  )
}

export default Tooltip
