import { Box, Link, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { RoutePaths } from '@/enums'

interface IProps {
  title: string
  isError: boolean
  actions: { label: string; link: RoutePaths }
  isLoading: boolean
  children: JSX.Element[] | JSX.Element
}

const PreviewList = ({ title, children, actions }: IProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const style = {
    wrapper: {
      margin: { xs: theme.spacing(0.5, 0) },
      border: '1px solid var(--col-border-light)',
      borderRadius: theme.spacing(0.8),
      padding: theme.spacing(2, 2.5),
    },
    card: {
      borderBottom: '1px solid var(--col-border-light)',
    },
  }

  return (
    <Box sx={style.wrapper} aria-label={t('transactions-list.title')}>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography component={'h3'} variant={'h6'}>
          {title}
        </Typography>
        <Link component={NavLink} to={actions.link}>
          {actions.label}
        </Link>
      </Stack>
      {Boolean(children) && <div>{children}</div>}
    </Box>
  )
}

export default PreviewList
