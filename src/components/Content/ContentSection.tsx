import { IconButton, Stack, Typography, useTheme } from '@mui/material'
import { ArrowLeftCircle } from 'iconoir-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const ContentSection = ({
  title,
  action,
  children,
  withBackButton = false,
}: {
  title?: string
  action?: JSX.Element
  children: JSX.Element | JSX.Element[]
  withBackButton?: boolean
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Stack component='section' className='Section' spacing={theme.spacing(3)}>
      {(title || action) && (
        <Stack direction='row' alignItems='center' flex={1}>
          {withBackButton && (
            <IconButton
              onClick={goBack}
              sx={{
                width: theme.spacing(3.5),
                height: theme.spacing(3.5),
                mr: theme.spacing(2),
              }}
              aria-label={t('common.back-btn')}
            >
              <ArrowLeftCircle aria-hidden='true' />
            </IconButton>
          )}

          <Stack
            className='Section__header'
            direction='row'
            alignItems='center'
            flex={1}
            justifyContent='space-between'
            height='56px'
          >
            {title && <Typography variant='h4'>{title}</Typography>}
            {action}
          </Stack>
        </Stack>
      )}

      {children}
    </Stack>
  )
}

export default ContentSection
