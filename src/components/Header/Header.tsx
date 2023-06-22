import { AppBar, Box, Button, IconButton, Stack, useTheme } from '@mui/material'
import { Brightness, LogOut, Menu } from 'iconoir-react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { HeaderMenuList, HeaderSwitcherNetwork, Logo } from '@/components'
import { ColorModeContext } from '@/contexts'
import { useWeb3 } from '@/hooks'

const Header = ({
  isMobileNavbarOpened,
  toggle,
}: {
  isMobileNavbarOpened: boolean
  toggle: () => void
}) => {
  const { connect, disconnect, isConnected, isConnecting } = useWeb3()
  const { t } = useTranslation()
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)

  return (
    <AppBar
      position='fixed'
      sx={{
        display: 'flex',
        flexDirection: 'row',
        boxShadow: 'none',
        borderBottom: '1px solid var(--col-border-light)',
        height: 'var(--ui-appbar-height)',
        bgcolor: 'var(--col-bg-primary)',
        color: theme.palette.secondary.main,
        p: theme.spacing(1.75, 2.5, 1.75, 4.5),
      }}
    >
      <IconButton
        size='small'
        color='inherit'
        aria-label={String(
          isMobileNavbarOpened ? t('common.close-btn') : t('common.open-btn'),
        )}
        edge='start'
        onClick={toggle}
        sx={{
          color: theme.palette.text.primary,
          display: { md: 'none' },
        }}
      >
        <Menu aria-hidden='true' />
      </IconButton>

      <Stack
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
        sx={{
          maxWidth: 'var(--ui-max-width)',
          m: '0 auto',
          width: '100%',
          flex: '1',
        }}
      >
        <Box
          component='div'
          width={24}
          aria-hidden='true'
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        />

        <Logo />

        <HeaderMenuList />

        {isConnected ? (
          <Button
            size='small'
            variant='outlined'
            aria-label={t('common.disconnect-wallet-btn')}
            sx={{
              p: theme.spacing(1, 1.5),
              height: theme.spacing(5.5),
              minWidth: theme.spacing(6),
              display: { xs: 'none', md: 'block' },
            }}
            onClick={disconnect}
          >
            <LogOut
              aria-hidden='true'
              style={{ marginLeft: '-1px', marginTop: '1px' }}
            />
          </Button>
        ) : (
          <Button
            size='small'
            sx={{
              minWidth: '170px',
              display: { xs: 'none', md: 'block' },
            }}
            onClick={connect}
            disabled={isConnecting}
          >
            {t('common.connect-wallet-btn')}
          </Button>
        )}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <HeaderSwitcherNetwork />
        </Box>
      </Stack>
      <IconButton
        size='small'
        color='inherit'
        onClick={colorMode.toggleColorMode}
        sx={{
          pl: { xs: theme.spacing(2.5), lg: 0 },
          margin: 'auto 0',
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.getContrastText(theme.palette.text.primary),
          },
        }}
      >
        <Brightness width={36} height={36} aria-hidden='true' />
      </IconButton>
    </AppBar>
  )
}

export default Header
