import {
  Dialog as DialogBase,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from '@mui/material'
import { Cancel } from 'iconoir-react'
import { uniqueId } from 'lodash-es'
import { useTranslation } from 'react-i18next'

const Dialog = ({
  children,
  onClose,
  isOpened,
  title,
  action,
}: {
  children: JSX.Element | JSX.Element[]
  action: JSX.Element | JSX.Element[]
  onClose: () => void
  isOpened: boolean
  title: string
}) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const dialogTitleId = `dialog-title-${uniqueId()}`
  const dialogPadding = theme.spacing(4.5, 6)

  return (
    <DialogBase
      scroll='paper'
      onClose={onClose}
      aria-labelledby={dialogTitleId}
      open={isOpened}
      sx={{
        '& > .MuiDialog-container > .MuiPaper-root': {
          borderRadius: theme.spacing(2),
          minWidth: { xs: '95vw', sm: '500px' },
          maxWidth: { xs: '95vw', sm: '500px' },
        },
      }}
    >
      <DialogTitle
        id={dialogTitleId}
        sx={{
          p: dialogPadding,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}

        <IconButton
          onClick={onClose}
          sx={{ width: theme.spacing(3), height: theme.spacing(3) }}
          aria-label={t('common.close-btn')}
        >
          <Cancel aria-hidden='true' />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: dialogPadding }}>
        {children}
      </DialogContent>
      <DialogActions
        sx={{
          p: dialogPadding,

          '& > :not(:first-of-type)': {
            ml: theme.spacing(3),
          },
        }}
      >
        {action}
      </DialogActions>
    </DialogBase>
  )
}

export default Dialog
